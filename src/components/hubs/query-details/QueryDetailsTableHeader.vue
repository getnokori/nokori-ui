<template>
  <th class="query-details-table-header">
    {{ label }}
    <slot></slot>
  </th>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<style scoped lang="scss">
.query-details-table-header {
  padding: toRem(8px);
  border-right: 1px solid #2b2c2e;
  border-bottom: 1px solid #2b2c2e;
  font-size: toRem(15px);
  font-weight: 600;
  line-height: 1.2;
  text-align: left;

  &:first-child {
    width: toRem(33px);
  }
}
</style>
