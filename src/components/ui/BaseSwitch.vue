<template>
  <div class="switch" :class="classObject">
    <label v-if="$slots.default" class="switch__label" :for="id">
      <slot></slot>
    </label>

    <input
      v-bind="$attrs"
      :id="id"
      class="switch__input"
      type="checkbox"
      :checked="modelValue"
      @change="handleChange"
    />
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
  modelValue: boolean
  id: string
  labelSide?: 'left' | 'right'
}>()

const emit = defineEmits(['update:modelValue'])

const labelSide = computed(() => {
  return props.labelSide ? props.labelSide : 'left'
})

const classObject = computed(() => {
  return {
    [`switch--${labelSide.value}`]: labelSide.value
  }
})

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<style scoped lang="scss">
.switch {
  display: inline-flex;
  cursor: pointer;

  &--left {
    .switch__label {
      padding-right: toRem(12px);
    }
  }

  &--right {
    flex-direction: row-reverse;

    .switch__label {
      padding-left: toRem(12px);
    }
  }

  &__input {
    flex-shrink: 0;
    position: relative;
    width: toRem(32px);
    height: toRem(20px);
    background-color: #979797;
    border: 0;
    border-radius: toRem(100px);
    outline: 0;
    transition: var(--default-transition);
    appearance: none;
    cursor: pointer;

    &:checked {
      background-color: #00cf65;

      &::after {
        left: toRem(15px);
      }
    }

    &:focus {
      box-shadow: 0 0 0 toRem(2px) hsla(149 100% 41% / 0.5);
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: toRem(3px);
      transform: translateY(-50%);
      width: toRem(14px);
      height: toRem(14px);
      background-color: #fff;
      border-radius: 50%;
      transition: var(--default-transition);
    }
  }

  &__label {
    color: #dcdcdc;
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.2;
    cursor: pointer;
  }
}
</style>
