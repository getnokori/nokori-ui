<template>
  <div class="hubs-sidebar">
    <div class="hubs-sidebar__container">
      <div class="hubs-sidebar__search">
        <BaseSearch
          v-model="searchQuery"
          placeholder="Search"
          @clear="searchQuery = ''"
        />
      </div>

      <div class="hubs-sidebar__tabs">
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

        <div class="hubs-sidebar__add-btn">
          <BaseIconButton @click="$emit('openHubCreationModal')">
            <IconPlus />
          </BaseIconButton>
        </div>
      </div>

      <div class="hubs-sidebar__tree">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useHubsStore from '@/stores/hubs.store'

defineEmits(['openHubCreationModal'])

const hubsStore = useHubsStore()
const { searchQuery } = storeToRefs(hubsStore)

const state = reactive({
  activeTabId: 'hubs',
  tabs: [
    { id: 'hubs', name: 'Hubs' }
    // { id: 'sources', name: 'Sources' }
  ]
})

function handleTabChange(tabId: string) {
  state.activeTabId = tabId
}
</script>

<style scoped lang="scss">
.hubs-sidebar {
  max-width: toRem(344px);
  height: 100%;
  border-right: 1px solid var(--section-border-color);

  &__container {
    overflow: hidden;
    padding: toRem(14px) toRem(15px);
    height: 100%;
    font-size: toRem(15px);
    line-height: 1.2;
  }

  &__search {
    margin-bottom: toRem(8px);
    height: toRem(42px);
    font-size: toRem(16px);
  }

  &__tabs {
    position: relative;
    margin-bottom: toRem(10px);
  }

  &__add-btn {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
