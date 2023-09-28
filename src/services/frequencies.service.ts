import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'

const resource = '/frequencies'

export default {
  getEvents(
    fromDate: string,
    toDate: string,
    metricName: string
  ): AxiosPromise<{ date: string; name: string; count: number }[]> {
    return BaseService.get(
      `${resource}/${metricName}?timeStart=${fromDate}&timeEnd=${toDate}`
    )
  }
}
