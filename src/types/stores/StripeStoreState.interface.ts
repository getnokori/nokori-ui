import type { Stripe } from '@stripe/stripe-js'

export default interface StripeStoreState {
  stripe: Stripe | null
  isStripeLoading: boolean
  stripeError: Error | null
}
