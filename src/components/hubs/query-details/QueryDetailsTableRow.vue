<template>
  <tr class="query-details-table-row" :class="classObject">
    <slot></slot>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  placeholder?: boolean
  inactive?: boolean
}>()

const classObject = computed(() => ({
  'query-details-table-row--placeholder': props.placeholder,
  'query-details-table-row--inactive': props.inactive
}))
</script>

<style scoped lang="scss">
.query-details-table-row {
  &:last-child {
    &:deep(.query-details-table-cell) {
      border-bottom: 0;
    }
  }

  &:deep(*:last-child) {
    border-right: 0;
  }

  &--placeholder {
    &:deep(.query-details-table-checkbox),
    &:deep(.query-details-table-remove-btn) {
      display: none;
    }
  }

  &--inactive {
    &:deep(.query-details-table-field),
    &:deep(.query-details-table-select__field) {
      color: #3f4147;
      font-weight: 400;
    }

    &:deep(.query-details-table-select__icon) {
      fill: #3f4147;
    }
  }
}
</style>
