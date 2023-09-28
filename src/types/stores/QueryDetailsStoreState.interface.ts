import type { Query } from '@/types/hubs/Query.interface'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'
import type {
  QueryConfigContextItem,
  QueryConfigHeaderItem,
  QueryConfigConstraintsItem,
  QueryConfigQueryParamsItem
} from '@/types/hubs/Query.interface'
import type QueryDetailsTabsNames from '@/enums/components/hubs/QueryDetailsTabsNames.enum'
import type MySQLCommands from '@/enums/queries/MySQLCommands.enum'
import type RequestBodyTypes from '@/enums/queries/RequestBodyTypes.enum'
import type { RequestBodySubTypes } from '@/enums/queries/RequestBodyTypes.enum'

export default interface QueryDetailsStoreState {
  savedQuery: {
    data: Query | null
    isLoading: boolean
    error: Error | null
  }
  nodeId: string
  query: string
  body: any | null
  requestBodyType: {
    label: string
    value: RequestBodyTypes
  }
  requestBodySubType: {
    label: string
    value: RequestBodySubTypes
  }
  context: QueryConfigContextItem[]
  queryParams: QueryConfigQueryParamsItem[]
  constraints: QueryConfigConstraintsItem[]
  selectedSource: HubContentsNode | null
  selectedCommand: {
    label: string
    value: MySQLCommands
  } | null
  requestUri: string
  selectedTab: QueryDetailsTabsNames
  running: {
    data: any | null
    responseCode: string | null
    responseTime: string | null
    isLoading: boolean
  }
  headers: QueryConfigHeaderItem[]
  saving: {
    isLoading: boolean
    error: Error | null
  }
  isDirty: boolean
}
