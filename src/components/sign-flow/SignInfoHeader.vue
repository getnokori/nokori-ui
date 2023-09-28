<template>
  <div class="sign-info-header">
    <div class="small-heading">Incredible value for teams of all sizes</div>

    <h1 class="title">
      <slot name="title"></slot>
    </h1>

    <p class="text">
      <slot name="text"></slot>
    </p>
  </div>
</template>

<style scoped lang="scss">
.sign-info-header {
  margin-bottom: toRem(25px);
}

.small-heading {
  display: inline-block;
  margin-bottom: toRem(4px);
  background-image: linear-gradient(
    to right,
    #11998e 0%,
    #24c586 55%,
    #38ef7d 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: toRem(17px);
  font-weight: 600;
  letter-spacing: toEm(0.25px);
  line-height: 1.2;

  @include mq($from: 768px) {
    font-size: toRem(16px);
  }
}

.title {
  margin-top: 0;
  margin-bottom: toRem(10px);
  color: #e8e8e8;
  font-size: toRem(36px);
  font-weight: 700;
  line-height: 1.2;

  @include mq($from: 768px) {
    font-size: toRem(41px);
  }
}

.text {
  margin-top: 0;
  margin-bottom: 0;
  font-size: toRem(18px);
  letter-spacing: toEm(0.25px);
  line-height: 1.5;

  @include mq($from: 768px) {
    font-size: toRem(16px);
  }
}
</style>
