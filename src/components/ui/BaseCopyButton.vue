<template>
  <button class="base-copy-btn" type="button" @click="copyHandler()">
    <IconCopy class="base-copy-btn__icon" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  copyHandler: () => void
}>()
</script>

<style scoped lang="scss">
.base-copy-btn {
  padding: toRem(3px);
  background-color: transparent;
  border: 0;
  cursor: pointer;

  &:hover {
    .base-copy-btn__icon {
      fill: #fff;
    }
  }

  &__icon {
    width: 1.07em;
    height: 1.07em;
    fill: #90939d;
    transition: var(--default-transition);
  }
}
</style>
