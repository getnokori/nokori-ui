export interface UnsavedQueryResult {
  data: any | null
  responseCode: string | null
  responseTime: string | null
}

export interface UnsavedQueryResults {
  [key: string]: UnsavedQueryResult
}
