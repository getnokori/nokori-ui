<template>
  <div class="sign-radio-field">
    <input
      :id="id"
      v-bind="$attrs"
      class="input"
      type="radio"
      :checked="isChecked"
      :value="value"
      @change="handleChange"
    />

    <label class="label" :for="id">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => props.modelValue === props.value)

function handleChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.sign-radio-field {
  --padding-x: #{toEm(16px)};
  --icon-size: #{toEm(16px)};
}

.sign-radio-field {
  position: relative;
  margin-left: calc(var(--padding-x) * -1);
  margin-right: calc(var(--padding-x) * -1);
  color: #dadada;
  font-size: toRem(16px);
  font-weight: 500;
  line-height: 1.2;
}

.input {
  position: absolute;
  top: 50%;
  left: var(--padding-x);
  transform: translateY(-50%);
  display: grid;
  place-content: center;
  margin: 0;
  width: var(--icon-size);
  height: var(--icon-size);
  background-color: transparent;
  border: 1px solid #979797;
  border-radius: 50%;
  outline: 0;
  font: inherit;
  transition: var(--default-transition);
  appearance: none;
  cursor: pointer;

  &::before {
    content: '';
    width: toEm(10px);
    height: toEm(10px);
    background-color: var(--primary);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:checked {
    border-color: var(--primary);

    &::before {
      opacity: 1;
    }

    & + .label {
      border-color: #666;
    }
  }

  &:focus {
    box-shadow: 0 0 0 toRem(2px) var(--primary-focus);
  }
}

.label {
  display: block;
  padding: toEm(14px) var(--padding-x);
  padding-left: calc(var(--padding-x) + var(--icon-size) * 2);
  border: 1px solid transparent;
  border-radius: toRem(5px);
  transition: var(--default-transition);
  cursor: pointer;
}
</style>
