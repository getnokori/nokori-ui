<template>
  <div class="sign-form-field">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.sign-form-field {
  margin-right: toRem(16px);
  width: 100%;

  &:last-child {
    margin-right: 0;
  }
}
</style>
