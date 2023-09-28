<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody>
        <SignInfo>
          <SignInfoHeader>
            <template #title>Payment Information </template>

            <template #text>
              No recurring subscriptions. Only pay for what you use.
            </template>
          </SignInfoHeader>

          <SignInfoAccordion>
            <SignInfoAccordionItem id-prefix="1">
              <template #question>
                What happens if I need help after signing up?
              </template>

              <template #answer>
                Sign-up is fast and easy. Should you run in to any issues during
                setup, you will have immediate access to our incredible
                <a href="https://docs.nokori.com">documentation</a> as well as
                our very friendly and knowledgable support team you can reach
                via <a href="mailto:help@nokori.com">help@nokori.com</a> at any
                time.
              </template>
            </SignInfoAccordionItem>

            <SignInfoAccordionItem id-prefix="2">
              <template #question>
                How do I cancel if I’m not impressed?
              </template>

              <template #answer>
                There are no recurring subscriptions or charges. Only pay for
                services you consume. If you need help at any time with your
                account, simply contact our customer support team at
                <a href="mailto:help@nokori.com">help@nokori.com</a>
                and they will be happy to assist you.
              </template>
            </SignInfoAccordionItem>
          </SignInfoAccordion>
        </SignInfo>

        <SignCard title="Enter Payment Details" :error="error">
          <div class="-mt-4 mb-5 flex justify-center mx-auto">
            <!-- <span
              className="inline-flex items-center rounded-full bg-green-200 px-2.5 py-0.5 text-xs font-medium text-green-900"
            >
              30-Day Free Trial
            </span> -->
          </div>
          <SignForm @submit.prevent="handleSubscription">
            <SignFormRow>
              <SignFormField>
                <BaseField
                  id="name"
                  v-model="state.name"
                  placeholder="Cardholder's name"
                />
              </SignFormField>
            </SignFormRow>

            <SignFormRow>
              <SignFormField>
                <div id="card-number" class="stripe-input"></div>
              </SignFormField>
            </SignFormRow>

            <SignFormRow>
              <SignFormField>
                <div id="card-expiry" class="stripe-input"></div>
              </SignFormField>

              <SignFormField>
                <div id="card-cvc" class="stripe-input"></div>
              </SignFormField>
            </SignFormRow>

            <BaseCheckbox id="agree" v-model="paymentFormState.agree" required>
              By clicking "Continue" you agree to the
              <a href="https://nokori.com/terms">nokori Terms of Service</a>.
            </BaseCheckbox>

            <BaseButton
              class="submit-btn"
              type="submit"
              :is-loading="state.isLoading"
            >
              Save & Begin
              <IconRightLong class="submit-btn__icon" />
            </BaseButton>
          </SignForm>

          <template #footer>
            <!-- <p>You will not be billed yet.</p> -->
          </template>
        </SignCard>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import nk from '@/services/nokori.service'
import useUserStore from '@/stores/user.store'
import usePaymentMethodAdding from '@/composables/usePaymentMethodAdding'
import RouteNames from '@/enums/RouteNames.enum'
import ContainerWidths from '@/enums/ContainerWidths.enum'
import { add } from 'date-fns'
import { formatWithOptions } from 'date-fns/fp'
import { enUS } from 'date-fns/locale'
import type { SignUpPaymentState } from '@/types/views/SignUpPlanState.interface'
const dateToString = formatWithOptions({ locale: enUS }, 'MMM do, yyyy')

const router = useRouter()

const userStore = useUserStore()
const { user, userPlanId } = storeToRefs(userStore)

const { state, error, handleSubmit } = usePaymentMethodAdding(async () => {
  if (!error.value) {
    await router.replace({ name: RouteNames.SIGN_UP_WELCOME })
  }
})

const dateState = {
  billingDate: dateToString(add(new Date(), { days: 30 }))
}

const paymentFormState: SignUpPaymentState = reactive({
  agree: false,
  plans: {
    data: null,
    isLoading: false,
    error: null
  },
  subscription: {
    data: null,
    isLoading: false,
    error: null
  },
  selectedPlan: userPlanId.value as string
})

async function handleSubscription() {
  paymentFormState.subscription.error = null
  paymentFormState.subscription.isLoading = true

  try {
    const didSavePaymentInfo = await handleSubmit()
    if (!didSavePaymentInfo) {
      paymentFormState.subscription.error =
        'Error saving payment information.' as never as Error
      return
    }

    // router.replace({ name: RouteNames.SIGN_UP_WELCOME })

    // Subscribe them to a plan.
    // If they go back and change plans, it should just overwrite it.
    // const { data, error } = await nk.billing.subscribe({
    //   accountId: user.value!.accountId,
    //   planId: paymentFormState.selectedPlan
    // })

    // if (!error) {
    //   paymentFormState.subscription.data = data
    //   user.value!.subscriptions.planId = paymentFormState.selectedPlan

    //   router.replace({ name: RouteNames.SIGN_UP_WELCOME })
    // } else {
    //   paymentFormState.subscription.error = error
    // }
  } catch (error: unknown) {
    paymentFormState.subscription.error = error as never as Error
  } finally {
    paymentFormState.subscription.isLoading = false
  }
}
</script>

<style scoped lang="scss">
.stripe-input {
  padding: toRem(11px) toRem(15px);
  height: toRem(42px);
  background-color: #27282c;
  border: 1px solid #27282c;
  border-radius: toRem(6px);
  transition: var(--default-transition);

  &.StripeElement {
    &--focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 toRem(2px) var(--primary-focus);
    }
  }
}

.submit-btn {
  margin-top: 1rem;
  width: 100%;
  transition: var(--default-transition);

  &:hover {
    .submit-btn__icon {
      transform: translateX(5px);
    }
  }

  &__icon {
    margin-left: toEm(6px);
    width: toEm(18px);
    height: toEm(9px);
    transition: var(--default-transition);
  }
}
</style>
