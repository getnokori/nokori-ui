<template>
  <h1 class="sign-info-logo">
    <img :src="logoUrl" alt="nokori" />
  </h1>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logo.svg'
</script>

<style scoped lang="scss">
.sign-info-logo {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: toRem(25px);
  padding-bottom: toRem(25px);
  max-width: toRem(148px);

  @include mq($from: 568px) {
    padding-top: toRem(35px);
    padding-bottom: toRem(35px);
  }

  @include mq($from: 1024px) {
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: toRem(38px);
  }

  & > img {
    display: block;
  }
}
</style>
