import type PaymentMethod from '@/types/payments/PaymentMethod.interface'

export default interface AccountSettingsModalBillingState {
  paymentMethods: {
    data: PaymentMethod[]
    isLoading: boolean
    error: Error | null
  }
  updatingDefaultPaymentMethod: {
    isLoading: boolean
    error: Error | null
  }
  deletingPaymentMethod: {
    paymentMethodIdToDelete: string | null
    isLoading: boolean
    error: Error | null
  }
  isAddPaymentMethodModalOpen: boolean
  isDeletePaymentMethodModalOpen: boolean
  currentBalance: number
  billingThreshold: number
}
