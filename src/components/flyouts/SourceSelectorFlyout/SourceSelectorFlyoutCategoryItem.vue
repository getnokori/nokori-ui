<template>
  <li class="item">
    <input
      :id="`category-${value}`"
      class="item__input"
      type="radio"
      :checked="isChecked"
      :value="value"
      @change="handleChange"
    />
    <label class="item__label" :for="`category-${value}`">
      <span class="item__icon">
        <slot></slot>
      </span>
      {{ label }}
    </label>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  value: string
}>()

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  return props.modelValue === props.value
})

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.item {
  margin-bottom: toRem(12px);

  &:last-child {
    margin-bottom: 0;
  }

  &__input {
    position: absolute;
    z-index: -1;
    width: 0;
    height: 0;
    opacity: 0;

    &:checked {
      & + .item__label {
        background-color: #27282c;

        &:deep(svg) {
          fill: var(--primary);
        }
      }
    }
  }

  &__label {
    display: flex;
    align-items: center;
    padding: 0 toRem(8px);
    height: toRem(34px);
    color: #dcdcdc;
    border-radius: toRem(4px);
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.2;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #27282c;
    }
  }

  &__icon {
    display: grid;
    margin-right: toRem(18px);

    &:deep(svg) {
      width: toRem(17px);
      height: toRem(17px);
      fill: #dcdcdc;
      transition: var(--default-transition);
    }
  }
}
</style>
