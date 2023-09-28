<template>
  <BaseModal
    title="Create new hub"
    :error="state.error"
    :width="460"
    @close="$emit('close')"
  >
    <div class="hub-creation-modal">
      <form @submit.prevent="handleSubmit">
        <div class="hub-creation-modal__field">
          <BaseField
            id="hub-label"
            v-model="state.label"
            label="Hub label"
            autocomplete="off"
            required
          />
        </div>

        <div class="hub-creation-modal__footer">
          <BaseButton
            class="hub-creation-modal__btn"
            type="submit"
            :is-loading="state.isLoading"
          >
            Create
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import HubsService from '@/services/hubs.service'

const emit = defineEmits(['created', 'close'])

interface HubCreationModalState {
  label: string
  isLoading: boolean
  error: Error | null
}

const state: HubCreationModalState = reactive({
  label: '',
  isLoading: false,
  error: null
})

async function handleSubmit() {
  state.error = null
  state.isLoading = true

  try {
    const { data } = await HubsService.createHub(state.label)

    emit('created', data)
    emit('close')
  } catch (error: unknown) {
    state.error = error as Error
  } finally {
    state.isLoading = false
  }
}
</script>

<style scoped lang="scss">
.hub-creation-modal {
  &__field {
    margin-bottom: toRem(25px);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__btn {
    min-width: toRem(120px);
  }
}
</style>
