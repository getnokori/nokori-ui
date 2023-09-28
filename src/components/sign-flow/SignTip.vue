<template>
  <div class="sign-tip">
    <div class="message">
      <IconMessageExclamation class="message__icon" />
      You can include this component in&nbsp;your&nbsp;own&nbsp;app.
    </div>

    <a class="link" href="#">
      Learn how
      <IconChevronRight class="link__icon" />
    </a>
  </div>
</template>

<style scoped lang="scss">
.sign-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: toRem(20px);
  color: #ababab;
  font-size: toRem(15px);
  font-weight: 500;
  line-height: 1.2;
  text-align: center;

  @include mq($from: 768px) {
    margin-top: toRem(25px);
  }
}

.message {
  margin-bottom: toRem(8px);

  @include mq($from: 1024px) {
    margin-bottom: toRem(4px);
  }

  &__icon {
    vertical-align: middle;
    margin-right: toEm(4px);
    width: toEm(19px);
    height: toEm(22px);
    fill: #ababab;
  }
}

.link {
  color: #00cf65;
  text-decoration: none;

  &:hover {
    .link__icon {
      transform: translateX(toEm(4px));
    }
  }

  &__icon {
    margin-bottom: -1px;
    margin-left: toEm(3px);
    width: toEm(7px);
    height: toEm(11px);
    fill: currentColor;
    transition: var(--default-transition);
  }
}
</style>
