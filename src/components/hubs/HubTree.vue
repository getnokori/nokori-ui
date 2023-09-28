<template>
  <ul class="hub-tree">
    <HubTreeNodeRoot :hub-id="hubId" :node="rootNode">
      <HubTreeNodeCategory
        v-for="node of rootNode.children"
        :key="node.nodeId"
        :hub-id="hubId"
        :node="node"
      />
    </HubTreeNodeRoot>
  </ul>

  <Teleport to="body">
    <Transition>
      <SourceSelectorFlyout
        v-if="
          sources.isSourceSelectorFlyoutOpen &&
          sources.hubSourcesNodeId === sourcesNodeId
        "
        :hub-id="hubId"
        @close="toggleSourceSelectorFlyout(null)"
      />
    </Transition>

    <Transition>
      <SourceConfigurationFlyout
        v-if="
          sources.isSourceConfigurationFlyoutOpenInEditMode &&
          sources.sourceNodeToEdit?.parentNodeId === sourcesNodeId
        "
        :hub-id="hubId"
        :mode="SourceConfigurationFlyoutMode.EDIT"
        @close="toggleSourceConfigurationFlyoutInEditMode"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useHubsStore from '@/stores/hubs.store'
import SourceConfigurationFlyoutMode from '@/enums/components/flyouts/SourceConfigurationFlyoutMode'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const props = defineProps<{
  hubId: string
  rootNode: HubContentsNode
}>()

const hubsStore = useHubsStore()
const { sources } = storeToRefs(hubsStore)
const {
  toggleSourceSelectorFlyout,
  toggleSourceConfigurationFlyoutInEditMode
} = hubsStore

const sourcesNodeId = computed(() => props.rootNode.children![1].nodeId)
</script>

<style scoped lang="scss">
.hub-tree {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: -0.5em;
  margin-right: -0.35em;
  padding-left: 0;
  list-style-type: none;
}
</style>
