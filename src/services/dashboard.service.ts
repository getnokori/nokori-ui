import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'

const resource = '/dashboard'

export default {
  getMetric(
    fromDate: string,
    toDate: string,
    metricName: string
  ): AxiosPromise<{ date: string; name: string; count: number }[]> {
    return BaseService.get(
      `${resource}/metrics/${metricName}?datesFrom=${fromDate}&datesTo=${toDate}`
    )
  }
}
