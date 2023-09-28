<template>
  <li class="base-tabs-item">
    <button
      v-bind="$attrs"
      class="base-tabs-item__btn"
      :class="isActive && 'js-active'"
      type="button"
    >
      <slot></slot>
    </button>
  </li>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps<{
  isActive: boolean
}>()
</script>

<style scoped lang="scss">
.base-tabs-item {
  margin-right: toRem(16px);

  &:last-child {
    margin-right: 0;
  }

  &__btn {
    position: relative;
    padding-top: 0;
    padding: toRem(7px) toRem(5px);
    color: #90939d;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    font-size: toRem(15px);
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1.25;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      height: 1px;
      background-color: var(--primary);
      opacity: 0;
    }

    &.js-active {
      color: #e8e8e8;

      &::after {
        opacity: 1;
      }
    }
  }
}
</style>
