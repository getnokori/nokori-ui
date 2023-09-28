<template>
  <div class="base-select" :class="classObject">
    <IconCaretDown class="base-select__icon" />
    <select
      :id="id"
      v-bind="$attrs"
      class="base-select__input"
      :value="modelValue"
      @change="handleSelect"
    >
      <slot></slot>
    </select>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  modelValue: string
  size?: 'xs' | 'md'
}>()

const emit = defineEmits(['update:modelValue'])

const sizeComputed = computed(() => {
  return props.size ? props.size : 'md'
})

const classObject = computed(() => {
  return {
    [`base-select--${sizeComputed.value}`]: sizeComputed.value
  }
})

function handleSelect(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<style scoped lang="scss">
.base-select {
  --padding-x: 0.9375rem; // 15px
  --arrow-width: 0.72em;
}

.base-select {
  position: relative;
  background-color: #27282c;
  border-radius: toRem(6px);

  &--md {
    .base-select__input {
      height: toRem(42px);
    }
  }

  &__icon {
    position: absolute;
    top: 50%;
    right: var(--padding-x);
    transform: translateY(-50%);
    width: var(--arrow-width);
    height: 0.4285em;
    fill: currentColor;
  }

  &__input {
    position: relative;
    z-index: 1;
    display: block;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: var(--padding-x);
    padding-right: calc(var(--padding-x) * 2 + var(--arrow-width));
    width: 100%;
    color: #fff;
    background-color: transparent;
    border: 1px solid #27282c;
    border-radius: toRem(6px);
    box-shadow: none;
    outline: 0;
    font-family: inherit;
    font-size: toRem(16px);
    font-weight: 500;
    line-height: normal;
    transition: var(--default-transition);
    appearance: none;
    cursor: pointer;

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 toRem(2px) var(--primary-focus);
    }

    &:required:invalid {
      color: #888;
      opacity: 1;
      font-weight: 400;
    }
  }
}
</style>
