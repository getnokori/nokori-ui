import type SourceEngines from '@/enums/sources/SourceEngines.enum'
import type MySQLCommands from '@/enums/queries/MySQLCommands.enum'
import type { QueryDetailsConstraintsOperator } from '@/types/services/query-details/QueryDetailsConstraintsCondition.interface'

export interface Query {
  meta: QueryMeta
  config: QueryConfig
}

export interface QueryMeta {
  engine: SourceEngines | null
  hubId: string
  label: string
}

export interface QueryConfig {
  command: MySQLCommands | null
  context: QueryConfigContextItem[] | null
  constraints: QueryConfigConstraintsItem[] | null
  query: QueryConfigQuery
  source: QueryConfigSource
  body?: any | null
  headers?: QueryConfigHeaderItem[] | null
  uri?: string | null
  queryParams?: QueryConfigQueryParamsItem[] | null
  requestBodyType?: string | null
}

export interface QueryConfigContextItem {
  id: string
  checked: boolean
  key: string
  value: string
  description: string
  placeholder?: boolean
}

export interface QueryConfigQueryParamsItem {
  id: string
  checked: boolean
  key: string
  value: string
  description: string
  placeholder?: boolean
}

export interface QueryConfigHeaderItem {
  id: string
  checked: boolean
  key: string
  value: string
  description: string
  placeholder?: boolean
}

export interface QueryConfigConstraintsItem {
  id: string
  checked: boolean
  key: string
  operator: QueryDetailsConstraintsOperator | ''
  value: string
  placeholder?: boolean
}

export interface QueryConfigQuery {
  queryId: string
  query: string | null
}

export interface QueryConfigSource {
  sourceId: string | null
  engine: SourceEngines | null
}
