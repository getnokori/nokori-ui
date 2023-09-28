import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'

const resource = '/billing'

export default {
  getAccountBalance(): AxiosPromise<{ balance: number }> {
    return BaseService.get(`${resource}/balance`)
  }
}
