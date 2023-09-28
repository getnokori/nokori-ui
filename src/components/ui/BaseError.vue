<template>
  <div class="base-error">
    <div class="base-error__icon">
      <IconTriangleExclamationSolid />
    </div>

    <p class="base-error__message">
      <slot></slot>
    </p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.base-error {
  text-align: center;

  &__icon {
    margin-bottom: toRem(10px);

    & > svg {
      width: toRem(40px);
      height: toRem(40px);
      fill: #fff;
      margin: 0 auto;
    }
  }

  &__message {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.5;
  }
}
</style>
