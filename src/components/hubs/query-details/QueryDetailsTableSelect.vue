<template>
  <div class="query-details-table-select">
    <select
      v-bind="$attrs"
      class="query-details-table-select__field"
      :class="placeholder && 'query-details-table-select__field--placeholder'"
      :value="modelValue"
      @change="handleSelect"
    >
      <option v-if="placeholder" value="" hidden disabled>
        {{ placeholder }}
      </option>

      <slot></slot>
    </select>

    <IconCaretDown v-if="modelValue" class="query-details-table-select__icon" />
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

function handleSelect(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<style scoped lang="scss">
.query-details-table-select {
  position: relative;

  &__icon {
    position: absolute;
    top: 50%;
    right: toRem(8px);
    transform: translateY(-50%);
    width: toRem(9px);
    height: toRem(5px);
    fill: #e8e8e8;
  }

  &__field {
    position: relative;
    z-index: 1;
    appearance: none;
    display: block;
    padding: toRem(8px);
    width: 100%;
    height: toRem(34px);
    color: #e8e8e8;
    border: 0;
    background-color: transparent;
    outline: 0;
    font-family: var(--code-font-family);
    font-size: toRem(14px);
    font-weight: 500;
    line-height: normal;
    text-overflow: ellipsis;
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:focus {
      position: static;
      background-color: hsl(220, 3%, 10%);
    }

    &--placeholder {
      color: #3f4147;
      font-weight: 400;
    }
  }
}
</style>
