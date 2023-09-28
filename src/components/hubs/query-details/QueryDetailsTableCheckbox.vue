<template>
  <input
    class="query-details-table-checkbox"
    type="checkbox"
    :checked="modelValue"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  fieldId: string
}>()

const emit = defineEmits(['update:modelValue', 'update:checkedState'])

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
  emit('update:checkedState', {
    id: props.fieldId,
    checked: (event.target as HTMLInputElement).checked
  })
}
</script>

<style scoped lang="scss">
.query-details-table-checkbox {
  appearance: none;
  display: grid;
  place-content: center;
  padding: 0;
  width: toRem(16px);
  height: toRem(16px);
  background-color: #3e4046;
  border-radius: toRem(2px);
  transition: var(--default-transition);
  cursor: pointer;

  &::before {
    content: '';
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    width: toRem(10px);
    height: toRem(10px);
    background-color: #1d1e21;
    opacity: 0;
    transition: var(--default-transition);
  }

  &:checked {
    background-color: #e8e8e8;

    &::before {
      opacity: 1;
    }
  }
}
</style>
