<template>
  <IconCircleInfoRegular
    v-tooltip="{ content, distance: 12 }"
    class="query-details-table-info-icon"
  />
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<style scoped lang="scss">
.query-details-table-info-icon {
  transform: translateY(toRem(2px));
  margin-left: toRem(3px);
  width: toRem(14px);
  height: toRem(14px);
  fill: #90939d;
  cursor: help;
}
</style>
