<template>
  <template v-if="state.logs.isLoading && !state.logs.data.length">
    <LoadingIndicator />
  </template>

  <template v-else-if="state.logs.error">
    <BaseError>
      {{ state.logs.error.message }}
    </BaseError>
  </template>

  <template v-else>
    <template v-if="!state.logs.data.length">
      <QueryDetailsMessage>
        <p>You don't have any logs for this query.</p>
      </QueryDetailsMessage>
    </template>

    <template v-else>
      <table class="query-details-logs">
        <tbody class="query-details-logs__tbody">
          <tr
            v-for="log in state.logs.data"
            :key="log.logId"
            class="query-details-logs__tr"
          >
            <td class="query-details-logs__td">
              <button
                class="query-details-logs__btn"
                :class="`query-details-logs__btn--${getQueryType(
                  log.statusCode
                )}`"
                type="button"
                @click="toggleQueryLogFlyout(log.logId)"
              >
                {{ log.statusCode }}
                {{ log.statusCode === 200 ? 'OK' : 'ERROR' }}
              </button>
            </td>

            <td class="query-details-logs__td">
              <button
                class="query-details-logs__btn"
                type="button"
                @click="toggleQueryLogFlyout(log.logId)"
              >
                {{ log.query }}
              </button>
            </td>

            <td class="query-details-logs__td">
              <button
                class="query-details-logs__btn"
                type="button"
                @click="toggleQueryLogFlyout(log.logId)"
              >
                {{ log.timestamp }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <button
        v-if="!state.logs.noMore"
        class="query-details-logs__load-btn"
        :class="state.logs.isLoading && 'query-details-logs__load-btn--loading'"
        type="button"
        @click="fetchMoreLogs"
      >
        <IconArrowDownSolid />
        Load More
      </button>
    </template>
  </template>

  <Teleport to="body">
    <Transition>
      <QueryLogFlyout
        v-if="state.isQueryLogFlyoutOpen"
        :query-id="queryId"
        :log-id="(state.selectedLogId as string)"
        @close="toggleQueryLogFlyout"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import QueriesService from '@/services/queries.service'
import type QueryDetailsTabLogsState from '@/types/components/hubs/query-details/QueryDetailsTabLogsState.interface'

const LIMIT = 10

const props = defineProps<{
  queryId: string
}>()

const state: QueryDetailsTabLogsState = reactive({
  logs: {
    data: [],
    isLoading: false,
    error: null,
    noMore: false
  },
  selectedLogId: null,
  isQueryLogFlyoutOpen: false
})

async function fetchLogs() {
  state.logs.error = null
  state.logs.isLoading = true

  try {
    const { data } = await QueriesService.getQueryLogs(props.queryId, 0, LIMIT)

    validateDataEnding(data.length)

    state.logs.data = data
  } catch (error: unknown) {
    state.logs.error = error as Error
  } finally {
    state.logs.isLoading = false
  }
}

async function fetchMoreLogs() {
  state.logs.error = null
  state.logs.isLoading = true

  const offset = state.logs.data.length

  try {
    const { data } = await QueriesService.getQueryLogs(
      props.queryId,
      offset,
      LIMIT
    )

    validateDataEnding(data.length)

    state.logs.data.push(...data)
  } catch (error: unknown) {
    state.logs.error = error as Error
  } finally {
    state.logs.isLoading = false
  }
}

function validateDataEnding(length: number) {
  if (length < LIMIT) {
    state.logs.noMore = true
  }
}

function getQueryType(httpCode: number) {
  switch (String(httpCode)[0]) {
    case '2':
      return 'ok'
    case '3':
      return 'warn'
    case '5':
      return 'error'
    default:
      return 'default'
  }
}

function toggleQueryLogFlyout(logId?: string) {
  if (!state.isQueryLogFlyoutOpen) {
    state.isQueryLogFlyoutOpen = true

    if (logId) {
      state.selectedLogId = logId
    }
  } else {
    state.isQueryLogFlyoutOpen = false
    state.selectedLogId = null
  }
}

fetchLogs()
</script>

<style scoped lang="scss">
.query-details-logs {
  table-layout: fixed;
  overflow: hidden;
  margin-bottom: toRem(15px);
  width: 100%;
  border: 1px solid #2b2c2e;
  border-radius: toRem(6px);
  border-spacing: 0;

  &__tr {
    &:hover {
      .query-details-logs__btn {
        background-color: hsl(225 6% 8%);
      }
    }

    &:last-child {
      .query-details-logs__td {
        border-bottom: 0;
      }
    }
  }

  &__td {
    padding: 0;
    border-bottom: 1px solid #2b2c2e;

    &::before {
      content: ' ';
      visibility: hidden;
    }

    &:nth-child(1) {
      width: toRem(120px);

      .query-details-logs__btn {
        font-weight: 600;
      }
    }

    &:nth-child(2) {
      font-family: var(--code-font-family);
    }

    &:nth-child(3) {
      width: toRem(250px);
      font-weight: 500;

      .query-details-logs__btn {
        text-align: right;
      }
    }
  }

  &__btn {
    overflow: hidden;
    display: block;
    padding: toRem(10px) toRem(15px);
    width: 100%;
    height: toRem(37px);
    background-color: hsl(225 6% 12%);
    border: 0;
    font-size: toRem(14px);
    line-height: 1.2;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: background-color 200ms;
    cursor: pointer;

    &--ok {
      color: #10b981;
    }

    &--warn {
      color: #f1c232;
    }

    &--error {
      color: #cf6679;
    }

    &--default {
      color: #dcdcdc;
    }
  }

  &__load-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    padding: 0 toRem(15px);
    width: toRem(140px);
    height: toRem(38px);
    color: #dcdcdc;
    background-color: transparent;
    border: 0;
    border-radius: toRem(6px);
    font-size: toRem(16px);
    font-weight: 500;
    letter-spacing: toRem(0.2px);
    line-height: 1.2;
    transition: background-color 200ms;
    cursor: pointer;

    &:hover {
      background-color: hsl(225 6% 12%);
    }

    &:active {
      background-color: hsl(225 6% 10%);
    }

    & > svg {
      margin-right: toRem(8px);
      width: toRem(12px);
      height: toRem(16px);
      fill: #dcdcdc;
    }
  }
}
</style>
