<template>
  <button class="query-details-table-remove-btn" type="button">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.query-details-table-remove-btn {
  display: block;
  padding: 0;
  background-color: transparent;
  border: 0;
  outline: 0;
  cursor: pointer;

  &:hover,
  &:focus {
    &:deep(svg) {
      fill: #e8e8e8;
    }
  }

  &:deep(svg) {
    display: block;
    width: toRem(15px);
    height: toRem(18px);
    fill: #666;
    transition: var(--default-transition);
  }
}
</style>
