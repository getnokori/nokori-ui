<template>
  <button class="node-btn" type="button">
    <span
      v-if="node.children"
      class="node-btn__toggler-wrapper"
      :class="!node.isExpanded && 'node-btn__toggler-wrapper--collapsed'"
    >
      <IconCaretDown class="node-btn__toggler" />
    </span>

    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { HubTreeNodeKey } from '@/utils/injection-keys'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const node = inject(HubTreeNodeKey) as HubContentsNode
</script>

<style scoped lang="scss">
.node-btn {
  flex-grow: 1;
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0;
  padding-left: var(--padding-x);
  height: 2.1335em;
  color: #dcdcdc;
  background-color: transparent;
  border: 0;
  text-align: left;
  cursor: pointer;

  &__toggler-wrapper {
    flex-shrink: 0;
    display: inline-flex;
    margin-right: var(--toggler-margin);

    &--collapsed {
      .node-btn__toggler {
        transform: rotate(-90deg);
      }
    }
  }

  &__toggler {
    width: var(--toggler-width);
    height: 0.375em;
    fill: currentColor;
    transition: var(--default-transition);
  }
}
</style>
