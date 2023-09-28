<template>
  <div class="node-delete-btn" :class="`node-delete-btn`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// defineProps<{
//   nodeType: 'query' | 'folder'
// }>()
</script>

<style scoped lang="scss">
.node-delete-btn {
  position: absolute;
  top: 50%;
  right: 0.64em;
  z-index: 1;
  transform: translateY(-50%);
  visibility: hidden;
  opacity: 0;
}
</style>
