<template>
  <template v-if="hubs.isLoading">
    <FullScreenLoader />
  </template>

  <template v-else-if="hubs.error">
    <BaseError>
      {{ hubs.error }}
    </BaseError>
  </template>

  <div v-else class="hubs">
    <HubsSidebar @open-hub-creation-modal="toggleHubCreationModal">
      <template v-if="filteredHubs.length">
        <template v-if="(filteredHubs[0] as Hub).contents">
          <HubTree
            v-for="hub in (filteredHubs as Hub[])"
            :key="hub.hubId"
            :hub-id="hub.hubId"
            :root-node="hub.contents"
          />
        </template>

        <template v-else>
          <template
            v-for="childNode in (filteredHubs as HubContentsNode[])"
            :key="childNode.nodeId"
          >
            <HubTreeNodeChildren>
              <HubTreeNodeQuery :hub-id="childNode.hubId" :node="childNode" />
            </HubTreeNodeChildren>
          </template>
        </template>
      </template>
    </HubsSidebar>

    <QueryDetails v-if="queries.activeQuery" />

    <template v-if="!hasHubs">
      <div
        class="mx-auto mt-32 h-fit px-32 py-12 rounded-lg border-[1px] border-dashed border-gray-500"
      >
        <div class="text-center">
          <svg
            class="mx-auto h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vector-effect="non-scaling-stroke"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 class="mt-2 font-semibold text-gray-200">No Hubs</h3>
          <p class="mt-1 text-sm text-gray-300">
            Get started by creating a new Hub.
          </p>
          <div class="mt-6">
            <button
              type="button"
              class="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              @click="toggleHubCreationModal()"
            >
              <PlusCircleIcon
                class="-ml-0.5 mr-1.5 h-5 w-5"
                aria-hidden="true"
              />
              New Hub
            </button>
          </div>
          <div class="mt-6 text-sm tracking-normal">
            <a
              href="https://docs.nokori.com/guides/hubs/"
              target="_blank"
              class="underline"
              >Read the docs</a
            >
            for help getting started
          </div>
        </div>
      </div>
    </template>
  </div>

  <Teleport to="body">
    <Transition>
      <HubCreationModal
        v-if="state.isHubCreationModalOpen"
        @created="init"
        @close="toggleHubCreationModal"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useHubsStore from '@/stores/hubs.store'
import useUserStore from '@/stores/user.store'
import type Hub from '@/types/hubs/Hub.interface'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'
import type HubsViewState from '@/types/views/HubsViewState.interface'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'

const hubsStore = useHubsStore()
const { hubs, queries, filteredHubs } = storeToRefs(hubsStore)
const { fetchHubs, restoreActiveQueryFromStorage } = hubsStore

const state: HubsViewState = reactive({
  isHubCreationModalOpen: false
})

const hasHubs = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function toggleHubCreationModal() {
  state.isHubCreationModalOpen = !state.isHubCreationModalOpen
}

async function init() {
  await fetchHubs()

  if (hubs.value.data.length) {
    restoreActiveQueryFromStorage()
    hasHubs.value = true
  }
}

if (user.value) {
  init()
}
</script>

<style scoped lang="scss">
.hubs {
  display: grid;
  grid-template-columns: toRem(344px) auto;
  height: 100%;
  background-color: #202125;
}
</style>
