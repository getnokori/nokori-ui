<template>
  <form class="source-config-form">
    <slot></slot>

    <div class="source-config-form__footer">
      <slot name="footer"></slot>
    </div>
  </form>
</template>

<style scoped lang="scss">
.source-config-form {
  padding-top: toRem(25px);

  &__footer {
    display: grid;
    gap: toRem(10px);
    grid-template-columns: repeat(2, toRem(160px));
    justify-content: flex-end;
    padding: toRem(25px) toRem(34px);
    border-top: 1px solid #2f3136;
  }
}
</style>
