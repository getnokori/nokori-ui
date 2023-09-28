<template>
  <HubTreeNode :node="node">
    <HubTreeNodeContent>
      <HubTreeNodeButton @click="handleClick" @keydown="handleKeydown">
        <HubTreeNodeIcon />

        <HubTreeNodeLabel>
          {{ node.label }}
        </HubTreeNodeLabel>
      </HubTreeNodeButton>
    </HubTreeNodeContent>
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
  handleClick,
  handleKeydown
} = useHubTreeNode(props.hubId, props.node)
</script>
