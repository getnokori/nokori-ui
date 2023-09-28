<template>
  <BaseModal :title="title" :width="540" @close="$emit('close')">
    <div class="modal">
      <div class="modal__left-part">
        <IconCircleXmarkSolid class="modal__icon" />
        <div class="modal__title">Uh-oh.</div>
      </div>

      <div class="modal__right-part">
        <div class="modal__desc">
          {{ description }}
        </div>

        <div class="modal__response">
          {{ response }}
        </div>

        <div class="modal__btn-wrapper">
          <BaseButton class="modal__btn" @click="$emit('close')">
            <IconRotateRightSolid />
            {{ btnLabel }}
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  response: string
  btnLabel: string
  description: string
}>()

defineEmits(['close'])
</script>

<style scoped lang="scss">
.modal {
  display: grid;
  grid-template-columns: auto auto;
  gap: toRem(45px);

  &__icon {
    margin-bottom: toRem(10px);
    width: toRem(74px);
    height: toRem(74px);
    fill: #c96f0f;
  }

  &__title {
    font-size: toRem(24px);
    line-height: 1.2;
  }

  &__desc {
    margin-bottom: toRem(14px);
    font-size: toRem(16px);
    font-weight: 600;
    line-height: 1.2;
  }

  &__response {
    margin-bottom: toRem(20px);
    padding: toRem(16px);
    color: #fff;
    background-color: #36383d;
    border-radius: toRem(5px);
    font-family: var(--code-font-family);
    font-size: toRem(14px);
    line-height: 1.5;
    text-align: left;
  }

  &__btn-wrapper {
    text-align: right;
  }

  &__btn {
    svg {
      margin-right: toRem(8px);
      width: toRem(16px);
      height: toRem(16px);
    }
  }
}
</style>
