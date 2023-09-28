import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import nk from '@/services/nokori.service'
import useStripeStore from '@/stores/stripe.store'
import useUserStore from '@/stores/user.store'
import type {
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
  StripeError
} from '@stripe/stripe-js'
import type UsePaymentMethodAddingState from '@/types/composables/UsePaymentMethodAddingState.interface'

export default function usePaymentMethodAdding(doneCallback: () => void) {
  const stripeStore = useStripeStore()
  const userStore = useUserStore()

  const { stripe } = storeToRefs(stripeStore)
  const { user } = storeToRefs(userStore)

  const cardNumberRef = ref<StripeCardNumberElement | null>(null)
  const cardExpiryDateRef = ref<StripeCardExpiryElement | null>(null)
  const cardCVCRef = ref<StripeCardCvcElement | null>(null)

  const state: UsePaymentMethodAddingState = reactive({
    name: '',
    isLoading: false,
    stripePaymentMethod: {
      data: null,
      error: null
    },
    appPaymentMethod: {
      data: null,
      error: null
    }
  })

  const elements = computed(() => {
    return stripe.value!.elements()
  })

  const error = computed(() => {
    return (
      state.stripePaymentMethod.error || state.appPaymentMethod.error || null
    )
  })

  onMounted(() => {
    const style = {
      base: {
        color: '#fff',
        fontFamily: `'SFProDisplay', sans-serif`,
        fontSize: '15px',
        fontWeight: '500',
        '::placeholder': {
          color: '#888',
          fontWeight: 400
        }
      }
    }

    cardNumberRef.value = elements.value.create('cardNumber', { style })
    cardExpiryDateRef.value = elements.value.create('cardExpiry', { style })
    cardCVCRef.value = elements.value.create('cardCvc', { style })

    cardNumberRef.value.mount('#card-number')
    cardExpiryDateRef.value.mount('#card-expiry')
    cardCVCRef.value.mount('#card-cvc')
  })

  onBeforeUnmount(() => {
    cardNumberRef.value!.destroy()
    cardExpiryDateRef.value!.destroy()
    cardCVCRef.value!.destroy()
  })

  async function createStripePaymentMethod() {
    try {
      const { paymentMethod, error } = await stripe.value!.createPaymentMethod({
        type: 'card',
        card: cardNumberRef.value as StripeCardNumberElement,
        billing_details: {
          name: state.name
        }
      })

      if (!error) {
        state.stripePaymentMethod.data = paymentMethod
      } else {
        state.stripePaymentMethod.error = error
        clearFields()
      }
    } catch (error: unknown) {
      state.stripePaymentMethod.error = error as StripeError
      clearFields()
    }
  }

  async function createAppPaymentMethod() {
    try {
      const { data, error } = await nk.payments.createPaymentMethod({
        provider: 'stripe',
        paymentMethodDetails: state.stripePaymentMethod.data
      })

      if (!error) {
        state.appPaymentMethod.data = data
        user.value!.subscriptions.hasPaymentMethod = true
      } else {
        state.appPaymentMethod.error = error
        clearFields()
      }
    } catch (error: unknown) {
      state.appPaymentMethod.error = error as Error
      clearFields()
    }
  }

  async function handleSubmit() {
    clearErrors()
    state.isLoading = true

    await createStripePaymentMethod()

    if (!state.stripePaymentMethod.error) {
      await createAppPaymentMethod()
    }

    if (!state.appPaymentMethod.error) {
      doneCallback()
      state.isLoading = false
      return true
    }

    state.isLoading = false
  }

  function clearErrors() {
    state.stripePaymentMethod.error = null
    state.appPaymentMethod.error = null
  }

  function clearFields() {
    cardNumberRef.value!.clear()
    cardExpiryDateRef.value!.clear()
    cardCVCRef.value!.clear()
  }

  return {
    state,
    error,
    handleSubmit
  }
}
