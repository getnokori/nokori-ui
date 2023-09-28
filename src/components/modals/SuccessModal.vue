<template>
  <BaseModal :title="title" @close="$emit('close')">
    <div class="success-modal">
      <IconCircleCheck class="success-modal__icon" />

      <div class="success-modal__title">
        {{ subtitle }}
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped lang="scss">
.success-modal {
  padding-top: toRem(25px);
  padding-bottom: toRem(25px);
  text-align: center;

  &__icon {
    margin-bottom: toRem(20px);
    width: toRem(74px);
    height: toRem(74px);
    fill: #0fc96a;
  }

  &__title {
    font-size: toRem(24px);
    line-height: 1.2;
  }
}
</style>
