<template>
  <BaseModal :title="title" :width="470" @close="$emit('close')">
    <div class="base-seletion-modal">
      <div class="base-seletion-modal__icon">
        <IconTrashCanRegular />
      </div>

      <p class="base-seletion-modal__text">
        {{ text }}
      </p>

      <div class="base-seletion-modal__actions">
        <BaseButton btn-style="secondary" outlined @click="$emit('close')">
          Cancel
        </BaseButton>

        <BaseButton
          btn-style="danger"
          :is-loading="isLoading"
          @click="$emit('delete')"
        >
          Delete
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text: string
  isLoading: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'delete'): void
}>()
</script>

<style scoped lang="scss">
.base-seletion-modal {
  text-align: left;
  width: toRem(400px);

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: toRem(15px);
    // margin-left: auto;
    margin-right: auto;
    width: toRem(60px);
    height: toRem(60px);
    background-color: hsl(4 74% 49% / 0.5);
    background-clip: content-box;
    border: toRem(9px) solid hsl(4 74% 49% / 0.34);
    border-radius: 50%;

    & > svg {
      width: toRem(17px);
      height: toRem(20px);
      fill: #fff;
    }
  }

  &__text {
    margin-top: 0;
    margin-bottom: toRem(30px);
    font-size: toRem(18px);
    line-height: 1.5;
  }

  &__actions {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - toRem(15px) / 2));
    gap: toRem(15px);
  }
}
</style>
