<template>
  <div class="node-icon">
    <template v-if="node.nodeType === NodeTypes.CATEGORY">
      <IconMagnifyingGlass v-if="node.nodeSubType === NodeSubTypes.QUERIES" />
      <IconPlugCircleBolt
        v-else-if="node.nodeSubType === NodeSubTypes.SOURCES"
      />
    </template>

    <template v-else-if="node.nodeType === NodeTypes.FOLDER">
      <IconFolderOpen v-if="node.isExpanded" />
      <IconFolderClosed v-else />
    </template>

    <template v-else-if="node.nodeType === NodeTypes.SOURCE">
      <IconDatabase />
    </template>

    <template v-else-if="node.nodeType === NodeTypes.TABLE">
      <IconTableCells />
    </template>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import NodeSubTypes from '@/enums/hubs/NodeSubTypes.enum'
import { HubTreeNodeKey } from '@/utils/injection-keys'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const node = inject(HubTreeNodeKey) as HubContentsNode
</script>

<style scoped lang="scss">
.node-icon {
  display: inline-flex;
  flex-shrink: 0;
  margin-right: 0.5em;

  & > svg {
    width: 1em;
    height: 1em;
    fill: #666;
  }
}
</style>
