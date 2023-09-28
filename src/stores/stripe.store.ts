import { loadStripe } from '@stripe/stripe-js'
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import type StripeStoreState from '@/types/stores/StripeStoreState.interface'

const useStripeStore = defineStore('stripe', () => {
  const state: StripeStoreState = reactive({
    stripe: null,
    isStripeLoading: false,
    stripeError: null
  })

  async function initStripeInstance() {
    state.stripeError = null
    state.isStripeLoading = true

    try {
      state.stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      )
    } catch (error: unknown) {
      state.stripeError = error as Error
    } finally {
      state.isStripeLoading = false
    }
  }

  return {
    ...toRefs(state),
    initStripeInstance
  }
})

export default useStripeStore
