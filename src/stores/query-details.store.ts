import { defineStore, storeToRefs } from 'pinia'
import {
  computed,
  reactive,
  ref,
  toRefs,
  watch,
  onBeforeMount,
  onBeforeUpdate,
  onMounted
} from 'vue'
import { isEqual } from 'lodash-es'
import { nanoid } from 'nanoid'
import { convertMillisecondsToHumanReadable } from '@/services/ui/UIQueryMetrics.service'
import useHubsStore from '@/stores/hubs.store'
import QueriesService from '@/services/queries.service'
import {
  getQueryFromStorage,
  saveQueryInStorage,
  removeQueryFromStorage
} from '@/services/unsavedQueries.service'
import {
  getQueryResultFromStorage,
  saveQueryResultInStorage
} from '@/services/unsavedQueriesResults.service'
import QueryExecutionActionType from '@/enums/queries/QueryExecutionActionType.enum'
import QueryDetailsTabsNames from '@/enums/components/hubs/QueryDetailsTabsNames.enum'
import type QueryDetailsStoreState from '@/types/stores/QueryDetailsStoreState.interface'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'
import type { UnsavedQuery } from '@/types/query/UnsavedQueries.interface'
import {
  findChangedElementIndex,
  findRemovedElementIndexes,
  removeElementsAtIndexes,
  removeElementsAtIndexesChecked
} from '../utils/arrays'
import type {
  Query,
  QueryConfigContextItem,
  QueryConfigConstraintsItem
} from '@/types/hubs/Query.interface'
import RequestBodyTypes, {
  InvertedRequestBodySubTypes,
  RequestBodySubTypes
} from '@/enums/queries/RequestBodyTypes.enum'
import HeadersContentTypes, {
  invertedHeadersContentTypes
} from '@/enums/queries/HeadersContentTypes.enum'
import SourceEngines from '@/enums/sources/SourceEngines.enum'

