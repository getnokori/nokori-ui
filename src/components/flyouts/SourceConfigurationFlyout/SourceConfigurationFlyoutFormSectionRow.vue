<template>
  <div class="source-config-form-section-row">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.source-config-form-section-row {
  display: flex;
  margin-bottom: toRem(12px);

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
