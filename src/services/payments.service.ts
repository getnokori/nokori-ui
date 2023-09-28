import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'
import type PaymentMethod from '@/types/payments/PaymentMethod.interface'

const resource = '/payments'

export default {
  getPaymentMethods(): AxiosPromise<PaymentMethod[]> {
    return BaseService.get(`${resource}/methods`)
  },
  updatePaymentMethod(methodId: string, action: 'setDefault' = 'setDefault') {
    const options = {
      methodId,
      action
    }

    return BaseService.patch(`${resource}/methods`, options)
  },
  deletePaymentMethod(methodId: string) {
    return BaseService.delete(`${resource}/methods/${methodId}`)
  }
}
