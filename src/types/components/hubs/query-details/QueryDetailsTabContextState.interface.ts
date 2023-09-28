import type {
  QueryConfigContextItem,
  QueryConfigHeaderItem,
  QueryConfigQueryParamsItem
} from '@/types/hubs/Query.interface'

export default interface QueryDetailsTabContextState {
  placeholder: QueryConfigContextItem
}

export default interface QueryDetailsTabHeadersState {
  placeholder: QueryConfigHeaderItem
}

export default interface QueryDetailsTabQueryParamsState {
  placeholder: QueryConfigQueryParamsItem
}
