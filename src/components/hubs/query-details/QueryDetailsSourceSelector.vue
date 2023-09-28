<template>
  <div class="selector">
    <button
      ref="selectorBtnRef"
      class="selector__btn"
      type="button"
      @click="() => (state.isDropdownOpen = !state.isDropdownOpen)"
      @keydown="handleButtonKeydown"
    >
      <template v-if="selectedSource">
        {{ selectedSource.label }}
      </template>
      <template v-else>Source</template>
      <IconCaretDown class="selector__icon" />
    </button>

    <Transition>
      <div
        v-if="state.isDropdownOpen"
        ref="dropdownRef"
        class="dropdown"
        @keydown="handleDropdownKeydown"
      >
        <template v-if="sourcesFromHubTree">
          <div class="dropdown__search">
            <BaseSearch
              v-model="state.searchQuery"
              @clear="state.searchQuery = ''"
            />
          </div>

          <ul v-if="filteredSources?.length" class="dropdown__container">
            <li
              v-for="source in filteredSources"
              :key="source.nodeId"
              class="dropdown__item"
            >
              <button
                class="dropdown__btn"
                type="button"
                @click="handleSelect(source)"
              >
                <div class="dropdown__name">{{ source.label }}</div>
                <div class="dropdown__type">{{ source.engine }}</div>
              </button>
            </li>
          </ul>
        </template>

        <template v-else>
          <p class="dropdown__message">No sources found</p>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'
import useHubsStore from '@/stores/hubs.store'
import useQueryDetailsStore from '@/stores/query-details.store'
import KeyCodes from '@/enums/user-inputs/KeyCodes.enum'
import NodeSubTypes from '@/enums/hubs/NodeSubTypes.enum'
import type HubsContentNode from '@/types/hubs/HubContentsNode.interface'
import type QueryDetailsSourceSelectorState from '@/types/components/hubs/query-details/QueryDetailsSourceSelectorState.interface'

const dropdownRef = ref(null)
const selectorBtnRef = ref(null)

const hubsStore = useHubsStore()
const queryDetailsStore = useQueryDetailsStore()

const { hubs } = storeToRefs(hubsStore)
const { savedQuery, selectedSource } = storeToRefs(queryDetailsStore)
const { setSelectedSource } = queryDetailsStore

const state: QueryDetailsSourceSelectorState = reactive({
  searchQuery: '',
  isDropdownOpen: false
})

const sourcesFromHubTree = computed(() => {
  const hubId = savedQuery.value.data?.meta.hubId
  const currentHub = hubs.value.data.find((hub) => hub.hubId === hubId)

  if (currentHub?.contents?.children) {
    const sourcesNode = currentHub.contents.children.find(
      (predicate) => predicate.nodeSubType === NodeSubTypes.SOURCES
    )
    if (sourcesNode) {
      return sourcesNode.children
    }
  }
  return null
})

const filteredSources = computed(() => {
  return sourcesFromHubTree.value?.filter((source) =>
    source.label.toLowerCase().includes(state.searchQuery.toLowerCase())
  )
})

onClickOutside(dropdownRef, () => (state.isDropdownOpen = false), {
  ignore: [selectorBtnRef]
})

function handleButtonKeydown(event: KeyboardEvent) {
  switch (event.code) {
    case KeyCodes.ARROW_DOWN: {
      state.isDropdownOpen = true
      break
    }

    case KeyCodes.ARROW_UP: {
      state.isDropdownOpen = false
      break
    }

    case KeyCodes.ESCAPE: {
      state.isDropdownOpen = false
      break
    }
  }
}

function handleDropdownKeydown(event: KeyboardEvent) {
  switch (event.code) {
    case KeyCodes.ESCAPE: {
      state.isDropdownOpen = false
      break
    }
  }
}

function handleSelect(value: HubsContentNode) {
  setSelectedSource(value)
  state.isDropdownOpen = false
}
</script>

<style scoped lang="scss">
.selector {
  position: relative;

  &__btn {
    display: flex;
    align-items: center;
    padding: 0 toRem(15px);
    height: toRem(42px);
    color: #90939d;
    background-color: #27282c;
    border: 1px solid #2b2c2e;
    border-radius: toRem(6px);
    font-size: toRem(14px);
    font-family: var(--code-font-family);
    font-weight: 500;
    line-height: normal;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #2b2c2e;
    }
  }

  &__icon {
    flex-shrink: 0;
    margin-left: 1em;
    width: 0.72em;
    height: 0.4285em;
    fill: currentColor;
  }
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.25em);
  left: 0;
  z-index: var(--z-index-dropdown);
  padding: toRem(8px);
  width: toRem(266px);
  background-color: #222326;
  border-radius: toRem(6px);
  box-shadow: 0 toRem(7px) toRem(20px) hsla(0 0% 0% / 0.28);
  transition: var(--default-transition);

  &.v-enter-from,
  &.v-leave-to {
    transform: translateY(toRem(-10px));
    opacity: 0;
  }

  &.v-enter-to,
  &.v-leave-from {
    transform: translateY(0);
    opacity: 1;
  }

  &__search {
    height: toRem(42px);
    font-size: toRem(16px);
  }

  &__container {
    overflow-y: auto;
    margin-top: toRem(14px);
    margin-bottom: 0;
    padding-left: 0;
    max-height: toRem(200px);
    list-style-type: none;
  }

  &__btn {
    display: block;
    padding: toRem(8px) toRem(10px);
    width: 100%;
    color: #e8e8e8;
    background-color: transparent;
    border: 0;
    border-radius: toRem(6px);
    text-align: left;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #27282c;
    }
  }

  &__name {
    margin-bottom: toRem(4px);
    margin-left: 0;
    font-family: var(--code-font-family);
  }

  &__type {
    color: #90939d;
    font-size: toRem(13px);
    letter-spacing: 0.02em;
  }

  &__message {
    margin-top: 0;
    margin-bottom: 0;
    padding: toRem(8px) toRem(10px);
  }
}
</style>
