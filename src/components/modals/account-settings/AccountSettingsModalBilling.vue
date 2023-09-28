<template>
  <div class="billing">
    <div class="billing__desc">
      <p>
        Use this screen to manage your payment, top-up, and spending limits
        settings.
      </p>
    </div>

    <div class="billing-balance">
      <div class="billing-balance__label">Current Balance</div>
      <div class="billing-balance__total">${{ state.currentBalance }}</div>
    </div>

    <div class="billing-section">
      <div class="billing-section__header">
        <div>
          <div class="billing-section__title">Billing Settings</div>
          <p class="billing-section__desc">
            Your account will be automatically billed when your balance reaches
            the threshold shown below.
          </p>
        </div>
      </div>

      <div class="billing-section__body">
        <div class="billing-top-up">
          <div>
            <div class="billing-top-up__row">
              <label class="billing-top-up__label" for="balance-falls-below">
                Billing Threshold:
              </label>

              <div class="billing-top-up__field">
                <div
                  class="billing-top-up__currency-sign text-2xl font-semibold"
                >
                  ${{ state.billingThreshold }}
                </div>
                <div class="mt-5">
                  Too many transactions? Contact us at hello@nokori.com to
                  request raising this threshold amount.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="billing-section">
      <div class="billing-section__header">
        <div>
          <div class="billing-section__title">Payment Methods</div>
        </div>

        <div class="billing-section__actions">
          <div class="billing-section__btn billing-section__btn--card">
            <BaseButton
              btn-style="secondary"
              type="button"
              @click="toggleAddPaymentMethodModal"
            >
              Add Card
              <IconCreditCardSolid />
            </BaseButton>
          </div>
        </div>
      </div>

      <template v-if="state.paymentMethods.isLoading">
        <LoadingIndicator />
      </template>

      <template v-else-if="state.paymentMethods.error">
        <BaseError>
          {{ state.paymentMethods.error.message }}
        </BaseError>
      </template>

      <div v-else class="billing-section__body">
        <table class="billing-table">
          <tr
            v-for="method in state.paymentMethods.data"
            :key="method.methodId"
            class="billing-table__tr"
          >
            <td class="billing-table__td billing-table__td--icon">
              <div
                :class="`billing-table__icon billing-table__icon--${method.type}`"
              >
                <template v-if="method.type === 'card'">
                  <IconCreditCardSolid />
                </template>

                <template v-else-if="method.type === 'account'">
                  <IconLandmarkSolid />
                </template>
              </div>
            </td>

            <td class="billing-table__td">
              <div class="billing-table__info">
                {{ method.card.brand.toUpperCase() }} **** **** ****
                {{ method.card.last4 }}<br />
                {{ method.card.exp_month }}-{{ method.card.exp_year }}&nbsp;{{
                  method.card.funding.toUpperCase()
                }}
              </div>
            </td>

            <td class="billing-table__td billing-table__td--status">
              <div v-if="method.isDefault" class="billing-table__default">
                Default
              </div>

              <button
                v-else
                class="billing-table__default-btn"
                type="button"
                @click="updateDefaultPaymentMethod(method.methodId)"
              >
                Make Default
              </button>
            </td>

            <td class="billing-table__td billing-table__td--remove">
              <button
                class="billing-table__remove-btn"
                type="button"
                @click="handleDeleteButtonClick(method.methodId)"
              >
                <IconTrashCanRegular />
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition>
      <BaseDeletionModal
        v-if="state.isDeletePaymentMethodModalOpen"
        title="Delete payment method"
        text="Are you sure you want to delete this payment method?"
        :is-loading="state.deletingPaymentMethod.isLoading"
        @close="toggleDeletePaymentMethodModal"
        @delete="deletePaymentMethod"
      />
    </Transition>

    <Transition>
      <AddPaymentMethodModal
        v-if="state.isAddPaymentMethodModalOpen"
        title="Enter Payment Details"
        @close="toggleAddPaymentMethodModal"
        @payment-method-added="fetchPaymentMethods"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import PaymentsService from '@/services/payments.service'
