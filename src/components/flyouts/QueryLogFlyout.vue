<template>
  <BaseFlyout title="Log Details" :width="620" @close="$emit('close')">
    <template v-if="state.log.isLoading">
      <LoadingIndicator />
    </template>

    <template v-else-if="state.log.error">
      <BaseError>
        {{ state.log.error.message }}
      </BaseError>
    </template>

    <div v-else class="query-log-details">
      <template v-if="state.log.data">
        <table class="query-log-details-meta">
          <tbody class="query-log-details-meta__tbody">
            <tr class="query-log-details-meta__tr">
              <th class="query-log-details-meta__th">Status</th>
              <td class="query-log-details-meta__td">
                <span
                  class="status"
                  :class="`status--${getQueryType(state.log.data.statusCode)}`"
                >
                  {{ state.log.data.statusCode }}
                  {{ state.log.data.statusCode === 200 ? 'OK' : 'ERROR' }}
                </span>
              </td>
            </tr>

            <tr class="query-log-details-meta__tr">
              <th class="query-log-details-meta__th">Timestamp</th>
              <td class="query-log-details-meta__td">
                {{ state.log.data.timestamp }}
              </td>
            </tr>

            <tr class="query-log-details-meta__tr">
              <th class="query-log-details-meta__th">Log Id</th>
              <td class="query-log-details-meta__td">
                <span
                  v-tooltip="{
                    content: 'Copied',
                    shown: copied,
                    triggers: []
                  }"
                  class="code"
                >
                  {{ state.log.data.logId }}
                </span>
                <BaseCopyButton :copy-handler="copy" />
              </td>
            </tr>

            <tr class="query-log-details-meta__tr">
              <th class="query-log-details-meta__th">IP Address</th>
              <td class="query-log-details-meta__td">
                {{ state.log.data.ipAddress }}
              </td>
            </tr>

            <tr class="query-log-details-meta__tr">
              <th class="query-log-details-meta__th">Query ID</th>
              <td class="query-log-details-meta__td">
                <span class="code">{{ state.log.data.queryId }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="query-log-details-section">
          <div class="query-log-details-section__title">Request</div>
          <div class="query-log-details-section__body">
            <BaseCodeViewer v-model="requestCode" />
          </div>
        </div>

        <div class="query-log-details-section">
          <div class="query-log-details-section__title">Response</div>
          <div class="query-log-details-section__body">
            <BaseCodeViewer v-model="responseCode" />
          </div>
        </div>
      </template>
    </div>
  </BaseFlyout>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useClipboard } from '@vueuse/core'
import QueriesService from '@/services/queries.service'
import type QueryLogFlyoutState from '@/types/components/flyouts/QueryLogFlyoutState.interface'

const props = defineProps<{
  queryId: string
  logId: string
}>()

defineEmits<{
  (e: 'close'): void
}>()

const state: QueryLogFlyoutState = reactive({
  log: {
    data: null,
    isLoading: false,
    error: null
  }
})

const { copy, copied } = useClipboard({
  source: props.logId
})

const requestCode = computed(() =>
  state.log.data?.request ? state.log.data.request : ''
)

const responseCode = computed(() =>
  state.log.data?.response ? state.log.data.response : ''
)

async function fetchLogDetails() {
  state.log.error = null
  state.log.isLoading = true

  try {
    const { data } = await QueriesService.getQueryLogDetails(
      props.queryId,
      props.logId
    )
    state.log.data = data
  } catch (error: unknown) {
    state.log.error = error as Error
  } finally {
    state.log.isLoading = false
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

fetchLogDetails()
</script>

<style scoped lang="scss">
.query-log-details {
  padding: toRem(25px) toRem(34px);
}

.query-log-details-meta {
  margin-bottom: toRem(45px);
  width: 100%;
  color: #e8e8e8;
  border-collapse: collapse;

  &__th,
  &__td {
    padding: toRem(8px) 0;
    font-size: toRem(15px);
    line-height: 1.2;
  }

  &__th {
    padding-right: toRem(20px);
    font-weight: 600;
    text-align: left;
  }

  &__td {
    & > .code {
      margin-right: toRem(6px);
      font-family: var(--code-font-family);
    }

    & > .status {
      font-weight: 600;

      &--ok {
        color: #10b981;
      }

      &--warn {
        color: #f59b00;
      }

      &--error {
        color: #cf6679;
      }

      &--default {
        color: #dcdcdc;
      }
    }
  }
}

.query-log-details-section {
  margin-bottom: toRem(30px);

  &:last-child {
    margin-bottom: 0;
  }

  &__title {
    margin-bottom: toRem(15px);
    padding-bottom: toRem(10px);
    color: #e8e8e8;
    border-bottom: 1px solid #36373a;
    font-size: toRem(21px);
    font-weight: 700;
    line-height: 1.2;
  }

  &__body {
  }
}
</style>
