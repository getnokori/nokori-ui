<template>
  <HubTreeNode ref="nodeRef" :node="node">
    <HubTreeNodeContent>
      <HubTreeNodeButton @click="handleClick" @keydown="handleKeydown">
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
    </HubTreeNodeContent>

    <HubTreeNodeChildren v-if="node.children && node.isExpanded">
      <slot></slot>
    </HubTreeNodeChildren>
  </HubTreeNode>
</template>

<script setup lang="ts">
import useHubTreeNode from '@/composables/hubs/useHubTreeNode'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const props = defineProps<{
  hubId: string
  node: HubContentsNode
}>()

// prettier-ignore
const {
  nodeRef,
  editFieldRef,
  nodeLabel,
  resetNodeEditMode,
  handleClick,
  handleKeydown
} = useHubTreeNode(props.hubId, props.node)
</script>
