<template>
  <div class="query-details">
    <template v-if="savedQuery.isLoading">
      <LoadingIndicator />
    </template>

    <template v-else-if="savedQuery.error">
      <BaseError>
        {{ savedQuery.error.message }}
      </BaseError>
    </template>

    <template v-else-if="savedQuery.data">
      <div class="query-details__meta">
        <ul class="query-details-breadcrumbs">
          <li class="query-details-breadcrumbs__item">
            <span class="query-label-hub-id">{{ hubId }}</span> {{ hubLabel }}
          </li>
          <li class="query-details-breadcrumbs__item">
            {{ savedQuery.data.meta.label }}
          </li>
        </ul>
        <div v-if="isDirty" class="dirty-indicator-wrapper">
          <DirtyIndicator />
        </div>

        <div
          v-tooltip="{
            content: 'Copied',
            shown: copied,
            triggers: []
          }"
          class="query-details-slug"
        >
          {{ nodeId }}
          <div class="query-details-slug__copy-btn">
            <BaseCopyButton :copy-handler="copy" />
          </div>
        </div>
      </div>

      <div class="query-details-actions">
        <div class="query-details-actions__item">
          <QueryDetailsSourceSelector />
        </div>

        <div
          v-if="
            selectedSource &&
            selectedSource.engine &&
            UIQueryConfig[selectedSource.engine].commands.shouldShow
          "
          class="query-details-actions__item"
        >
          <template
            v-if="
              [
                SourceEngines.MYSQL,
                SourceEngines.MARIADB,
                SourceEngines.POSTGRES
              ].includes(selectedSource.engine)
            "
          >
            <BaseCustomSelect
              v-model="selectedCommand"
              :data="MySQLCommandsList"
              size="md"
              placeholder="Select Command"
            />
          </template>
          <template v-if="[SourceEngines.HTTP].includes(selectedSource.engine)">
            <BaseCustomSelect
              v-model="selectedCommand"
              :data="HTTPCommandsList"
              size="md"
              placeholder="Select Command"
            />
          </template>
        </div>

        <!-- Request URL If the source demands it -->
        <div
          v-if="
            selectedSource &&
            selectedSource.engine &&
            UIQueryConfig[selectedSource.engine].fields.http.url.shouldShow
          "
          class="query-details-actions__item query-details-actions__item--field"
        >
          <div class="query-details-actions__field-wrapper">
            <span class="query-details-actions__field-prepend">/</span>
            <input
              v-model="requestUri"
              class="query-details-actions__field"
              type="text"
            />
          </div>
        </div>

        <div
          v-if="selectedSource"
          class="query-details-actions__item query-details-actions__item--actions"
        >
          <QueryDetailsActionSelector
            :disabled="running.isLoading"
            @run="handleActionBtnClick(QueryExecutionActionType.RUN)"
            @save="handleActionBtnClick(QueryExecutionActionType.SAVE)"
            @publish="handleActionBtnClick(QueryExecutionActionType.PUBLISH)"
          />
        </div>
      </div>

      <p v-if="!selectedSource" class="query-details__message">
        Please select a source to continue creating your query.
      </p>

      <div v-if="selectedSource" class="query-details-tabs">
        <div class="query-details-tabs__nav">
          <BaseTabs>
            <BaseTabsItem
              v-for="tabName of filteredQueryDetailsTabsNames"
              :key="tabName.tabName"
              :is-active="tabName.tabName === selectedTab"
              @click="setSelectedTab(tabName.tabName)"
            >
              {{ tabName.tabLabel }}
            </BaseTabsItem>
          </BaseTabs>
        </div>

        <div class="query-details-tabs__content">
          <template v-if="selectedTab === QueryDetailsTabsNames.BODY">
            <div class="mb-3 -mt-1 flex items-center">
              <div>
                <BaseCustomSelect
                  v-model="requestBodyType"
                  :data="RequestBodyTypesList"
                  size="xs"
                  placeholder="none"
                />
              </div>
              <div class="ml-3">
                <BaseCustomSelect
                  v-if="requestBodyType?.value === 'raw'"
                  v-model="requestBodySubType"
                  :data="RequestBodySubTypesList"
                  size="xs"
                  placeholder="None"
                />
              </div>
              <div v-if="requestBodyType?.value === 'raw'" class="ml-3">
                <button
                  class="prettier-btn"
                  type="button"
                  @click="handlePrettifyClick"
                >
                  <IconWandMagicSparkles />
                </button>
              </div>
            </div>

            <QueryDetailsTabBody
              v-if="requestBodyType?.value === 'raw'"
              ref="childRef"
              v-model:body="body"
              :code-language="requestBodySubType"
            />
          </template>

          <template v-if="selectedTab === QueryDetailsTabsNames.HEADERS">
            <QueryDetailsTabHeaders v-model:headers="headers" />
          </template>

          <template v-if="selectedTab === QueryDetailsTabsNames.QUERY">
            <QueryDetailsTabEditor v-model:query="query" />
          </template>

          <template v-if="selectedTab === QueryDetailsTabsNames.QUERY_PARAMS">
            <QueryDetailsTabQueryParams v-model:queryParams="queryParams" />
          </template>

          <template v-if="selectedTab === QueryDetailsTabsNames.CONTEXT">
            <QueryDetailsTabContext />
          </template>

          <template v-if="selectedTab === QueryDetailsTabsNames.CONSTRAINTS">
            <QueryDetailsTabConstraints />
          </template>

          <template v-if="selectedTab === QueryDetailsTabsNames.LOGS">
            <QueryDetailsTabLogs
              :query-id="savedQuery.data.config.query.queryId"
            />
          </template>
        </div>
      </div>

      <QueryDetailsResults
        v-if="selectedSource && selectedTab !== QueryDetailsTabsNames.LOGS"
        :data="running.data"
        :is-loading="running.isLoading"
        :response-code="running.responseCode"
        :response-time="running.responseTime"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useClipboard, useMagicKeys, whenever } from '@vueuse/core'
