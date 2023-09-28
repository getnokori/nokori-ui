<template>
  <HubTreeNode ref="nodeRef" :node="node">
    <HubTreeNodeContent :drag-over-active="state.dragOverActive">
      <HubTreeNodeButton
        droppable="true"
        @click="handleClick"
        @keydown="handleKeydown"
        @dragover="onDragOver"
        @drop="onDrop"
        @dragleave="onDragLeave"
      >
        <HubTreeNodeIcon />

        <HubTreeNodeLabel>
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

      <HubTreeNodeActions>
        <BaseIconButton @click="toggleDeleteQueryModal">
          <IconTrashCanSolid />
        </BaseIconButton>
        <BaseIconButton
          @click="handleAddButtonClick"
          @keydown="handleAddButtonKeydown"
        >
          <IconPlus />
        </BaseIconButton>
      </HubTreeNodeActions>
    </HubTreeNodeContent>

    <HubTreeNodeDropdown v-if="isDropdownOpen" @close="toggleDropdown" />

    <HubTreeNodeChildren v-if="node.children && node.isExpanded">
      <template v-for="childNode in node.children" :key="childNode.nodeId">
        <HubTreeNodeFolder
          v-if="childNode.nodeType === NodeTypes.FOLDER"
          :hub-id="hubId"
          :node="childNode"
        />

        <HubTreeNodeQuery
          v-else-if="childNode.nodeType === NodeTypes.QUERY"
          :hub-id="hubId"
          :node="childNode"
        />
      </template>
    </HubTreeNodeChildren>
  </HubTreeNode>

  <Teleport to="body">
    <Transition>
      <BaseDeletionModal
        v-if="state.isDeleteQueryModalOpen"
        title="Delete Folder?"
        text="Are you sure you want to delete this folder?"
        :is-loading="state.deleting.isLoading"
        @close="toggleDeleteQueryModal"
        @delete="deleteTreeNode"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useHubTreeNode from '@/composables/hubs/useHubTreeNode'
import useHubsStore from '@/stores/hubs.store'
import HubsContentsService from '@/services/hubs.service'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const props = defineProps<{
  hubId: string
  node: HubContentsNode
}>()

const state = reactive({
  deleting: {
    isLoading: false,
    error: null
  },
  isDeleteQueryModalOpen: false,
  currentNode: props.node,
  dragOverActive: false
})

const hubsStore = useHubsStore()
const { deleteNode, moveNode } = hubsStore

// prettier-ignore
const {
  nodeRef,
  editFieldRef,
  nodeLabel,
  resetNodeEditMode,
  handleClick,
  handleKeydown,
  handleAddButtonClick,
  handleAddButtonKeydown,
  isDropdownOpen,
  toggleDropdown
} = useHubTreeNode(props.hubId, props.node)

function toggleDeleteQueryModal() {
  state.isDeleteQueryModalOpen = !state.isDeleteQueryModalOpen
}

async function deleteTreeNode() {
  state.deleting.error = null
  state.deleting.isLoading = true

  try {
    const result = await HubsContentsService.deleteNode(
      props.hubId,
      props.node.nodeId
    )
    if (result) {
      deleteNode(props.node)
    }
  } catch (error: unknown) {
    // TODO: add Toast with an error
    // state.deleting.error = error as Error
  } finally {
    state.deleting.isLoading = false
    state.isDeleteQueryModalOpen = false
  }
}

function onDrop(evt: DragEvent) {
  state.dragOverActive = false
  const srcNodeId = evt.dataTransfer?.getData('srcNodeId')
  if (!srcNodeId) {
    return null
  }
  const didMoveNode = moveNode(srcNodeId, props.node.nodeId)
  if (didMoveNode) {
    HubsContentsService.moveNode(props.hubId, srcNodeId, props.node.nodeId)
  }
}

let expandTimeout: ReturnType<typeof setTimeout> | null = null // Store the setTimeout instance
const expandTimeoutDuration = 250

function onDragOver(evt: DragEvent) {
  state.dragOverActive = true
  if (props.node.children && !props.node.isExpanded) {
    if (expandTimeout === null) {
      expandTimeout = setTimeout(() => {
        state.currentNode.isExpanded = true

        expandTimeout = null
      }, expandTimeoutDuration)
    }
  }

  if (!evt?.dataTransfer) return
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.preventDefault()
}

function onDragLeave(evt: DragEvent) {
  state.dragOverActive = false

  if (expandTimeout !== null) {
    clearTimeout(expandTimeout) // Clear the timeout when the onDragLeave event occurs
    expandTimeout = null // Reset the expandTimeout after clearing it
  }
  // state.currentNode.isExpanded = false
}
</script>
