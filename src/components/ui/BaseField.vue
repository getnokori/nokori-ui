<template>
  <div class="base-field" :class="classObject">
    <label v-if="label" class="base-field__label" :for="id">{{ label }}</label>

    <input
      :id="id"
      v-bind="$attrs"
      class="base-field__input"
      :class="props.validationError?.length && 'js-error'"
      :type="typeComputed"
      :value="modelValue"
      :placeholder="props.placeholder"
      @input="handleInput"
    />

    <div v-if="validationError?.length" class="base-field__validation-msg">
      {{ validationError[0].$message }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import type { ErrorObject } from '@vuelidate/core'

const props = defineProps<{
  id: string
  modelValue: string | number
  label?: string
  size?: 'xs' | 'md'
  type?: string
  validationError?: ErrorObject[] | undefined
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const typeComputed = computed(() => {
  return props.type ? props.type : 'text'
})

const sizeComputed = computed(() => {
  return props.size ? props.size : 'md'
})

const classObject = computed(() => {
  return {
    [`base-field--${sizeComputed.value}`]: sizeComputed.value
  }
})

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.base-field {
  &--md {
    .base-field__input {
      height: toRem(42px);
    }
  }

  &__label {
    display: inline-block;
    margin-bottom: toRem(6px);
    font-size: toRem(15px);
    font-weight: 500;
    cursor: pointer;
  }

  &__input {
    appearance: none;
    display: block;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: toRem(15px);
    padding-right: toRem(15px);
    width: 100%;
    color: #fff;
    background-color: #27282c;
    border: 1px solid #27282c;
    border-radius: toRem(6px);
    box-shadow: none;
    outline: 0;
    font-family: inherit;
    font-size: toRem(15px);
    letter-spacing: 0.4px;
    font-weight: 500;
    line-height: normal;
    transition: var(--default-transition);

    &::placeholder {
      color: #888;
      opacity: 1;
      font-weight: 400;
    }

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 toRem(2px) var(--primary-focus);
    }

    &.js-error {
      border-color: var(--danger);
      box-shadow: 0 0 0 toRem(2px) var(--danger-focus);
    }
  }

  &__validation-msg {
    margin-top: toRem(12px);
    color: var(--danger);
    font-size: toRem(15px);
    line-height: 1.2;
  }
}
</style>
