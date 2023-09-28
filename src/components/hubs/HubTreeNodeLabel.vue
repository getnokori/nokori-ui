<template>
  <span class="node-label" :class="classObject">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import { HubTreeNodeKey } from '@/utils/injection-keys'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const node = inject(HubTreeNodeKey) as HubContentsNode

const classObject = computed(() => {
  return {
    'node-label--query': node.nodeType === NodeTypes.QUERY
  }
})
</script>

<style scoped lang="scss">
.node-label {
  overflow: hidden;
  display: inline-block;
  width: 100%;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
  text-overflow: ellipsis;

  &--query {
    color: #858585;
  }
}
</style>
