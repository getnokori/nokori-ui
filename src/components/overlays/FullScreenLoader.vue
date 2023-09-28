<template>
  <div
    class="fixed w-full h-full top-0 left-0 bg-black/80 z-50 items-center justify-center"
  >
    <div
      :class="[
        fullScreen ? 'h-screen' : 'h-full',
        'flex  w-full justify-center items-center'
      ]"
    >
      <IconLoadingSpinner class="animate-spin h-6 w-6 text-white" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  fullScreen: {
    type: Boolean,
    default: true
  }
})
</script>
