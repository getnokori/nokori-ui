import StorageEnums from '@/enums/storage/Storage.enum'
import type {
  UnsavedQueryResult,
  UnsavedQueryResults
} from '@/types/query/UnsavedQueryResults.interface'

function getQueriesResultsFromStorage() {
  const unsavedQueriesResultsStorageItem = localStorage.getItem(
    StorageEnums.UNSAVED_QUERIES_RESULTS_KEY
  )

  if (!unsavedQueriesResultsStorageItem) return null

  return JSON.parse(unsavedQueriesResultsStorageItem) as UnsavedQueryResults
}

function getQueryResultFromStorage(queryId: string) {
  const unsavedQueriesResults = getQueriesResultsFromStorage()

  if (!unsavedQueriesResults) return null

  return unsavedQueriesResults[queryId]
}

function saveQueryResultInStorage(
  queryId: string,
  newState: UnsavedQueryResult
) {
  const unsavedQueriesResults = getQueriesResultsFromStorage() || {}

  unsavedQueriesResults[queryId] = newState

  localStorage.setItem(
    StorageEnums.UNSAVED_QUERIES_RESULTS_KEY,
    JSON.stringify(unsavedQueriesResults)
  )
}

export {
  getQueriesResultsFromStorage,
  getQueryResultFromStorage,
  saveQueryResultInStorage
}
