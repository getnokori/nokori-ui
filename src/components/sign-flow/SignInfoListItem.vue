<template>
  <li class="sign-info-list-item">
    <IconCircleCheck class="icon" />

    <div class="content">
      <h2 class="title">
        <slot name="title"></slot>
      </h2>

      <p class="description">
        <slot name="description"></slot>
      </p>
    </div>
  </li>
</template>

<style scoped lang="scss">
.sign-info-list-item {
  display: grid;
  grid-template-columns: 1em auto;
  gap: toRem(18px);
  margin-bottom: toRem(18px);

  &:last-child {
    margin-bottom: 0;
  }

  @include mq($from: 768px) {
    margin-bottom: toRem(24px);
  }
}

.icon {
  transform: translateY(0.1em);
  width: 1em;
  height: 1em;
  fill: #00b82e;
}

.title {
  margin-top: 0;
  margin-bottom: toRem(6px);
  font-size: toRem(17px);
  font-weight: 700;
  line-height: 1.2;
}

.description {
  margin-top: 0;
  margin-bottom: 0;
  font-size: toRem(16px);
  line-height: 1.5;
}
</style>
