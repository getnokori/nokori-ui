<template>
  <div class="source-config-form-section">
    <div v-if="title" class="source-config-form-section__header">
      <div class="source-config-form-section__title">{{ title }}</div>
    </div>

    <div class="source-config-form-section__body">
      <div class="source-config-form-section__form">
        <slot></slot>
      </div>

      <slot name="sidebar"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped lang="scss">
.source-config-form-section {
  margin-bottom: toRem(40px);
  padding-left: toRem(34px);
  padding-right: toRem(34px);

  &__header {
    margin-bottom: toRem(30px);
    padding-bottom: toRem(14px);
    border-bottom: 1px solid #2f3136;
  }

  &__title {
    color: #a8a8a8;
    font-size: toRem(15px);
    line-height: 1.2;
  }

  &__body {
    display: flex;
  }

  &__form {
    width: 100%;
    max-width: toRem(520px);
  }
}
</style>
