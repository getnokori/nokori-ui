<template>
  <div class="sign-plan-comparison-link">
    <a class="link" href="https://nokori.com/pricing">
      See full plan comparison
      <IconUpRightFromSquare class="link__icon" />
    </a>
  </div>
</template>

<style scoped lang="scss">
.sign-plan-comparison-link {
  display: flex;
  justify-content: center;
  margin-top: toRem(20px);
  color: #ababab;
  font-size: toRem(16px);
  font-weight: 500;
  line-height: 1.2;
}

.link {
  display: flex;
  justify-content: center;
  color: #ababab;
  text-decoration: none;
  transition: var(--default-transition);

  &:hover {
    color: var(--primary);

    .link__icon {
      fill: var(--primary);
    }
  }

  &__icon {
    transform: translateY(2px);
    margin-left: toEm(5px);
    width: toEm(16px);
    height: toEm(16px);
    fill: #ababab;
    transition: var(--default-transition);
  }
}
</style>
