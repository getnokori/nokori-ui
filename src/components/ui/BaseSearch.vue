<template>
  <form class="search" :class="classObject" @submit.prevent>
    <IconMagnifyingGlassLight class="search__icon" />

    <input
      v-bind="$attrs"
      class="search__input"
      type="search"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
    />

    <button
      class="search__clear-btn"
      :class="props.modelValue && 'js-active'"
      type="button"
      @click="$emit('clear')"
    >
      <IconCircleXmarkSolid />
    </button>
  </form>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  size?: 'xs' | 'md'
}>()

const emit = defineEmits(['update:modelValue', 'clear'])

const placeholder = computed(() => {
  return props.placeholder ? props.placeholder : 'Search'
})

const size = computed(() => {
  return props.size ? props.size : 'md'
})

const classObject = computed(() => {
  return {
    [`search--${size.value}`]: size.value
  }
})

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.search {
  --icon-size: 1.25rem; // 20px
  --icon-offset: 0.8125rem; // 13px
  --clear-btn-size: 0.9375rem; // 15px
  --clear-btn-offset: 0.75rem; // 12px
}

.search {
  position: relative;

  &--md {
    .search__input {
      height: toRem(42px);
    }
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: var(--icon-offset);
    transform: translateY(-50%);
    width: var(--icon-size);
    height: var(--icon-size);
    fill: #838690;
  }

  &__input {
    display: block;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: calc(var(--icon-offset) * 2 + var(--icon-size));
    padding-right: calc(var(--clear-btn-offset) * 2 + var(--clear-btn-size));
    width: 100%;
    color: #fff;
    background-color: #27282c;
    border: 0;
    border-radius: toRem(6px);
    outline: 0;
    font-weight: 500;
    line-height: normal;
    transition: var(--default-transition);
    appearance: none;

    &::placeholder {
      color: #858892;
      opacity: 1;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      display: none;
    }
  }

  &__clear-btn {
    position: absolute;
    top: 50%;
    right: var(--clear-btn-offset);
    transform: translateY(-50%);
    padding: 0;
    background-color: transparent;
    border: 0;
    outline: 0;
    opacity: 0;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover,
    &:focus {
      svg {
        fill: hsl(226 6% 74%);
      }
    }

    &:active {
      svg {
        fill: hsl(226 6% 60%);
      }
    }

    svg {
      display: block;
      width: var(--clear-btn-size);
      height: var(--clear-btn-size);
      fill: hsl(226 6% 54%);
      transition: var(--default-transition);
    }

    &.js-active {
      opacity: 1;
    }
  }
}
</style>
