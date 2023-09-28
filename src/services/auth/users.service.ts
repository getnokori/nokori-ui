import BaseService from '@/services/base.service'
import type { UsersAllAPIResponse } from '@/types/auth/users.type'
import type { AxiosPromise } from 'axios'

const resource = '/auth/users'

export default {
  getUsers(
    offset = 25,
    limit = 0,
    queryString: string | null = null
  ): AxiosPromise<UsersAllAPIResponse> {
    let query = `offset=${offset}&limit=${limit}`
    if (queryString) {
      query += `&q=${queryString}`
    }

    return BaseService.get(`${resource}/?${query}`)
  },
  getUser(userId: string): AxiosPromise<any> {
    return BaseService.get(`${resource}/${userId}`)
  },
  async updateUser(userId: string, data: any): Promise<any> {
    return BaseService.put(`${resource}/${userId}`, data)
  },
  async getUserEvents(userId: string, limit = 5): Promise<any> {
    return BaseService.get(`${resource}/${userId}/events?limit=${limit}`)
  }
}