import useUserStore from '@/stores/user.store'
import type AccountSettingsModalBillingState from '@/types/components/modals/account-settings/AccountSettingsModalBillingState.interface'
import BillingService from '@/services/billing.service'
import AccountService from '@/services/accounts.service'
import AccountSettingsEnums from '@/enums/accounts/AccountsSettings.enum'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const state: AccountSettingsModalBillingState = reactive({
  paymentMethods: {
    data: [],
    isLoading: false,
    error: null
  },
  updatingDefaultPaymentMethod: {
    isLoading: false,
    error: null
  },
  deletingPaymentMethod: {
    paymentMethodIdToDelete: null,
    isLoading: false,
    error: null
  },
  isAddPaymentMethodModalOpen: false,
  isDeletePaymentMethodModalOpen: false,
  currentBalance: 0,
  billingThreshold: 10.0
})

async function fetchPaymentMethods() {
  state.paymentMethods.error = null
  state.paymentMethods.isLoading = true

  try {
    const { data } = await PaymentsService.getPaymentMethods()
    state.paymentMethods.data = data
  } catch (error: unknown) {
    state.paymentMethods.error = error as Error
  } finally {
    state.paymentMethods.isLoading = false
  }
}

async function updateDefaultPaymentMethod(methodId: string) {
  state.updatingDefaultPaymentMethod.error = null
  state.updatingDefaultPaymentMethod.isLoading = true

  try {
    await PaymentsService.updatePaymentMethod(methodId)
    fetchPaymentMethods()
  } catch (error: unknown) {
    // TODO: add error handling in UI
    state.updatingDefaultPaymentMethod.error = error as Error
  } finally {
    state.updatingDefaultPaymentMethod.isLoading = false
  }
}

async function deletePaymentMethod() {
  state.deletingPaymentMethod.error = null
  state.deletingPaymentMethod.isLoading = true

  try {
    if (state.deletingPaymentMethod.paymentMethodIdToDelete) {
      await PaymentsService.deletePaymentMethod(
        state.deletingPaymentMethod.paymentMethodIdToDelete
      )

      toggleDeletePaymentMethodModal()
      fetchPaymentMethods()

      state.deletingPaymentMethod.paymentMethodIdToDelete = null
    }
  } catch (error: unknown) {
    // TODO: add error handling in UI
    state.deletingPaymentMethod.error = error as Error
  } finally {
    state.deletingPaymentMethod.isLoading = false
  }
}

function handleDeleteButtonClick(methodId: string) {
  state.deletingPaymentMethod.paymentMethodIdToDelete = methodId
  toggleDeletePaymentMethodModal()
}

function toggleAddPaymentMethodModal() {
  state.isAddPaymentMethodModalOpen = !state.isAddPaymentMethodModalOpen
}

function toggleDeletePaymentMethodModal() {
  state.isDeletePaymentMethodModalOpen = !state.isDeletePaymentMethodModalOpen
}

async function fetchAccountBalance() {
  const { data: balanceRequest } = await BillingService.getAccountBalance()
  if (balanceRequest) {
    state.currentBalance = Math.abs(balanceRequest.balance)
  }
}

async function getBillingThreshold() {
  if (user.value) {
    const accountId = user.value.accountId
    const { data: thresholdRequest } = await AccountService.getAccountSetting(
      accountId,
      AccountSettingsEnums.BILLING_THRESHOLD
    )

    if (thresholdRequest?.value) {
      state.billingThreshold = parseInt(thresholdRequest.value)
    } else {
      state.billingThreshold = 10.0
    }
  }
}

fetchPaymentMethods()
fetchAccountBalance()
getBillingThreshold()
</script>

<style scoped lang="scss">
.billing {
  padding-top: toRem(18px);
  padding-bottom: toRem(18px);

  &__desc {
    @include clear-children-margins;
    margin-bottom: toRem(30px);
    font-size: toRem(16px);
    line-height: 1.5;
  }
}

.billing-balance {
  margin-bottom: toRem(28px);

  &__label {
    margin-bottom: toRem(8px);
    font-size: toRem(16px);
    font-weight: 700;
    line-height: 1.2;
  }

  &__total {
    color: #fff;
    font-size: toRem(38px);
    line-height: 1.2;
  }
}

