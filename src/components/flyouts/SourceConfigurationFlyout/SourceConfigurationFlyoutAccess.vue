<template>
  <div class="source-config-access">
    <IconLockSolid class="source-config-access__icon" />

    <strong class="source-config-access__title">IP Address</strong>

    <p class="source-config-access__desc">
      Please allow nokori to connect to your database by whitelisting our public
      IPs
    </p>

    <a class="source-config-access__link" href="#">Learn More</a>
  </div>
</template>

<style scoped lang="scss">
.source-config-access {
  margin-left: auto;
  padding: toRem(18px) toRem(25px);
  max-width: toRem(265px);
  background-color: hsla(223 6% 23% / 0.74);
  border-radius: toRem(6px);
  font-size: toRem(15px);

  &__icon {
    margin-bottom: toRem(13px);
    width: toRem(14px);
    height: toRem(15px);
    fill: #e8e8e8;
  }

  &__title {
    display: block;
    margin-bottom: toRem(5px);
    line-height: 1.2;
  }

  &__desc {
    margin-top: 0;
    margin-bottom: toRem(5px);
    line-height: 1.6;
  }

  &__link {
    font-size: 15px;
    color: var(--primary);
    border-bottom: 1px solid transparent;
    line-height: 1.2;
    text-decoration: none;
    transition: var(--default-transition);

    &:hover {
      border-bottom-color: var(--primary);
    }
  }
}
</style>
