export default interface PaymentMethod {
  accountId: string
  methodId: string
  isDefault: 0 | 1
  expired: 0 | 1
  providerMethodId: string
  type: 'card' | 'account'
  object: 'payment_method'
  billing_details: {
    address: {
      city: string | null
      country: string | null
      line1: string | null
      line2: string | null
      postal_code: string | null
      state: string | null
    }
    email: string | null
    name: string
    phone: string | null
  }
  card: {
    brand: string
    country: string
    exp_month: string
    exp_year: string
    funding: string
    generated_from: null
    last4: string
  }
  created: number
  customer: null
  livemode: '0'
  createdAt: string
  updatedAt: string | null
}
