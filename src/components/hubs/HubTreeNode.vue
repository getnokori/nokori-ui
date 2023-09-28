<template>
  <li ref="nodeRef" class="node" draggable>
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { HubTreeNodeKey } from '@/utils/injection-keys'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const props = defineProps<{
  node: HubContentsNode
}>()

const nodeRef = ref<null | HTMLLIElement>(null)

defineExpose({
  nodeRef
})

provide(HubTreeNodeKey, props.node)

const classObject = computed(() => {
  return {
    [`node--${props.node.nodeType}`]: props.node.nodeType,
    'node--folder-empty':
      props.node.nodeType === NodeTypes.FOLDER && !props.node.children,
    'node--active': props.node.isActive,
    'node--dirty': props.node.isDirty,
    'node--edit-mode': props.node.isEditModeOn
  }
})
</script>

<style scoped lang="scss">
.node {
  --padding-x: 0.64em;
  --control-border-radius: 0.3em;
  --toggler-width: 0.6em;
  --toggler-margin: 0.7em;
}

.node {
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  // States
  &--folder-empty {
    padding-left: calc(var(--padding-x));
  }

  &--edit-mode {
    &:deep(> .node-content) {
      background-color: hsl(228 6% 16%) !important;

      .node-edit-field__input {
        color: #fff;
      }
    }
  }

  &--query {
    // Indicator
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: toRem(8px);
      transform: translateY(-50%);
      width: toRem(8px);
      height: toRem(8px);
      background-color: transparent;
      border-radius: 50%;
    }

    &:hover {
      &::after {
        display: none;
      }

      &:deep(.node-delete-btn) {
        visibility: visible;
        opacity: 1;
      }
    }

    &:deep(> .node-content) {
      padding-right: toRem(38px);
    }

    &.node--dirty {
      &::after {
        background-color: hsl(0 0% 100% / 0.5);
      }

      &.node--active {
        &::after {
          background-color: hsl(0 0% 100% / 1);
        }
      }
    }
  }

  &--active {
    &:deep(> .node-content) {
      background-color: hsl(228 6% 16.5%);

      .node-label {
        color: #fff;
      }
    }
  }
}
</style>
