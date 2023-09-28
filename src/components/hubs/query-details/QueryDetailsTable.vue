<template>
  <table class="query-details-table">
    <thead>
      <slot name="head"></slot>
    </thead>

    <tbody>
      <slot name="body"></slot>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.query-details-table {
  width: 100%;
  background-color: #1d1e21;
  border: 1px solid #2b2c2e;
  border-radius: toRem(6px);
  border-spacing: 0;
}
</style>
