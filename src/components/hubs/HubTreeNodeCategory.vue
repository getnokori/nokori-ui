<template>
  <HubTreeNode :node="node">
    <HubTreeNodeContent
      droppable="true"
      :drag-over-active="state.dragOverActive"
      @dragover="onDragOver"
      @drop="onDrop"
      @dragleave="onDragLeave"
    >
      <HubTreeNodeButton @click="handleClick" @keydown="handleKeydown">
        <HubTreeNodeIcon />

        <HubTreeNodeLabel>
          {{ node.label }}
        </HubTreeNodeLabel>
      </HubTreeNodeButton>

      <HubTreeNodeActions>
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
      <template v-if="node.nodeSubType === NodeSubTypes.QUERIES">
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
      </template>

      <template v-else-if="node.nodeSubType === NodeSubTypes.SOURCES">
        <template v-for="childNode in node.children" :key="childNode.nodeId">
          <HubTreeNodeSource :hub-id="hubId" :node="childNode" />
        </template>
      </template>
    </HubTreeNodeChildren>
  </HubTreeNode>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useHubTreeNode from '@/composables/hubs/useHubTreeNode'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import useHubsStore from '@/stores/hubs.store'
import NodeSubTypes from '@/enums/hubs/NodeSubTypes.enum'
import HubsContentsService from '@/services/hubs.service'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const props = defineProps<{
  hubId: string
  node: HubContentsNode
}>()

const state = reactive({
  dragOverActive: false
})

const hubsStore = useHubsStore()
const { moveNode, findNodeById } = hubsStore

// prettier-ignore
const {
  handleClick,
  handleKeydown,
  handleAddButtonClick,
  handleAddButtonKeydown,
  isDropdownOpen,
  toggleDropdown
} = useHubTreeNode(props.hubId, props.node)

function onDrop(evt: DragEvent) {
  evt.preventDefault()

  state.dragOverActive = false
  const srcNodeId = evt.dataTransfer?.getData('srcNodeId')
  if (!srcNodeId) {
    return null
  }

  const targetNode = findNodeById(props.node.nodeId)
  if (!targetNode) {
    return null
  }

  // Must be the queries category root node to move a query to it.
  if (targetNode?.nodeSubType !== NodeSubTypes.QUERIES) return null
  if (evt.dataTransfer?.getData('srcNodeType') !== NodeTypes.QUERY) return null

  const didMoveNode = moveNode(srcNodeId, props.node.nodeId)
  if (didMoveNode) {
    HubsContentsService.moveNode(props.hubId, srcNodeId, props.node.nodeId)
  }
}

function onDragOver(evt: DragEvent) {
  const targetNode = findNodeById(props.node.nodeId)
  if (!targetNode) {
    return null
  }

  if (targetNode?.nodeSubType !== NodeSubTypes.QUERIES) return null
  state.dragOverActive = true

  evt.preventDefault()
}

function onDragLeave(evt: DragEvent) {
  state.dragOverActive = false
}
</script>
