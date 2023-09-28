import type QueryLog from '@/types/query/QueryLog.interface'

export default interface QueryDetailsTabLogsState {
  logs: {
    data: QueryLog[]
    isLoading: boolean
    error: Error | null
    noMore: boolean
  }
  selectedLogId: string | null
  isQueryLogFlyoutOpen: boolean
}
