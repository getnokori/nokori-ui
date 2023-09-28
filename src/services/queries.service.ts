import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'
import type {
  Query,
  QueryMeta,
  QueryConfigQuery
} from '@/types/hubs/Query.interface'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'
import type MySQLCommands from '@/enums/queries/MySQLCommands.enum'
import type QueryLog from '@/types/query/QueryLog.interface'
import type QueryLogDetails from '@/types/query/QueryLogDetails.interface'

const resource = '/queries'

export default {
  getQuery(hubId: string, queryId: string): AxiosPromise<Query> {
    return BaseService.get(`${resource}/${queryId}?hubId=${hubId}`)
  },
  createQuery(options: {
    hubId: string
    parentNodeId: string | null
    label: string
  }): AxiosPromise<Query> {
    return BaseService.post(`${resource}`, options)
  },
  updateQuery(
    queryId: string,
    options: {
      meta: Partial<Omit<QueryMeta, 'hubId'>> & Pick<QueryMeta, 'hubId'>
      config: {
        query: Partial<Omit<QueryConfigQuery, 'queryId'>> &
          Pick<QueryConfigQuery, 'queryId'>
      }
    }
  ): AxiosPromise<Record<string, never>> {
    return BaseService.put(`${resource}/${queryId}`, options)
  },
  executeQuery(options: Query) {
    return BaseService.post(`${resource}/drafts/execute`, options)
  },
  saveQuery(queryId: string, options: Query) {
    return BaseService.put(`${resource}/${queryId}`, options)
  },
  deleteQuery(queryId: string) {
    return BaseService.delete(`${resource}/${queryId}`)
  },
  getQueryLogs(
    queryId: string,
    offset: number,
    limit: number
  ): AxiosPromise<QueryLog[]> {
    return BaseService.get(
      `${resource}/${queryId}/logs?offset=${offset}&limit=${limit}`
    )
  },
  getQueryLogDetails(
    queryId: string,
    logId: string
  ): AxiosPromise<QueryLogDetails> {
    return BaseService.get(`${resource}/${queryId}/logs/${logId}`)
  }
}
