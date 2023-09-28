<template>
  <div class="query-details-message">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.query-details-message {
  padding: toRem(12px);
  background-color: #1d1e21;
  border: 1px solid #2b2c2e;
  border-radius: toRem(6px);
  font-size: toRem(16px);
  line-height: 1.5;

  &:deep(> *:first-child) {
    margin-top: 0;
  }

  &:deep(> *:last-child) {
    margin-bottom: 0;
  }
}
</style>
