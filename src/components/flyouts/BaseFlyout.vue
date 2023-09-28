<template>
  <div ref="flyoutRef" class="base-flyout js-modal" @click="handleOutsideClick">
    <div
      ref="flyoutContentRef"
      class="base-flyout__content"
      tabindex="0"
      @keydown.esc="$emit('close')"
    >
      <div class="base-flyout__header">
        <div class="base-flyout__title">{{ title }}</div>

        <button
          class="base-flyout__close-btn"
          type="button"
          @click="$emit('close')"
        >
          <IconPlus />
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useBodyScrollLock from '@/composables/useBodyScrollLock'

const props = defineProps<{
  title: string
  width: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const flyoutRef = ref<HTMLDivElement | null>(null)
const flyoutContentRef = ref<HTMLDivElement | null>(null)

useBodyScrollLock(flyoutContentRef)

const widthInRems = computed(() => {
  return `${props.width / 16}rem`
})

onMounted(() => (flyoutContentRef.value as HTMLDivElement).focus())

function handleOutsideClick(event: MouseEvent) {
  if (flyoutRef.value === event.target) {
    emit('close')
  }
}
</script>

<style scoped lang="scss">
.base-flyout {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-modal);
  background-color: hsla(228 7% 18% / 0.6);
  transition: var(--default-transition);

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;

    .base-flyout__content {
      transform: translateX(5%);
      opacity: 0;
    }
  }

  &.v-enter-to,
  &.v-leave-from {
    opacity: 1;

    .base-flyout__content {
      transform: translateX(0);
      opacity: 1;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: toRem(26px) toRem(34px);
    border-bottom: 1px solid #2f3136;
  }

  &__title {
    font-size: toRem(28px);
    font-weight: 700;
    line-height: 1.2;
  }

  &__close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: toRem(40px);
    height: toRem(40px);
    background-color: hsl(228 6% 16%);
    border: 0;
    border-radius: 50%;
    outline: 0;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: hsl(228, 6%, 21%);
    }

    svg {
      transform: rotate(45deg);
      width: toRem(17px);
      height: toRem(17px);
      fill: #dcdcdc;
    }
  }

  &__content {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    // width: v-bind(widthInRems);
    overflow-y: auto;
    background-color: hsl(228 7% 14%);
    outline: 0;
    transition: var(--default-transition);
  }
}
</style>
