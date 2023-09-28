<template>
  <HubTreeNode ref="nodeRef" :key="props.node.nodeId" :node="node">
    <HubTreeNodeContent>
      <HubTreeNodeButton @click="handleClick" @keydown="handleKeydown">
        <HubTreeNodeIcon />

        <HubTreeNodeLabel draggable="true" @dragstart="startDrag">
          <HubTreeNodeQueryType v-if="node.command" :command="node.command" />

          <HubTreeNodeEditField
            v-if="node.isEditModeOn"
            ref="editFieldRef"
            v-model.trim="nodeLabel"
            @outside-click="resetNodeEditMode"
          />

          <template v-else>
            {{ node.label }}
          </template>
        </HubTreeNodeLabel>
      </HubTreeNodeButton>

      <HubTreeNodeDeleteButton>
        <BaseIconButton @click="toggleDeleteQueryModal">
          <IconTrashCanSolid />
        </BaseIconButton>
      </HubTreeNodeDeleteButton>
    </HubTreeNodeContent>
  </HubTreeNode>

  <Teleport to="body">
    <Transition>
      <BaseDeletionModal
        v-if="state.isDeleteQueryModalOpen"
        title="Delete Query?"
        text="Are you sure you want to delete this query?"
        :is-loading="state.deleting.isLoading"
        @close="toggleDeleteQueryModal"
        @delete="deleteQuery"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useHubTreeNode from '@/composables/hubs/useHubTreeNode'
import useHubsStore from '@/stores/hubs.store'
import QueriesService from '@/services/queries.service'
import { checkForQueryInStorage } from '@/services/unsavedQueries.service'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'
import type HubTreeNodeQueryState from '@/types/components/hubs/HubTreeNodeQueryState.interface'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'

const props = defineProps<{
  hubId: string
  node: HubContentsNode
}>()

const hubsStore = useHubsStore()
const { deleteNode, setQueryNodeDirtyState } = hubsStore

const {
  nodeRef,
  editFieldRef,
  nodeLabel,
  resetNodeEditMode,
  handleClick,
  handleKeydown
} = useHubTreeNode(props.hubId, props.node)

const state: HubTreeNodeQueryState = reactive({
  deleting: {
    isLoading: false,
    error: null
  },
  isDeleteQueryModalOpen: false
})

async function deleteQuery() {
  state.deleting.error = null
  state.deleting.isLoading = true

  try {
    const result = await QueriesService.deleteQuery(props.node.nodeId)
    if (result) {
      deleteNode(props.node)
    }
  } catch (error: unknown) {
    // TODO: add Toast with an error
    state.deleting.error = error as Error
  } finally {
    state.deleting.isLoading = false
    state.isDeleteQueryModalOpen = false
  }
}

function toggleDeleteQueryModal() {
  state.isDeleteQueryModalOpen = !state.isDeleteQueryModalOpen
}

function startDrag(evt: DragEvent) {
  if (!evt?.dataTransfer) return
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('srcNodeId', props.node.nodeId)
  evt.dataTransfer.setData('srcNodeType', NodeTypes.QUERY)
}

if (checkForQueryInStorage(props.node.nodeId)) {
  setQueryNodeDirtyState(props.node.nodeId, true)
}
</script>
