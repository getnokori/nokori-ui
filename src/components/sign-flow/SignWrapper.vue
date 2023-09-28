<template>
  <div class="sign-wrapper">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.sign-wrapper {
  background-color: black;
  display: flex;
  flex-direction: column;
  min-height: 100%;

  &:deep(.base-container) {
    margin-top: auto;
    margin-bottom: auto;
    width: 100%;
  }

  @include mq($from: 768px) {
    // Controls background illustration
    overflow: hidden;
  }
}
</style>
