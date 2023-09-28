<template>
  <BaseModal :title="title" @close="$emit('close')">
    <div class="confirmation-modal">
      <p class="confirmation-modal__desc">
        {{ description }}
      </p>

      <form class="confirmation-modal__form" @submit.prevent="handleSubmit">
        <div class="confirmation-modal__field">
          <BaseField
            id="confirmation-field"
            v-model="state.confirmation"
            :class="state.isValidationError && 'js-error'"
            :placeholder="`Type ‘${keyword}’ to confirm`"
            autocomplete="off"
          />
        </div>

        <div class="confirmation-modal__actions">
          <div class="confirmation-modal__btn confirmation-modal__btn--cancel">
            <BaseButton
              btn-style="secondary"
              outlined
              type="button"
              @click="$emit('close')"
            >
              Cancel
            </BaseButton>
          </div>

          <div class="confirmation-modal__btn confirmation-modal__btn--submit">
            <BaseButton btn-style="danger" type="submit">
              {{ btnLabel }}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  title: string
  description: string
  keyword: string
  btnLabel: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirmed'): void
}>()

const state = reactive({
  confirmation: '',
  isValidationError: false
})

watch(
  () => state.confirmation,
  () => {
    state.isValidationError = false
  }
)

function handleSubmit() {
  if (state.confirmation === props.keyword) {
    emit('confirmed')
  } else {
    state.isValidationError = true
  }
}
</script>

<style scoped lang="scss">
.confirmation-modal {
  &__desc {
    margin-top: 0;
    margin-bottom: toRem(20px);
    color: #dfe5ed;
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.5;
    text-align: center;
  }

  &__form {
    margin-left: auto;
    margin-right: auto;
    max-width: toRem(300px);
  }

  &__field {
    margin-bottom: toRem(15px);
  }

  &__actions {
    display: flex;
  }

  &__btn {
    &--cancel {
      flex-shrink: 0;
      margin-right: toRem(10px);
      width: 100%;
      max-width: toRem(100px);
    }

    &--submit {
      flex-grow: 1;
    }

    &:deep(.base-btn) {
      width: 100%;
    }
  }
}
</style>
