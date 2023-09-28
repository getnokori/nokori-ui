<template>
  <header class="sign-header">
    <BaseContainer class="container" fluid>
      <div class="logo">
        <img :src="logoUrl" class="logo" alt="nokori" />
      </div>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logo-icon.png'
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  height: var(--sign-header-height);
}

.logo {
  flex: 1 0 auto;
  width: toRem(38px);
}
</style>
