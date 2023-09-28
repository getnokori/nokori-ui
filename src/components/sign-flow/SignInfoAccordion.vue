<template>
  <div class="sign-info-accordion">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, readonly } from 'vue'

const count = ref(0)
const activeIndex = ref(1)

function incrementCount() {
  return ++count.value
}

function updateActiveIndex(value: number) {
  activeIndex.value = value
}

provide('incrementCount', incrementCount)
provide('activeIndex', {
  activeIndex: readonly(activeIndex),
  updateActiveIndex
})
</script>

<style scoped lang="scss">
.sign-info-accordion {
  padding: toRem(10px) toRem(20px);
  background-color: #2b2c2e;
  border-radius: toRem(15px);

  @include mq($from: 1280px) {
    margin-left: toRem(-20px);
    margin-right: toRem(-20px);
    background-color: hsla(0 0% 85% / 0.15);
  }
}
</style>
