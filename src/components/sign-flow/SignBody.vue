<template>
  <main class="sign-body" :class="classObject">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  noBackground: {
    type: Boolean,
    default: false
  },
  oneChild: {
    type: Boolean,
    default: false
  }
})

const classObject = computed(() => {
  return {
    'sign-body--one-child': props.oneChild,
    'sign-body--bg': !props.noBackground
  }
})
</script>

<style scoped lang="scss">
.sign-body {
  position: relative;
  display: grid;
  gap: toRem(30px);
  margin-left: auto;
  margin-right: auto;
  max-width: var(--sign-card-width);

  &--one-child {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &--bg {
    @include mq($from: 768px) {
      // &::before {
      //   content: '';
      //   position: absolute;
      //   left: 50%;
      //   top: 50%;
      //   z-index: -1;
      //   width: toEm(750px);
      //   height: toEm(750px);
      //   transform: translateX(-50%) translateY(-50%);
      //   background-image: url('@/assets/images/sign-bg.svg');
      // }
    }
  }

  @include mq($from: 768px) {
    gap: toRem(40px);
  }

  @include mq($from: 1024px) {
    grid-template-columns: auto var(--sign-card-width);
    gap: toRem(70px);
    padding-top: 2.5%;
    padding-bottom: 4%;
    max-width: none;

    &--without-header {
      padding-top: 5%;
    }
  }
}
</style>
