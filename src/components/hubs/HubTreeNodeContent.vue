<template>
  <div class="node-content" :class="`--${state.dragOverClass}`" droppable>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
//props
const props = withDefaults(
  defineProps<{
    dragOverActive?: boolean | undefined
  }>(),
  {
    dragOverActive: false
  }
)
const state = reactive({
  dragOverClass: 'inactive'
})

watch(() => props.dragOverActive, handleDragOver)

function handleDragOver() {
  if (props.dragOverActive) {
    state.dragOverClass = 'active'
  } else {
    state.dragOverClass = 'inactive'
  }
}

handleDragOver()
</script>

<style lang="scss">
.node-content {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: calc(#{toRem(100px) * -1});
  margin-right: calc(var(--padding-x) * -1);
  padding-left: toRem(100px);
  padding-right: var(--padding-x);

  &:hover {
    background-color: hsl(228 6% 16.5%);

    .node-delete-btn {
      visibility: visible !important;
      opacity: 1 !important;
    }
  }
}

.--active {
  background-color: hsl(228 6% 16.5%);
}
</style>
