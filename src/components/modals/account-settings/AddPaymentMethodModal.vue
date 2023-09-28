<template>
  <BaseModal :title="title" :width="400" @close="$emit('close')">
    <div class="add-payment-method-modal">
      <p v-if="error" class="add-payment-method-modal__error">
        {{ error.message }}
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="add-payment-method-modal__row">
          <div class="add-payment-method-modal__field">
            <BaseField
              id="name"
              v-model="state.name"
              placeholder="Cardholder's name"
            />
          </div>
        </div>

        <div class="add-payment-method-modal__row">
          <div class="add-payment-method-modal__field">
            <div
              id="card-number"
              class="add-payment-method-modal__stripe-input"
            ></div>
          </div>
        </div>

        <div class="add-payment-method-modal__row">
          <div class="add-payment-method-modal__field">
            <div
              id="card-expiry"
              class="add-payment-method-modal__stripe-input"
            ></div>
          </div>

          <div class="add-payment-method-modal__field">
            <div
              id="card-cvc"
              class="add-payment-method-modal__stripe-input"
            ></div>
          </div>
        </div>

        <BaseButton
          class="add-payment-method-modal__submit-btn"
          type="submit"
          :is-loading="state.isLoading"
        >
          Add Credit Card
        </BaseButton>
      </form>

      <p class="add-payment-method-modal__desc">
        This will be the default payment method.
      </p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import usePaymentMethodAdding from '@/composables/usePaymentMethodAdding'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'paymentMethodAdded'): void
}>()

const { state, error, handleSubmit } = usePaymentMethodAdding(() => {
  if (!error.value) {
    emit('close')
    emit('paymentMethodAdded')
  }
})
</script>

<style scoped lang="scss">
.add-payment-method-modal {
  &__row {
    display: flex;
    margin-bottom: toRem(20px);
  }

  &__field {
    margin-right: toRem(16px);
    width: 100%;

    &:last-child {
      margin-right: 0;
    }

    &:deep(.base-field__input) {
      font-weight: 500;
      letter-spacing: toRem(0.2px);

      &::placeholder {
        font-weight: 500;
        letter-spacing: toRem(0.3px);
      }
    }
  }

  &__stripe-input {
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

    &.InputElement {
      font-family: var(--base-font-family);
    }
  }

  &__submit-btn {
    margin-bottom: toRem(20px);
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

  &__desc {
    margin-top: 0;
    margin-bottom: 0;
    font-size: toRem(16px);
    line-height: 1.2;
    text-align: center;
  }

  &__error {
    margin-top: 0;
    margin-bottom: toRem(20px);
    padding: toRem(16px);
    color: #f00;
    border: 1px solid #444;
    border-radius: toRem(6px);
    font-size: toRem(15px);
    font-weight: 400;
    line-height: 1.3;
    text-align: center;
  }
}
</style>
