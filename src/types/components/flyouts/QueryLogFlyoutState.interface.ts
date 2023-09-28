import type QueryLogDetails from '@/types/query/QueryLogDetails.interface'

export default interface QueryLogFlyoutState {
  log: {
    data: QueryLogDetails | null
    isLoading: boolean
    error: Error | null
  }
}
