import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'

const resource = '/auth/users'

export default {
  getAuthStatsTrend(
    fromDate: string,
    toDate: string,
    eventName: string
  ): AxiosPromise<[string, number][]> {
    return BaseService.get(
      `${resource}/stats?event=${eventName}&type=trend&from=${fromDate}&to=${toDate}`
    )
  },
  async getAuthStatsCount(figure: 'dau' | 'mau' | 'tau'): Promise<any> {
    const result = await BaseService.get(
      `${resource}/stats?figure=${figure}&type=count`
    )
    if (result.data) return result.data

    return { figure: 0 }
  }
}
