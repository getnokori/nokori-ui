<template>
  <div class="base-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  fluid: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: Number,
    default: 1362 // Unused for now
  }
})

const maxWidthComputed = computed(() => {
  if (props.fluid) {
    return 'none'
  } else {
    return `${props.maxWidth / 16}rem`
  }
})
</script>

<style scoped lang="scss">
.base-container {
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--grid-padding);
  padding-right: var(--grid-padding);
  max-width: v-bind(maxWidthComputed);
}
</style>
