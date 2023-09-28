<template>
  <footer class="sign-footer">
    <BaseContainer class="container" fluid>
      <div class="logo">
        <img :src="logoUrl" alt="nokori" />
      </div>

      <p class="built" @mouseover="() => (isHeartHovered = true)">
        Built by a global team with
        <IconHeart v-if="!isHeartHovered" />
        <IconHeartAnimated v-else />
      </p>

      <nav class="nav">
        <ul class="nav__list">
          <li class="nav__item">
            <a class="nav__link" href="https://nokori.com/terms"
              >Privacy & Terms</a
            >
          </li>

          <li class="nav__item">
            <a class="nav__link" href="https://nokori.com/contact">Contact</a>
          </li>
        </ul>
      </nav>

      <p class="copyright">&copy; nokori</p>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import logoUrl from '@/assets/images/logo.svg'

const isHeartHovered = ref(false)
</script>

<style scoped lang="scss">
.sign-footer {
  padding-top: toRem(50px);
  padding-bottom: toRem(50px);
  width: 100%;
  font-size: toRem(17px);
  line-height: 1.2;
  text-align: center;

  @include mq($from: 768px) {
    font-size: toRem(16px);
  }

  @include mq($from: 1024px) {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.container {
  @include mq($from: 1024px) {
    display: flex;
    align-items: center;
    height: var(--sign-footer-height);
  }
}

.logo {
  margin-bottom: toRem(15px);
  margin-left: auto;
  margin-right: auto;
  width: toRem(68px);

  @include mq($from: 1024px) {
    order: 1;
    flex-shrink: 0;
    transform: translateY(-3px);
    margin-bottom: 0;
    margin-left: 0;
    margin-right: toRem(20px);
    width: toRem(68px);
  }
}

.built {
  display: flex;
  justify-content: center;
  margin-top: 0;
  margin-bottom: toRem(20px);

  @include mq($from: 1024px) {
    order: 2;
    margin-bottom: 0;
  }

  svg {
    margin-bottom: -10px;
    margin-left: toRem(3px);
    width: toRem(16px);
    height: toRem(13px);
    fill: #ff3c3c;
    margin-left: 5px;
  }
}

.copyright {
  margin-top: 0;
  margin-bottom: 0;

  @include mq($from: 1024px) {
    order: 3;
    margin-left: auto;
    margin-right: toRem(34px);
  }
}

.nav {
  margin-bottom: toRem(20px);

  @include mq($from: 1024px) {
    order: 4;
    margin-bottom: 0;
  }

  &__list {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style-type: none;

    @include mq($from: 1024px) {
      display: flex;
    }
  }

  &__item {
    margin-bottom: toRem(15px);

    &:last-child {
      margin-bottom: 0;
    }

    @include mq($from: 1024px) {
      margin-bottom: 0;
      margin-right: toRem(34px);

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__link {
    display: inline-block;
    color: #fff;
    border-bottom: 1px solid transparent;
    text-decoration: none;
    transition: var(--default-transition);

    &:hover {
      border-bottom-color: #fff;
    }
  }
}
</style>