import { macos } from '@/utils/platform'
import useHubsStore from '@/stores/hubs.store'
import useQueryDetailsStore from '@/stores/query-details.store'
import UIQueryConfig from '@/services/ui/UIQueryConfig.service'
import SourceEngines from '@/enums/sources/SourceEngines.enum'
import MySQLCommands from '@/enums/queries/MySQLCommands.enum'
import HTTPCommands from '@/enums/queries/HTTPCommands.enum'
import RequestBodyTypes from '@/enums/queries/RequestBodyTypes.enum'
import QueryExecutionActionType from '@/enums/queries/QueryExecutionActionType.enum'
import QueryDetailsTabsNames from '@/enums/components/hubs/QueryDetailsTabsNames.enum'
import { RequestBodySubTypes } from '../../../enums/queries/RequestBodyTypes.enum'
import type BodyCodeLanguage from '@/types/query/BodyCodeLanguage'

const hubsStore = useHubsStore()
const queryDetailsStore = useQueryDetailsStore()

const { hubs, queries } = storeToRefs(hubsStore)
const { URIUpdated } = queryDetailsStore
const {
  savedQuery,
  nodeId,
  isDirty,
  query,
  queryParams,
  body,
  selectedSource,
  selectedCommand,
  requestBodyType,
  requestBodySubType,
  requestUri,
  selectedTab,
  running,
  headers
} = storeToRefs(queryDetailsStore)

const { fetchQuery, handleActionBtnClick, setSelectedTab } = queryDetailsStore

const { copy, copied } = useClipboard({
  source: nodeId
})

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && e.type === 'keydown')
      e.preventDefault()
  }
})

const childRef = ref<any>(null)
function handlePrettifyClick() {
  if (childRef.value && childRef.value.prettifyContent) {
    childRef.value.prettifyContent()
  }
}

const MySQLCommandsList = computed(() => {
  return Object.values(MySQLCommands).map((command) => ({
    label: command.toUpperCase(),
    value: command.toUpperCase()
  }))
})

