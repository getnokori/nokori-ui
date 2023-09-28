import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'
import type MySQLCommands from '@/enums/queries/MySQLCommands.enum'
import type {
  QueryConfigContextItem,
  QueryConfigConstraintsItem,
  QueryConfigHeaderItem,
  QueryConfigQueryParamsItem
} from '@/types/hubs/Query.interface'
import type RequestBodyTypes from '@/enums/queries/RequestBodyTypes.enum'
import type { RequestBodySubTypes } from '@/enums/queries/RequestBodyTypes.enum'

export interface UnsavedQuery {
  source: HubContentsNode | null
  command: {
    label: string
    value: MySQLCommands
  } | null
  query: string
  context?: QueryConfigContextItem[]
  headers?: QueryConfigHeaderItem[]
  queryParams?: QueryConfigQueryParamsItem[]
  body?: any
  requestBodyType?: {
    label: string
    value: RequestBodyTypes
  }
  requestBodySubType?: {
    label: string
    value: RequestBodySubTypes
  }
  constraints?: QueryConfigConstraintsItem[]
  requestUri?: string
}

export interface UnsavedQueries {
  [key: string]: UnsavedQuery
}
