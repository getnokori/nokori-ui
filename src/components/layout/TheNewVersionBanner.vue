<template>
  <header class="new-version">
    <div class="new-version__container">
      <p class="new-version__text">A new version is available 🎉</p>
      <button class="new-version__btn" type="button">Update Now</button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.new-version {
  background-color: #020203;

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: toRem(56px);
  }

  &__text {
    margin-top: 0;
    margin-bottom: 0;
    font-size: toRem(16px);
    font-weight: 600;
    letter-spacing: toRem(0.4px);
    line-height: 1.2;
  }

  &__btn {
    margin-left: toRem(16px);
    padding: 0 toRem(38px);
    height: toRem(32px);
    color: #fff;
    background-color: var(--primary);
    border: 0;
    border-radius: toRem(100px);
    font-size: toRem(15px);
    font-weight: 500;
    line-height: normal;
    transition: background-color 200ms, border-color 200ms, box-shadow 200ms;
    cursor: pointer;

    &:hover {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
    }

    &:active {
      background-color: var(--primary-active);
      border-color: var(--primary-active);
    }

    &:focus {
      box-shadow: 0 0 0 0.125rem var(--primary-focus);
    }
  }
}
</style>