const RequestBodyTypesList = computed(() => {
  return Object.values(RequestBodyTypes).map((requestType) => ({
    label: requestType,
    value: requestType
  }))
})

const RequestBodySubTypesList = computed(() => {
  return Object.entries(RequestBodySubTypes).map(([key, value]) => ({
    label: key,
    value: value
  }))
})

const HTTPCommandsList = computed(() => {
  return Object.values(HTTPCommands).map((command) => ({
    label: command.toUpperCase(),
    value: command.toUpperCase()
  }))
})

const filteredQueryDetailsTabsNames = computed(() => {
  const tabNames = Object.values(QueryDetailsTabsNames).filter(
    (tabName: QueryDetailsTabsNames) => {
      if (selectedSource.value && selectedSource.value.engine) {
        return (
          UIQueryConfig[selectedSource.value.engine]?.tabs[tabName]
            ?.shouldShow ?? false
        )
      }
    }
  )

  const customOrder = [
    'query',
    'body',
    'headers',
    'context',
    'queryParams',
    'constraints',
    'history',
    'logs'
  ]

  const tabLabels: Record<string, string> = {
    query: 'Query',
    body: 'Body',
    headers: 'Headers',
    context: 'Context',
    queryParams: 'Query Params',
    constraints: 'Constraints',
    history: 'History',
    logs: 'Logs'
  }

  // Sort the people array based on the customOrder array
  tabNames.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b))

  // zips tab names with tab labels
  const final = tabNames.map((tabName) => {
    return {
      tabName,
      tabLabel: tabLabels[tabName]
    }
  })
  return final
})

const hubLabel = computed(() => {
  const hub = hubs.value.data.find(
    (hub) => hub.hubId === savedQuery.value.data?.meta.hubId
  )

  if (hub) {
    return hub.label
  }

  return null
})

const hubId = computed(() => {
  const hub = hubs.value.data.find(
    (hub) => hub.hubId === savedQuery.value.data?.meta.hubId
  )

  if (hub) {
    return hub.hubId
  }

  return null
})

whenever(keys.meta_enter, () => {
  if (macos) {
    handleActionBtnClick(QueryExecutionActionType.RUN)
  }
})

whenever(keys.meta_s, () => {
  if (macos) {
    handleActionBtnClick(QueryExecutionActionType.SAVE)
  }
})

whenever(keys.ctrl_enter, () => {
  if (!macos) {
    handleActionBtnClick(QueryExecutionActionType.RUN)
  }
})

whenever(keys.ctrl_s, () => {
  if (!macos) {
    handleActionBtnClick(QueryExecutionActionType.SAVE)
  }
})

watch(
  () => queries.value.activeQuery,
  (newActiveQuery, oldActiveQuery) => {
    if (newActiveQuery) {
      if (newActiveQuery.nodeId !== oldActiveQuery?.nodeId) {
        queryDetailsStore.$reset()
        fetchQuery(newActiveQuery)
      }
    }
  },
  {
    immediate: true
  }
)

watch(
  () => requestUri.value,
  (newRequestUri, oldRequestUri) => {
    URIUpdated(newRequestUri, oldRequestUri)
  }
)

watch(
  () => selectedSource.value?.engine,
  (newEngine, oldEngine) => {
    if (newEngine === 'http' && newEngine !== oldEngine) {
      setSelectedTab(QueryDetailsTabsNames.BODY)
    } else {
      setSelectedTab(QueryDetailsTabsNames.QUERY)
    }
  }
)

onMounted(() => {
  if (selectedSource.value?.engine === 'http') {
    setSelectedTab(QueryDetailsTabsNames.BODY)
    return
  }

  if (
    selectedTab?.value === QueryDetailsTabsNames.QUERY &&
    !filteredQueryDetailsTabsNames.value
      .map((item: Record<string, string>) => item.tabName)
      .includes(selectedTab?.value)
  ) {
    setSelectedTab(QueryDetailsTabsNames.BODY)
  }
})
</script>

