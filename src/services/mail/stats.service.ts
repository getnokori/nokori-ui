import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'

const resource = '/mail/stats'

export default {
  getSendsStat(
    fromDate: string,
    toDate: string,
    eventName: string
  ): AxiosPromise<[string, number][]> {
    return BaseService.get(
      `${resource}/sends?event=${eventName}&from=${fromDate}&to=${toDate}`
    )
  }
}
