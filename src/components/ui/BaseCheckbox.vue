<template>
  <label class="base-checkbox">
    <input
      :id="id"
      v-bind="$attrs"
      class="input"
      type="checkbox"
      :checked="modelValue"
      @change="handleChange"
    />
    <span class="text">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  id: string
}>()

const emit = defineEmits(['update:modelValue'])

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<style scoped lang="scss">
.base-checkbox {
  display: inline-grid;
  grid-template-columns: toEm(14px) auto;
  gap: toEm(16px);
  color: #dadada;
  font-size: toRem(16px);
  font-weight: 400;
  line-height: 1.5;
  cursor: pointer;
}

.input {
  transform: translateY(toEm(3px));
  display: grid;
  place-content: center;
  margin: 0;
  width: toEm(18px);
  height: toEm(18px);
  background-color: transparent;
  border: toRem(2px) solid #979797;
  border-radius: toEm(2px);
  outline: 0;
  font: inherit;
  transition: var(--default-transition);
  appearance: none;
  cursor: pointer;

  &::before {
    content: '';
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    width: toEm(10px);
    height: toEm(10px);
    background-color: #fff;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:checked {
    background-color: var(--primary);
    border-color: var(--primary);

    &::before {
      opacity: 1;
    }
  }

  &:focus {
    box-shadow: 0 0 0 toRem(2px) var(--primary-focus);
  }
}

.text {
  &:deep(a) {
    @include link;
  }
}
</style>
