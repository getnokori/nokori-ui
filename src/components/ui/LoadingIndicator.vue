<template>
  <div class="loading-indicator" :class="classObject">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'xs'
    noPadding?: boolean
    color?: string
  }>(),
  {
    size: 'md',
    noPadding: false,
    color: '#444'
  }
)

const classObject = computed(() => {
  return {
    [`loading-indicator--${props.size}`]: props.size,
    'loading-indicator--no-padding': props.noPadding
  }
})
</script>

<style scoped lang="scss">
.loading-indicator {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &--xs {
    padding-top: toRem(8px);
    padding-bottom: toRem(8px);

    & > .spinner {
      width: toRem(20px);
      height: toRem(20px);

      &::after {
        width: toRem(20px);
        height: toRem(20px);
        border-width: 0.15rem;
      }
    }
  }

  &--sm {
    padding-top: toRem(16px);
    padding-bottom: toRem(16px);

    & > .spinner {
      width: toRem(32px);
      height: toRem(32px);

      &::after {
        width: toRem(32px);
        height: toRem(32px);
        border-width: 0.15rem;
      }
    }
  }

  &--md {
    padding-top: toRem(32px);
    padding-bottom: toRem(32px);

    & > .spinner {
      width: toRem(64px);
      height: toRem(64px);

      &::after {
        width: toRem(64px);
        height: toRem(64px);
        border-width: 0.2rem;
      }
    }
  }

  &--no-padding {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  & > .spinner {
    &::after {
      content: '';
      display: block;
      border-style: solid;
      border-color: v-bind(color);
      border-left-color: transparent;
      border-radius: 50%;
      animation: rotating 1.2s linear infinite;
    }
  }
}
</style>