const useQueryDetailsStore = defineStore('query-details', () => {
  const hubsStore = useHubsStore()
  const { hubs, queries } = storeToRefs(hubsStore)
  const { setQueryNodeDirtyState } = hubsStore

  const isStateWatcherFirstCall = ref(true)

  const state: QueryDetailsStoreState = reactive({
    savedQuery: {
      data: null,
      isLoading: false,
      error: null
    },
    nodeId: '',
    query: '',
    body: '',
    requestBodyType: {
      label: 'none',
      value: RequestBodyTypes.none
    },
    requestBodySubType: {
      label: 'Text',
      value: RequestBodySubTypes.Text
    },
    context: [],
    constraints: [],
    queryParams: [],
    selectedSource: null,
    selectedCommand: null,
    requestUri: '',
    headers: [],
    selectedTab: QueryDetailsTabsNames.QUERY,
    running: {
      data: null,
      responseCode: null,
      responseTime: null,
      isLoading: false
    },
    saving: {
      isLoading: false,
      error: null
    },
    isDirty: false
  })

  const stateValuesThatCanBeUnsaved = computed<UnsavedQuery>(() => {
    return {
      body: state.body,
      requestBodyType: state.requestBodyType,
      requestBodySubType: state.requestBodySubType,
      source: state.selectedSource,
      command: state.selectedCommand,
      query: state.query,
      context: state.context,
      constraints: state.constraints,
      requestUri: state.requestUri,
      headers: state.headers,
      queryParams: state.queryParams
    }
  })

  watch(
    () => state.requestBodySubType,
    (newRequestBodySubType) => {
      setBodyContentTypeHeaders(newRequestBodySubType.value)
    }
  )

  function setBodyContentTypeHeaders(bodySubType: RequestBodySubTypes) {
    const index = state.headers
      .filter((header) => header.checked)
      .findIndex((header) => header.key === 'Content-Type')

    if (index !== -1) {
      state.headers.splice(index, 1)
    }

    const contentType = getHeaderForContentType(bodySubType)

    state.headers.push({
      id: nanoid(),
      key: 'Content-Type',
      value: contentType,
      checked: true,
      description: ''
    })
  }

  function getHeaderForContentType(bodySubType: RequestBodySubTypes) {
    switch (bodySubType) {
      case RequestBodySubTypes.JSON:
        return HeadersContentTypes.JSON
      case RequestBodySubTypes.XML:
        return HeadersContentTypes.XML
      case RequestBodySubTypes.Text:
        return HeadersContentTypes.TEXT
      case RequestBodySubTypes.JavasScript:
        return HeadersContentTypes.JAVASCRIPT
      case RequestBodySubTypes.HTML:
        return HeadersContentTypes.HTML
      default:
        return HeadersContentTypes.TEXT
    }
  }

  const checkedContext = computed(() => {
    return state.context.filter((item) => item.checked)
  })

  const checkedQueryParams = computed(() => {
    return state.queryParams.filter((item) => item.checked)
  })

  const checkedHeaders = computed(() => {
    return state.headers.filter((item) => item.checked)
  })

  const checkedConstraints = computed(() => {
    return state.constraints.filter((item) => item.checked)
  })

  const currentHub = computed(() => {
    return hubs.value.data.find(
      (hub) => hub.hubId === state.savedQuery.data?.meta.hubId
    )
  })

  watch(
    () => stateValuesThatCanBeUnsaved.value,
    (newStateValuesThatCanBeUnsaved) => {
      if (state.savedQuery.data) {
        if (!isStateWatcherFirstCall.value) {
          if (!isUnsavedChangesBeenRestored(newStateValuesThatCanBeUnsaved)) {
            saveQueryInStorage(state.nodeId, newStateValuesThatCanBeUnsaved)
            setQueryNodeDirtyState(state.nodeId, true)
            state.isDirty = true
          } else {
            removeQueryFromStorage(state.nodeId)
            setQueryNodeDirtyState(state.nodeId, false)
            state.isDirty = false
          }
        } else {
          isStateWatcherFirstCall.value = false
        }
      }
    },
    {
      deep: true
    }
  )

  watch(
    () => state.running,
    (newResultsData) => {
      if (!newResultsData.isLoading) {
        const { isLoading, ...rest } = newResultsData
        saveQueryResultInStorage(state.nodeId, rest)
      }
    },
    {
      deep: true
    }
  )

  watch(
    () => state.constraints,
    (newConstraints) => {
      if (!newConstraints.length && state.constraints.length) {
        state.constraints = []
      }
    },
    {
      deep: true
    }
  )

  watch(
    () => state.queryParams,
    (newQueryParams) => {
      if (!newQueryParams.length && state.queryParams.length) {
        state.queryParams = []
      }
    },
    {
      deep: true
    }
  )

  watch(
    () => state.headers,
    (newHeaders) => {
      if (!newHeaders.length && state.headers.length) {
        state.headers = []
      }
    },
    {
      deep: true
    }
  )

  watch(
    () => state.requestBodyType,
    (newRequestBodyType, oldRequestBodyType) => {
      if (
        oldRequestBodyType?.value !== RequestBodyTypes.none &&
        newRequestBodyType.value === RequestBodyTypes.none
      ) {
        state.body = ''
        state.requestBodySubType = {
          label: 'Text',
          value: RequestBodySubTypes.Text
        }

        // Drop content-type headers
        const contentTypeHeader = state.headers
          .filter((header) => header.checked)
          .findIndex((header) => header.key === 'Content-Type')

        state.headers.splice(contentTypeHeader, 1)
      }
    }
  )

  onMounted(() => {
    watch(
      () => state.selectedSource?.engine,
      (newEngine, oldEngine) => {
        if (
          !oldEngine &&
          newEngine === SourceEngines.HTTP &&
          state.headers.length < 1 &&
          !state.selectedCommand
        ) {
          initHTTPHeaders()
        }
      }
    )
  })

  function initHTTPHeaders() {
    state.headers.push({
      id: nanoid(),
      key: 'Cache-Control',
      value: 'no-cache',
      checked: true,
      description: ''
    })

    state.headers.push({
      id: nanoid(),
      key: 'User-Agent',
      value: 'nokori/1.0',
      checked: true,
      description: ''
    })

    state.headers.push({
      id: nanoid(),
      key: 'Accept',
      value: '*/*',
      checked: true,
      description: ''
    })

    state.headers.push({
      id: nanoid(),
      key: 'Accept-Encoding',
      value: 'gzip, deflate, br',
      checked: true,
      description: ''
    })
  }

  function getSubBodyTypeFromContentTypeHeader() {
    const contentTypeHeader = state.headers
      .filter((header) => header.checked)
      .find((header) => header.key === 'Content-Type')

    if (
      contentTypeHeader?.value &&
      invertedHeadersContentTypes[contentTypeHeader?.value]
    ) {
      return {
        label: InvertedRequestBodySubTypes[contentTypeHeader?.value],
        value: invertedHeadersContentTypes[
          contentTypeHeader?.value
        ] as RequestBodySubTypes
      }
    }
  }

  function isUnsavedChangesBeenRestored(newState: UnsavedQuery) {
    return (
      state.savedQuery.data?.config.source.sourceId ===
        newState.source?.nodeId &&
      state.savedQuery.data?.config.command === newState.command?.value &&
      (state.savedQuery.data?.config.query.query || '') === newState.query &&
      isEqual(
        state.savedQuery.data?.config?.context,
        newState?.context?.length ? newState.context : null
      ) &&
      isEqual(
        state.savedQuery.data?.config?.headers,
        newState?.headers?.length ? newState.headers : null
      ) &&
      isEqual(
        state.savedQuery.data?.config?.uri,
        newState?.requestUri?.length ? newState.requestUri : null
      ) &&
      isEqual(
        state.savedQuery.data?.config?.body,
        newState?.body?.length ? newState.body : null
      ) &&
      isEqual(
        state.savedQuery.data?.config?.requestBodyType,
        newState?.requestBodyType ? newState.requestBodyType : null
      ) &&
      isEqual(
        state.savedQuery.data?.config?.queryParams,
        newState?.queryParams?.length ? newState.queryParams : null
      ) &&
      isEqual(
        state.savedQuery.data?.config?.constraints,
        newState?.constraints?.length ? newState.constraints : null
      )
    )
  }

  async function fetchQuery(activeQuery: HubContentsNode) {
    state.savedQuery.error = null
    state.savedQuery.isLoading = true

    isStateWatcherFirstCall.value = true

    try {
      const { data } = await QueriesService.getQuery(
        activeQuery.hubId,
        activeQuery.nodeId
      )

      state.savedQuery.data = data

      if (data.config.query.queryId) {
        state.nodeId = data.config.query.queryId
      }

      if (data.config.query.query) {
        state.query = data.config.query.query
      }

      if (data.config.command) {
        state.selectedCommand = {
          label: data.config.command.toUpperCase(),
          value: data.config.command
        }
      }

      if (data.config.context) {
        state.context = data.config.context
      }

      if (data.config.body) {
        state.body = data.config.body
      }

      if (data.config.constraints) {
        state.constraints = data.config.constraints
      }

      if (data.config.uri) {
        state.requestUri = data.config.uri
      }

      if (data.config.headers) {
        state.headers = data.config.headers
      }

      if (data.config.queryParams) {
        state.queryParams = data.config.queryParams
      }

      if (data.config.requestBodyType) {
        state.requestBodyType = {
          label: data.config.requestBodyType,
          value: data.config.requestBodyType as RequestBodyTypes
        }

        const subBodyType = getSubBodyTypeFromContentTypeHeader()
        if (subBodyType?.value) {
          state.requestBodySubType = subBodyType
        }
      }

      if (data.config.source) {
        const sourcesNode = currentHub.value?.contents.children![1].children

        if (sourcesNode) {
          const selectedSource = sourcesNode.find(
            (source: HubContentsNode) =>
              source.nodeId === data.config.source?.sourceId
          )

          if (selectedSource) {
            setSelectedSource(selectedSource)
          }
        }
      } else {
        setSelectedSource(null)
      }

      const savedQueryStateObject = getQueryFromStorage(state.nodeId)
      const savedQueryResultObject = getQueryResultFromStorage(state.nodeId)

      if (savedQueryStateObject) {
        state.selectedSource = savedQueryStateObject.source
        state.selectedCommand = savedQueryStateObject.command
        state.query = savedQueryStateObject.query
        state.context = savedQueryStateObject.context
          ? savedQueryStateObject.context
          : []
        state.constraints = savedQueryStateObject.constraints
          ? savedQueryStateObject.constraints
          : []

        state.headers = savedQueryStateObject.headers
          ? savedQueryStateObject.headers
          : []

        state.queryParams = savedQueryStateObject.queryParams
          ? savedQueryStateObject.queryParams
          : []

        state.requestUri = savedQueryStateObject.requestUri
          ? savedQueryStateObject.requestUri
          : ''
      }

      if (savedQueryResultObject) {
        state.running.data = savedQueryResultObject.data
        state.running.responseCode = savedQueryResultObject.responseCode
        state.running.responseTime = savedQueryResultObject.responseTime
      }
    } catch (error: unknown) {
      state.savedQuery.error = error as Error
    } finally {
      state.savedQuery.isLoading = false
    }
  }

  async function handleActionBtnClick(action: QueryExecutionActionType) {
    if (
      checkForDuplicateKeysInContext() ||
      checkForEmptyValueFieldsInContext()
    ) {
      return false
    }

    if (!state.savedQuery.data) return false

    if (
      queries.value.activeQuery &&
      state.selectedSource &&
      state.selectedSource.engine &&
      state.selectedCommand
    ) {
      const options: Query = {
        meta: {
          engine: state.selectedSource.engine,
          hubId: queries.value.activeQuery.hubId,
          label: queries.value.activeQuery.label
        },
        config: {
          command: state.selectedCommand.value,
          context: state.context.length
            ? state.context.filter((item) => item.checked)
            : null,
          constraints: state.constraints.length ? state.constraints : null,
          headers: state.headers.length
            ? state.headers.filter((item) => item.checked)
            : null,
          query: {
            query: state.query,
            queryId: state.savedQuery.data.config.query.queryId
          },
          source: {
            engine: state.selectedSource.engine,
            sourceId: state.selectedSource.nodeId
          },
          body: `${state.body}`,
          requestBodyType: state.requestBodyType?.value,
          queryParams: state.queryParams.length
            ? state.queryParams.filter((item) => item.checked)
            : null,
          uri: state.requestUri
        }
      }

      switch (action) {
        case QueryExecutionActionType.RUN: {
          state.running.data = null
          state.running.responseCode = null
          state.running.responseTime = null
          state.running.isLoading = true

          const responseStartTime = Date.now()

          try {
            const response: any = await QueriesService.executeQuery(options)

            state.running.data = response.data
            state.running.responseCode = `${response.statusCode} ${response.statusText}`
          } catch (error: unknown) {
            state.running.data = (error as any).message
            state.running.responseCode = `${(error as any).statusCode} ${
              (error as any).statusText
            }`
          } finally {
            state.running.isLoading = false
          }

          const responseTime = convertMillisecondsToHumanReadable(
            Date.now() - responseStartTime
          )

          state.running.responseTime = `${responseTime.value}${responseTime.unit}`

          break
        }

        case QueryExecutionActionType.SAVE: {
          state.saving.error = null
          state.saving.isLoading = true

          try {
            await QueriesService.saveQuery(
              state.savedQuery.data.config.query.queryId,
              options
            )

            if (
              queries.value.activeQuery.command !== state.selectedCommand.value
            ) {
              queries.value.activeQuery.command = state.selectedCommand.value
            }

            removeQueryFromStorage(state.nodeId)
            setQueryNodeDirtyState(state.nodeId, false)
            state.isDirty = false
          } catch (error: unknown) {
            state.saving.error = error as Error
          } finally {
            state.saving.isLoading = false
          }

          break
        }
      }
    }
  }

  function addContextItem(placeholder: QueryConfigContextItem) {
    state.context.push({
      id: placeholder.id,
      checked: true,
      key: placeholder.key,
      value: placeholder.value,
      description: placeholder.description
    })
  }

  function removeContextItem(itemId: string) {
    const index = state.context.findIndex(
      (stateItem) => stateItem.id === itemId
    )
    state.context.splice(index, 1)
  }

  function addQueryParamsItem(placeholder: QueryConfigContextItem) {
    state.queryParams.push({
      id: placeholder.id,
      checked: true,
      key: placeholder.key,
      value: placeholder.value,
      description: placeholder.description
    })

    updateURI()
  }

  function updateURI() {
    const cleanURI = state.requestUri.split('?')[0]
    if (state.queryParams?.length) {
      const queryParams = state.queryParams
        .filter((item) => item.checked)
        .map((item: QueryConfigContextItem) => {
          if (item.value !== undefined && item.value !== '') {
            return `${item.key}=${item.value}`
          } else {
            return item.key
          }
        })
        .join('&')
      state.requestUri = `${cleanURI}?${queryParams}`
    } else {
      state.requestUri = `${cleanURI}`
    }
  }

  function URIUpdated(newURIValue: string, oldRequestUri: string) {
    if (newURIValue === oldRequestUri) return

    if (!newURIValue) state.queryParams = []

    const oldQueryParts = oldRequestUri.split('?')[1]
    const oldQueryParams = new URLSearchParams(oldQueryParts).entries()
    const oldQueryParamsArray = Array.from(oldQueryParams).map(
      ([key, value]) => {
        return { key, value }
      }
    )

    const newQueryParts = newURIValue.split('?')[1]
    const newQueryParams = new URLSearchParams(newQueryParts).entries()
    const newQueryParamsMap = Array.from(newQueryParams).map(([key, value]) => {
      return { key, value }
    })

    /**
     * Determine whether we are adding or removing params
     * 1 === adding
     * 0 === no change
     * -1 === removing
     **/
    const isAddingParams =
      newQueryParamsMap.length > oldQueryParamsArray.length
        ? 1
        : newQueryParamsMap.length < oldQueryParamsArray.length
        ? -1
        : 0

    if (isAddingParams === 1) {
      for (const { key, value } of newQueryParamsMap) {
        const newParamsIndex = state.queryParams
          .filter((item) => item.checked)
          .findIndex((item) => item.key === key && item.value === value)

        if (newParamsIndex < 0) {
          addQueryParamsItem({
            id: nanoid(),
            checked: true,
            key,
            value,
            description: '',
            placeholder: false
          })
        }
      }

      return
    }

    /**
     * If we are removing params...
     */
    if (isAddingParams === -1) {
      // if (newQueryParamsMap.length === 0) {
      //   state.queryParams = []
      //   return
      // }
      const indexesOfRemovedItems = findRemovedElementIndexes(
        oldQueryParamsArray,
        newQueryParamsMap
      )

      if (!indexesOfRemovedItems.length) return

      const newStateQueryParams = removeElementsAtIndexesChecked(
        state.queryParams,
        indexesOfRemovedItems
      )

      state.queryParams = [...(newStateQueryParams as typeof state.queryParams)]
      return
    }

    /**
     * If we are not adding or removing params, we are updating them
     */

    // Find the index in state.queryParams based on the oldRequestUri key and values
    const indexOfItemToModify = findChangedElementIndex(
      oldQueryParamsArray,
      newQueryParamsMap
    )

    let i = 0
    for (const { key, value } of newQueryParamsMap) {
      if (
        state.queryParams[i] &&
        state.queryParams[i].checked &&
        (state.queryParams[i].key !== key ||
          state.queryParams[i].value !== value)
      ) {
        state.queryParams[i].key = key
        state.queryParams[i].value = value
      } else if (!state.queryParams[i]) {
        addQueryParamsItem({
          id: nanoid(),
          checked: true,
          key,
          value,
          description: '',
          placeholder: false
        })
      }
      i++
    }

    return
  }

  function removeQueryParamsItem(itemKey: string) {
    const index = state.queryParams.findIndex(
      (stateItem) => stateItem.key === itemKey
    )
    state.queryParams.splice(index, 1)
    updateURI()
  }

  function updateQueryParamsItem(itemId: string, item: QueryConfigContextItem) {
    const index = state.queryParams.findIndex(
      (stateItem) => stateItem.id === itemId
    )
    if (index === -1) return
    state.queryParams[index].key = item.key
    state.queryParams[index].value = item.value
    state.queryParams[index].description = item.description
    // state.queryParams[index].placeholder = item.placeholder
    state.queryParams[index].checked = item.checked

    updateURI()
  }

  function addHeaderItem(placeholder: QueryConfigContextItem) {
    state.headers.push({
      id: placeholder.id,
      checked: true,
      key: placeholder.key,
      value: placeholder.value,
      description: placeholder.description
    })
  }

  function removeHeaderItem(itemId: string) {
    const index = state.headers.findIndex(
      (stateItem) => stateItem.id === itemId
    )
    state.headers.splice(index, 1)
  }

  function addConstraintsItem(placeholder: QueryConfigConstraintsItem) {
    state.constraints.push({
      id: placeholder.id,
      checked: true,
      key: placeholder.key,
      operator: placeholder.operator,
      value: placeholder.value
    })
  }

  function removeConstraintsItem(itemId: string) {
    const index = state.constraints.findIndex(
      (stateItem) => stateItem.id === itemId
    )
    state.constraints.splice(index, 1)
  }

  function checkForDuplicateKeysInContext() {
    const checkedKeys = checkedContext.value.map((item) => item.key)

    return checkedKeys.some((key, index) => {
      return checkedKeys.indexOf(key) !== index
    })
  }

  function checkForEmptyValueFieldsInContext() {
    return checkedContext.value.some((item) => item.value === '')
  }

  function setSelectedSource(source: HubContentsNode | null) {
    state.selectedSource = source
  }

  function setSelectedTab(tabName: QueryDetailsTabsNames) {
    state.selectedTab = tabName
  }

  return {
    ...toRefs(state),
    fetchQuery,
    handleActionBtnClick,
    checkedContext,
    checkedConstraints,
    addContextItem,
    removeContextItem,
    addHeaderItem,
    removeHeaderItem,
    checkedHeaders,
    addQueryParamsItem,
    updateQueryParamsItem,
    removeQueryParamsItem,
    checkedQueryParams,
    URIUpdated,
    addConstraintsItem,
    removeConstraintsItem,
    checkForDuplicateKeysInContext,
    checkForEmptyValueFieldsInContext,
    setSelectedSource,
    setSelectedTab
  }
})

export default useQueryDetailsStore
