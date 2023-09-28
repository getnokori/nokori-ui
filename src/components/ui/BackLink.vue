<template>
  <a class="back-link" :href="href">
    <IconLeftLong class="icon" />
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
defineProps({
  href: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
.back-link {
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: toRem(16px);
  font-weight: 500;
  line-height: 1.2;
  text-decoration: none;
  transition: var(--default-transition);

  &:hover {
    color: var(--primary);

    .icon {
      fill: var(--primary);
      transform: translateX(toEm(-4px));
    }
  }
}

.icon {
  flex-shrink: 0;
  margin-right: toEm(6px);
  width: toEm(14px);
  height: toEm(8px);
  fill: #fff;
  transition: var(--default-transition);
}
</style>
