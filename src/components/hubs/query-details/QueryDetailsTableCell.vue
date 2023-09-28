<template>
  <td class="query-details-table-cell">
    <slot></slot>
  </td>
</template>

<style scoped lang="scss">
.query-details-table-cell {
  padding: 0;
  border-right: 1px solid #2b2c2e;
  border-bottom: 1px solid #2b2c2e;

  // Checkbox
  &:first-child {
    padding: toRem(9px) toRem(8px);
    width: toRem(33px);
  }

  // Remove button
  &:last-child {
    padding: toRem(8px);
    width: toRem(31px);
  }
}
</style>