<style scoped lang="scss">
.query-details {
  display: flex;
  flex-direction: column;
  padding: toRem(10px) toRem(15px);
  height: 100%;
  font-size: toRem(16px);
  line-height: 1.2;

  & > * {
    flex-shrink: 0;
  }

  &__message {
    margin-top: 0;
    margin-bottom: 0;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin-bottom: toRem(18px);
  }
}

.query-details-breadcrumbs {
  margin-top: 0;
  margin-bottom: 0;
  margin-right: toRem(20px);
  padding-left: 0;
  font-size: toRem(14px);
  list-style-type: none;

  &__item {
    display: inline;

    font-weight: 500;
    line-height: 1.2;
    color: #dcdcdc;

    &:last-child {
      color: #dcdcdc;

      &::after {
        display: none;
      }
    }

    &::after {
      content: '/';
      display: inline;
      padding-left: 0.5em;
      padding-right: 0.5em;
    }
  }
}

.prettier-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  width: toRem(30px);
  height: toRem(30px);
  background-color: transparent;
  border: 0;
  border-radius: toRem(6px);
  transition: var(--default-transition);
  cursor: pointer;

  &:hover {
    background-color: #27282c;
  }

  svg {
    width: 1em;
    height: 1em;
    fill: #90939d;
    transition: var(--default-transition);
  }
}

.query-details-slug {
  margin-left: auto;
  display: flex;
  align-items: center;
  padding-left: toRem(12px);
  padding-right: toRem(7px);
  height: toRem(32px);
  color: #90939d;
  background-color: #27282c;
  border: 1px solid #2b2c2e;
  border-radius: toRem(6px);
  font-family: var(--code-font-family);
  font-size: toRem(13px);
  font-weight: 500;
  line-height: normal;
  line-height: 1.2;

  &__copy-btn {
    margin-left: toRem(8px);
  }
}

.dirty-indicator-wrapper {
  position: relative;
  margin-left: 5px;
}

.query-details-actions {
  display: flex;
  margin-bottom: toRem(12px);

  &__item {
    margin-right: toRem(10px);

    &:last-child {
      margin-right: 0;
    }

    &--field {
      flex-grow: 1;
    }

    &--actions {
      margin-left: auto;
    }
  }

  &__field-prepend {
    display: flex;
    align-items: center;
    padding-left: toRem(4px);
    padding-right: toRem(16px);
  }

  &__field {
    // flex-grow: 1;
    // padding: 0 toRem(15px);
    width: 100%;
    height: toRem(41px);
    color: #ffffff;
    background-color: #27282c;
    letter-spacing: 0.01rem;
    // border: 1px solid #2b2c2e;
    border-radius: toRem(6px);
    outline: 0;
    font-size: toRem(15px);
    font-weight: 400;
    line-height: normal;
    transition: var(--default-transition);
    appearance: none;
    border-left: 2px solid #37383b;
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
    padding-left: 14px;

    &:focus {
      background-color: #2b2c2e;
    }
  }

  &__field-wrapper {
    display: flex;
    flex-grow: 1;
    width: 100%;
    padding-left: toRem(14px);
    height: toRem(42px);
    color: #90939d;
    background-color: #27282c;
    border: 1px solid #2b2c2e;
    border-radius: toRem(6px);
    outline: 0;
    font-size: toRem(16px);
    font-weight: 500;
    line-height: normal;
    transition: var(--default-transition);
    appearance: none;

    &:focus {
      background-color: #2b2c2e;
    }
  }
}

.query-details-tabs {
  margin-bottom: toRem(25px);

  &__nav {
    margin-bottom: toRem(15px);
  }
}

.query-label-hub-id {
  font-family: var(--code-font-family);
  color: #858892;
  background-color: #2b2c2e;
  padding: 5px;
  border-radius: 5px;
  margin-right: 8px;
  font-size: 13px;
  padding-left: 7px;
  padding-right: 7px;
}
</style>
