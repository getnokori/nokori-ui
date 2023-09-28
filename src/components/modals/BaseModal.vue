<template>
  <div
    ref="modalRef"
    class="base-modal js-modal"
    tabindex="0"
    @keydown.esc="$emit('close')"
    @click="handleOutsideClick"
  >
    <div class="base-modal__container">
      <div class="base-modal__header">
        <div class="base-modal__title">
          {{ title }}
        </div>

        <button
          class="base-modal__close-btn"
          type="button"
          @click="$emit('close')"
        >
          <IconXmarkRegular />
        </button>
      </div>

      <div v-if="error" class="base-modal__error">
        {{ error.message }}
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useBodyScrollLock from '@/composables/useBodyScrollLock'

const props = defineProps<{
  error?: Error | null
  title?: string
  width?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLDivElement | null>(null)

useBodyScrollLock(modalRef)

const widthInRems = computed(() => {
  return props.width ? `${props.width / 16}rem` : '28.75rem' // 460px
})

onMounted(() => (modalRef.value as HTMLDivElement).focus())

function handleOutsideClick(event: MouseEvent) {
  if (modalRef.value === event.target) {
    emit('close')
  }
}
</script>

<style scoped lang="scss">
.base-modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-modal);
  overflow-y: auto;
  display: flex;
  padding: toRem(50px) var(--grid-padding);
  background-color: hsla(228 7% 18% / 0.6);
  outline: 0;
  transition: var(--default-transition);

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
  }

  &.v-enter-to,
  &.v-leave-from {
    opacity: 1;
  }

  &__container {
    flex-shrink: 0;
    margin: auto;
    padding-top: toRem(40px);
    padding-bottom: toRem(40px);
    padding-left: toRem(40px);
    padding-right: toRem(40px);
    width: 100%;
    max-width: v-bind(widthInRems);
    background-color: hsl(228 7% 14%);
    border-radius: toRem(12px);
    transition: var(--default-transition);
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: toRem(25px);
    padding-bottom: toRem(8px);
    padding-right: toRem(24px);
    min-height: toRem(34px);
    border-bottom: 1px solid var(--section-border-color);
  }

  &__title {
    font-size: toRem(22px);
    font-weight: 600;
    line-height: 1.2;
  }

  &__close-btn {
    position: absolute;
    top: 0;
    right: toRem(6px) * -1;
    padding: toRem(6px);
    background-color: transparent;
    border: 0;
    border-radius: toRem(6px);
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: hsla(222 5% 42% / 0.15);
    }

    &:active {
      background-color: hsla(222 5% 42% / 0.075);
    }

    & > svg {
      display: block;
      width: toRem(14px);
      height: toRem(14px);
      fill: hsl(222 5% 42%);
    }
  }

  &__error {
    margin-bottom: toRem(20px);
    padding: toRem(16px);
    color: #f00;
    border: 1px solid #444;
    border-radius: toRem(6px);
    font-size: toRem(16px);
    font-weight: 400;
    line-height: 1.3;
    text-align: center;
  }
}
</style>
