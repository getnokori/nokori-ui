import type { PaymentMethod, StripeError } from '@stripe/stripe-js'

export default interface SignUpPaymentState {
  name: string
  isLoading: boolean
  stripePaymentMethod: {
    data: PaymentMethod | null
    error: StripeError | null
  }
  appPaymentMethod: {
    data: any | null // TODO: add interface
    error: Error | null
  }
}
