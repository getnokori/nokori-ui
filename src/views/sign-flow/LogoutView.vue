<template>
  <div class="logout">
    <LoadingIndicator />
  </div>
</template>

<script setup lang="ts">
import useLogout from '@/composables/useLogout'

const { handleLogout } = useLogout()

handleLogout()
</script>

<style scoped lang="scss">
.logout {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: toRem(80px);
  padding-bottom: toRem(80px);
  height: 100%;
}
</style>
