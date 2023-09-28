<template>
  <input
    :fieldId="fieldId"
    class="query-details-table-field"
    :class="isValidationError && 'query-details-table-field--error'"
    type="text"
    autocomplete="off"
    :value="modelValue"
    :modelFieldType="modelFieldType"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder: string
  isValidationError?: boolean
  fieldId?: string
  modelFieldType?: string
}>()

const emit = defineEmits(['update:modelValue', 'update:fieldValue'])

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
  emit('update:fieldValue', {
    id: props.fieldId,
    value: (event.target as HTMLInputElement).value,
    modelFieldType: props.modelFieldType
  })
}
</script>

<style scoped lang="scss">
.query-details-table-field {
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
  transition: var(--default-transition);

  &:focus {
    background-color: hsl(220, 3%, 10%);
  }

  &::placeholder {
    color: #3f4147;
    opacity: 1;
    font-weight: 400;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &--error {
    background-color: hsla(
      var(--danger-h) var(--danger-s) var(--danger-l) / 0.33
    ) !important;
  }
}
</style>
