<template>
  <span class="dirty-indicator"></span>
</template>

<style scoped lang="scss">
.dirty-indicator {
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: toRem(8px);
    transform: translateY(-50%);
    width: toRem(8px);
    height: toRem(8px);
    background-color: hsl(0 0% 100% / 1);
    border-radius: 50%;
  }
}
</style>
