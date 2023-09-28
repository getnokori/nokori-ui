<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody one-child no-background>
        <SignCardWrapper>
          <article class="sign-up-welcome">
            <!-- <div class="sign-up-welcome__logo">
              <img :src="logoUrl" alt="lolaDB" />
            </div> -->

            <h1 class="sign-up-welcome__title">Welcome</h1>

            <h2 class="sign-up-welcome__subtitle">
              We’re so glad you’re here.
            </h2>

            <p class="sign-up-welcome__desc">
              We exist to help others bring their imagination to life.<br />
              If you need help at any time, please send a note to<br />
              <a href="mailto:help@nokori.com">help@nokori.com</a>
            </p>

            <RouterLink
              class="sign-up-welcome__btn"
              :to="{ name: RouteNames.ROOT, replace: true }"
            >
              Let's Begin
              <IconRightLong />
            </RouterLink>
          </article>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import ContainerWidths from '@/enums/ContainerWidths.enum'
import RouteNames from '@/enums/RouteNames.enum'
import { event } from 'vue-gtag'

import logoUrl from '@/assets/images/logo-without-text.svg'

try {
  event('conversion', { value: 9.0, event_category: 'signup' })
} catch (error) {
  //DO SOMETHING
}
</script>

<style scoped lang="scss">
.sign-up-welcome {
  text-align: center;

  &__logo {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: toRem(40px);
    margin-left: auto;
    margin-right: auto;
    width: toRem(114px);
    height: toRem(114px);
    background-color: #1b1d23;
    border-radius: 50%;

    // Bg blur effect
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: inherit;
      height: inherit;
      // width: inherit;
      // height: inherit;
      background-image: linear-gradient(
        48deg,
        #fc00ff 0%,
        #0b8cdf 53%,
        #00dec6 100%
      );
      border-radius: 50%;
      filter: blur(18px);
      animation: rotating 4s linear infinite;
    }

    & > img {
      display: block;
      max-width: toRem(62px);
    }
  }

  &__title {
    margin-top: 0;
    margin-bottom: toRem(3px);
    font-size: toRem(56px);
    font-weight: 600;
    line-height: 1.2;
  }

  &__subtitle {
    margin-top: 0;
    margin-bottom: toRem(32px);
    font-size: toRem(28px);
    font-weight: 400;
    line-height: 1.2;
  }

  &__desc {
    margin-top: 0;
    margin-bottom: toRem(35px);
    font-size: toRem(18px);
    line-height: 1.55;

    a {
      @include link;
    }
  }

  &__btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    padding-left: toRem(22px);
    padding-right: toRem(22px);
    width: 100%;
    max-width: toRem(240px);
    color: #fff;
    background-color: var(--primary);
    border-color: 1px solid var(--primary);
    border-radius: toRem(100px);
    height: toRem(52px);
    font-size: toRem(18px);
    line-height: normal;
    text-decoration: none;
    transition: var(--default-transition);

    &:hover {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);

      & > svg {
        transform: translateX(5px);
      }
    }

    &:active {
      background-color: var(--primary-active);
      border-color: var(--primary-active);
    }

    &:focus {
      box-shadow: 0 0 0 0.125rem var(--primary-focus);
    }

    & > svg {
      width: toRem(18px);
      height: toRem(9px);
      fill: #fff;
      transition: var(--default-transition);
    }
  }
}
</style>
