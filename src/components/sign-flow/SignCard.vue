<template>
  <div class="sign-card" :class="$slots.footer && 'sign-card--with-footer'">
    <div class="header">
      <div class="header__logo">
        <img :src="logoUrl" alt="nokori" />
      </div>

      <h2 class="header__title">{{ title }}</h2>

      <p v-if="$slots.description" class="header__desc">
        <slot name="description"></slot>
      </p>
    </div>

    <div class="body">
      <p v-if="error" class="body__error">
        {{ error.message }}
      </p>

      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StripeError } from '@stripe/stripe-js'
import logoUrl from '@/assets/images/logo-icon.png'

defineProps<{
  error: Error | StripeError | null
  title: string
}>()
</script>

<style scoped lang="scss">
// All the rem values are from our `@nokori/vue`
.sign-card {
  padding: 1.8rem 1.5rem;
  width: 100%;
  max-width: 28.625rem;
  color: #fff;
  background-color: #2b2c2e;
  border: 1px solid #2b2c2e;
  border-radius: 0.9rem;
  box-shadow: 0.125rem 0.1875rem 2rem hsl(0 0% 0% / 0.5);

  &--with-footer {
    padding-bottom: 0 !important;
  }

  @media (min-width: 28.625em) {
    padding: 2.4rem 3.125rem;
  }
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;

  &__logo {
    display: block;
    margin-bottom: 1.1875rem;
    max-width: 4.4rem;

    > img {
      width: 100%;
    }
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.2;
  }

  &__desc {
    margin-top: 1.1rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
  }
}

.body {
  &__error {
    margin-top: 0;
    margin-bottom: toRem(20px);
    padding: toRem(16px);
    color: #f00;
    border: 1px solid #444;
    border-radius: toRem(6px);
    font-size: toRem(15px);
    font-weight: 400;
    line-height: 1.3;
    text-align: center;
  }
}

.footer {
  display: flex;
  justify-content: center;
  padding: 1.25rem 0;

  &:deep(*) {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
