<template>
  <component
    :is="href ? 'a' : 'button'"
    class="base-btn"
    :class="classObject"
    :href="href"
  >
    <template v-if="isLoading">
      <span class="spinner"></span>
    </template>

    <template v-else>
      <slot></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  btnStyle?: string
  outlined?: boolean
  href?: string
  isLoading?: boolean
  size?: 'xs' | 'md'
}>()

const sizeComputed = computed(() => {
  return props.size ? props.size : 'md'
})

const styleComputed = computed(() => {
  return props.btnStyle ? props.btnStyle : 'primary'
})

const classObject = computed(() => {
  return {
    [`base-btn--${sizeComputed.value}`]: sizeComputed.value,
    [`base-btn--${styleComputed.value}`]: styleComputed.value,
    [`base-btn--outlined`]: props.outlined
  }
})
</script>

<style scoped lang="scss">
.base-btn {
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  padding: 0 toRem(15px);
  border-width: 1px;
  border-style: solid;
  border-radius: toRem(6px);
  box-shadow: none;
  outline: 0;
  font-family: inherit;
  font-size: toRem(15px);
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
  text-align: center;
  text-decoration: none;
  transition: var(--default-transition);

  &:not([href]) {
    cursor: pointer;
  }

  &:disabled {
    cursor: default;
  }

  &--primary {
    color: #fff;
    background-color: var(--primary);
    border-color: var(--primary);

    &:hover {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
    }

    &:active {
      background-color: var(--primary-active);
      border-color: var(--primary-active);
    }

    &:focus {
      box-shadow: 0 0 0 0.125rem var(--primary-focus);
    }

    &.base-btn--outlined {
      color: var(--primary);

      &:hover {
        color: #fff;
      }
    }
  }

  &--secondary {
    color: #fff;
    background-color: var(--secondary);
    border-color: var(--secondary);

    &:hover {
      background-color: var(--secondary-hover);
      border-color: var(--secondary-hover);
    }

    &:active {
      background-color: var(--secondary-active);
      border-color: var(--secondary-active);
    }

    &:focus {
      box-shadow: 0 0 0 0.125rem var(--secondary-focus);
    }

    &.base-btn--outlined {
      color: #dcdcdc;
    }
  }

  &--danger {
    color: #fff;
    background-color: var(--danger);
    border-color: var(--danger);

    &:hover {
      background-color: var(--danger-hover);
      border-color: var(--danger-hover);
    }

    &:active {
      background-color: var(--danger-active);
      border-color: var(--danger-active);
    }

    &:focus {
      box-shadow: 0 0 0 0.125rem var(--danger-focus);
    }

    &.base-btn--outlined {
      color: var(--danger);

      &:hover {
        color: #fff;
      }
    }
  }

  &--outlined {
    background-color: transparent;
  }

  &--text-plain {
    color: #fff;
    background-color: transparent;
    border-color: transparent;

    &:hover {
      background-color: hsl(228 6% 25%);
      border-color: hsl(228 6% 25%);
    }

    &:active {
      background-color: hsl(228 6% 20%);
      border-color: hsl(228 6% 20%);
    }
  }

  &--md {
    height: toRem(42px);
  }

  &:deep(svg) {
    fill: currentColor;
  }
}

.spinner {
  display: inline-block;
  vertical-align: -0.175em;
  width: 1.1em;
  height: 1.1em;
  border: 0.125em solid transparent;
  border-top-color: #fff;
  border-radius: 50%;
  animation: rotating 1.2s linear infinite;
}
</style>