.billing-section {
  margin-bottom: toRem(35px);
  padding-top: toRem(25px);
  padding-bottom: toRem(35px);
  padding-left: toRem(25px);
  padding-right: toRem(25px);
  background-color: #27282c;
  border-radius: toRem(6px);

  &:last-child {
    margin-bottom: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: toRem(18px);
    border-bottom: 1px solid #3a3d45;
  }

  &__title {
    font-size: toRem(18px);
    font-weight: 700;
    line-height: 1.2;
  }

  &__desc {
    margin-top: toRem(12px);
    margin-bottom: 0;
    color: #dcdcdc;
    font-size: toRem(16px);
    line-height: 1.2;
  }

  &__actions {
    display: flex;
  }

  &__btn {
    margin-right: toRem(10px);

    &:last-child {
      margin-right: 0;
    }

    &:deep(.base-btn) {
      color: #d8d8d8;
      background-color: hsl(230, 6%, 21%);
      border-color: hsl(230, 6%, 21%);

      &:hover {
        background-color: hsl(230, 6%, 26%);
        border-color: hsl(230, 6%, 26%);
      }

      &:active {
        background-color: hsl(230, 6%, 31%);
        border-color: hsl(230, 6%, 31%);
      }
    }

    &--card {
      &:deep(.base-btn) {
        & > svg {
          margin-left: toRem(8px);
          width: toRem(17px);
          height: toRem(14px);
          fill: #d8d8d8;
        }
      }
    }
  }

  &__body {
    padding-top: toRem(30px);
  }
}

// .billing-top-up {
//   &__row {
//     display: flex;
//     justify-content: flex-end;
//     align-items: center;
//     margin-bottom: toRem(18px);

//     &:last-child {
//       margin-bottom: 0;
//     }
//   }

//   &__label {
//     margin-right: toRem(15px);
//     font-size: toRem(15px);
//     line-height: 1.2;
//   }

//   &__field {
//     position: relative;
//     width: toRem(160px);

//     &:deep(.base-field__input) {
//       background-color: #323338;
//       text-align: right;
//     }
//   }

//   &__currency-sign {
//     position: absolute;
//     top: 1px;
//     bottom: 1px;
//     left: 1px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: toRem(38px);
//     color: #fff;
//     background-color: #393a40;
//     border-top-left-radius: toRem(6px);
//     border-bottom-left-radius: toRem(6px);
//     font-size: toRem(19px);
//     font-weight: 500;
//     line-height: 1.2;
//     text-align: center;
//   }

//   &__btn {
//     margin-left: auto;
//     margin-top: toRem(28px);
//     max-width: toRem(160px);

//     &:deep(.base-btn) {
//       width: 100%;
//     }
//   }
// }

.billing-table {
  width: 100%;
  border-collapse: collapse;

  &__tr {
    &:last-child {
      .billing-table__td {
        padding-bottom: 0;
      }
    }
  }

  &__td {
    padding-bottom: toRem(18px);
    padding-left: toRem(15px);
    padding-right: toRem(15px);

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-left: 0;
      padding-right: 0;
    }

    &--icon {
      width: toRem(60px);
    }

    &--status {
      text-align: right;
    }

    &--remove {
      width: toRem(13px);
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: toRem(60px);
    height: toRem(60px);
    background-color: #323338;
    border-radius: toRem(6px);

    & > svg {
      fill: #d8d8d8;
    }

    &--card {
      & > svg {
        width: toRem(32px);
        height: toRem(25px);
      }
    }

    &--account {
      & > svg {
        width: toRem(28px);
        height: toRem(25px);
      }
    }
  }

  &__info {
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.4;
  }

  &__default {
    color: var(--primary);
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.2;
  }

  &__default-btn {
    padding: 0;
    background-color: transparent;
    border: 0;
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.2;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      color: var(--primary);
    }
  }

  &__remove-btn {
    transform: translateY(toRem(2px));
    padding: 0;
    background-color: transparent;
    border: 0;
    cursor: pointer;

    & > svg {
      display: block;
      width: toRem(13px);
      height: toRem(15px);
      fill: #d8d8d8;
    }
  }
}
</style>
