import StorageEnums from '@/enums/storage/Storage.enum'
import type {
  UnsavedQuery,
  UnsavedQueries
} from '@/types/query/UnsavedQueries.interface'

function getQueriesFromStorage() {
  const unsavedQueriesStorageItem = localStorage.getItem(
    StorageEnums.UNSAVED_QUERIES_KEY
  )

  if (!unsavedQueriesStorageItem) return null

  return JSON.parse(unsavedQueriesStorageItem) as UnsavedQueries
}

function checkForQueryInStorage(queryId: string) {
  const unsavedQueries = getQueriesFromStorage()

  if (!unsavedQueries) return false

  return Object.prototype.hasOwnProperty.call(unsavedQueries, queryId)
}

function getQueryFromStorage(queryId: string) {
  const unsavedQueries = getQueriesFromStorage()

  if (!unsavedQueries) return null

  return unsavedQueries[queryId]
}

function saveQueryInStorage(queryId: string, newState: UnsavedQuery) {
  const unsavedQueries = getQueriesFromStorage() || {}

  unsavedQueries[queryId] = newState

  localStorage.setItem(
    StorageEnums.UNSAVED_QUERIES_KEY,
    JSON.stringify(unsavedQueries)
  )
}

function removeQueryFromStorage(queryId: string) {
  const unsavedQueries = getQueriesFromStorage()

  if (unsavedQueries) {
    delete unsavedQueries[queryId]

    if (Object.keys(unsavedQueries).length) {
      localStorage.setItem(
        StorageEnums.UNSAVED_QUERIES_KEY,
        JSON.stringify(unsavedQueries)
      )
    } else {
      localStorage.removeItem(StorageEnums.UNSAVED_QUERIES_KEY)
    }
  }
}

export {
  getQueriesFromStorage,
  checkForQueryInStorage,
  getQueryFromStorage,
  saveQueryInStorage,
  removeQueryFromStorage
}
