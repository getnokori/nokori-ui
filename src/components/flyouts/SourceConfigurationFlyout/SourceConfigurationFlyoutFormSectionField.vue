<template>
  <div
    class="source-config-form-section-field"
    :class="type && `source-config-form-section-field--${type}`"
  >
    <label class="source-config-form-section-field__label" :for="id">
      {{ label }}
    </label>

    <div class="source-config-form-section-field__input">
      <slot></slot>

      <p
        v-if="description"
        class="source-config-form-section-field__description"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  description?: string
  type?: 'port'
}>()
</script>

<style scoped lang="scss">
.source-config-form-section-field {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: toRem(20px);

  &:last-child {
    margin-right: 0;
  }

  &--port {
    max-width: toRem(120px);

    .source-config-form-section-field__label {
      width: auto;
    }
  }

  &__label {
    flex-shrink: 0;
    margin-right: toRem(12px);
    padding-top: toRem(13.5px);
    width: toRem(110px);
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    text-align: right;
    cursor: pointer;
  }

  &__input {
    width: 100%;
  }

  &__description {
    margin-top: toRem(10px);
    margin-bottom: 0;
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.4;
  }
}
</style>
