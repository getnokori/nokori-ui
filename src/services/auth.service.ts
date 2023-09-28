import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'

const resource = '/auth'

export default {
  getAPIKey(): AxiosPromise<{ publicKey: string }> {
    return BaseService.get(`${resource}/api-keys`)
  },
  refreshAPIKey(): AxiosPromise<{ apiKey: string }> {
    return BaseService.put(`${resource}/api-keys/refresh`)
  },
  changePassword(password: string): AxiosPromise<{
    status: string
    redirectTo: string
  }> {
    const options = {
      password
    }

    return BaseService.put(`${resource}/password`, options)
  }
}
