<template>
  <div class="query-details-results">
    <div class="query-details-results__header">
      <BaseTabs>
        <BaseTabsItem
          v-for="tab of state.tabs"
          :key="tab.id"
          :is-active="tab.id === state.activeTabId"
          @click="handleTabChange(tab.id)"
        >
          {{ tab.name }}
        </BaseTabsItem>
      </BaseTabs>

      <ul class="query-details-results-meta">
        <li v-if="responseCode" class="query-details-results-meta__item">
          {{ responseCode }}
        </li>

        <li v-if="responseTime" class="query-details-results-meta__item">
          {{ responseTime }}
        </li>

        <li v-if="responseSize" class="query-details-results-meta__item">
          {{ responseSize }}
        </li>
      </ul>
    </div>

    <div class="query-details-results__body">
      <div
        v-if="isLoading"
        class="query-details-results__loading"
        :class="isLoading && 'query-details-results__loading--animating'"
      ></div>

      <BaseCodeViewer v-model="code" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { convertToBytesFormatted } from '@/services/ui/UIQueryMetrics.service'

const props = defineProps<{
  data: any
  isLoading: boolean
  responseCode: string | null
  responseTime: string | null
}>()

const state = reactive({
  activeTabId: 'results',
  tabs: [
    { id: 'results', name: 'Results' }
    // { id: 'performance', name: 'Performance' },
    // { id: 'ddl', name: 'DDL' }
  ]
})

const code = computed(() =>
  props.data ? JSON.stringify(props.data, null, 2) : ''
)

const responseSize = computed(() => {
  if (code.value) {
    const size = convertToBytesFormatted(code.value)
    return `${size.value} ${size.unit}`
  }

  return ''
})

function handleTabChange(tabId: string) {
  state.activeTabId = tabId
}
</script>

<style scoped lang="scss">
.query-details-results {
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  & > * {
    flex-shrink: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: toRem(16px);
    border-bottom: 1px solid #2b2c2e;
  }

  &__body {
    flex-grow: 1;
    position: relative;

    &:deep(.base-code-viewer) {
      min-height: 100%;
    }
  }

  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: toRem(2px);
    background-image: linear-gradient(
      to right,
      #00dbde 0%,
      #0bd1df 50%,
      #fc00ff 100%
    );

    &--animating {
      animation: infinite-loading-bar 2s linear infinite;
    }
  }
}

.query-details-results-meta {
  display: flex;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  color: #00b357;
  font-size: toRem(14px);
  line-height: 1.3;
  list-style-type: none;
  letter-spacing: 0.01rem;

  &__item {
    margin-right: toRem(22px);

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
