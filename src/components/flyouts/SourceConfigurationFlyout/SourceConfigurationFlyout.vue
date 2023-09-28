<template>
  <BaseFlyout title="Configure Source" :width="895" @close="$emit('close')">
    <div class="source-config-flyout">
      <template v-if="isEditMode && state.source.isLoading">
        <LoadingIndicator />
      </template>

      <template v-else-if="isEditMode && state.source.error">
        <div class="source-config-flyout__error">
          <BaseError>
            {{ state.source.error.message }}
          </BaseError>
        </div>
      </template>

      <template v-else>
        <SourceConfigurationFlyoutFormMySQL
          v-if="engine === SourceEngines.MYSQL"
          :engine="engine"
          :hub-id="hubId"
          :is-edit-mode="isEditMode"
          :source="state.source.data"
          @close="$emit('close')"
          @close-all="$emit('closeAll')"
        />

        <SourceConfigurationFlyoutFormMariaDB
          v-else-if="engine === SourceEngines.MARIADB"
          :engine="engine"
          :hub-id="hubId"
          :is-edit-mode="isEditMode"
          :source="state.source.data"
          @close="$emit('close')"
          @close-all="$emit('closeAll')"
        />

        <SourceConfigurationFlyoutFormPostgreSQL
          v-else-if="engine === SourceEngines.POSTGRES"
          :engine="engine"
          :hub-id="hubId"
          :is-edit-mode="isEditMode"
          :source="state.source.data"
          @close="$emit('close')"
          @close-all="$emit('closeAll')"
        />

        <SourceConfigurationFlyoutFormHTTP
          v-else-if="engine === SourceEngines.HTTP"
          :engine="engine"
          :hub-id="hubId"
          :is-edit-mode="isEditMode"
          :source="state.source.data"
          @close="$emit('close')"
          @close-all="$emit('closeAll')"
        />

        <div v-if="isEditMode" class="source-config-flyout__delete-btn">
          <BaseButton
            btn-style="danger"
            outlined
            @click="toggleDeleteSourceModal"
          >
            Delete Source
          </BaseButton>
        </div>
      </template>
    </div>
  </BaseFlyout>

  <Teleport to="body">
    <Transition>
      <BaseDeletionModal
        v-if="state.isDeleteSourceModalOpen"
        title="Delete Source?"
        text="Are you sure you want to delete this source?"
        :is-loading="state.deleting.isLoading"
        @close="toggleDeleteSourceModal"
        @delete="deleteSource"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useHubsStore from '@/stores/hubs.store'
import SourceService from '@/services/sources.service'
import SourceConfigurationFlyoutMode from '@/enums/components/flyouts/SourceConfigurationFlyoutMode'
import SourceEngines from '@/enums/sources/SourceEngines.enum'
import type SourceConfigurationFlyoutState from '@/types/components/flyouts/SourceConfigurationFlyoutState.interface'

const props = withDefaults(
  defineProps<{
    hubId: string
    mode?: SourceConfigurationFlyoutMode
  }>(),
  {
    mode: SourceConfigurationFlyoutMode.CREATE
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'closeAll'): void
}>()

const hubsStore = useHubsStore()
const { sources } = storeToRefs(hubsStore)
const { deleteSource: deleteSourceInStore } = hubsStore

const state: SourceConfigurationFlyoutState = reactive({
  source: {
    data: null,
    isLoading: false,
    error: null
  },
  deleting: {
    isLoading: false,
    error: null
  },
  isDeleteSourceModalOpen: false
})

const isEditMode = computed(
  () => props.mode === SourceConfigurationFlyoutMode.EDIT
)

const engine = computed(() => {
  if (!isEditMode.value) {
    if (!sources.value.sourceTypeToCreate) return undefined
    return sources.value.sourceTypeToCreate.engine
  } else {
    if (!sources.value.sourceNodeToEdit?.engine) return undefined
    return sources.value.sourceNodeToEdit.engine
  }
})

async function getSource() {
  state.source.error = null
  state.source.isLoading = true

  try {
    if (sources.value.sourceNodeToEdit?.nodeId) {
      const { data } = await SourceService.getSource(
        sources.value.sourceNodeToEdit?.nodeId
      )

      state.source.data = data
    }
  } catch (error: unknown) {
    // TODO: add Toast with an error
    state.source.error = error as Error
  } finally {
    state.source.isLoading = false
  }
}

async function deleteSource() {
  state.deleting.error = null
  state.deleting.isLoading = true

  try {
    if (sources.value.sourceNodeToEdit?.nodeId) {
      await SourceService.deleteSource(sources.value.sourceNodeToEdit.nodeId)
      deleteSourceInStore(props.hubId, sources.value.sourceNodeToEdit.nodeId)
      emit('close')
    }
  } catch (error: unknown) {
    // TODO: add Toast with an error
    state.deleting.error = error as Error
  } finally {
    state.deleting.isLoading = false
  }
}

function toggleDeleteSourceModal() {
  state.isDeleteSourceModalOpen = !state.isDeleteSourceModalOpen
}

if (isEditMode.value) {
  getSource()
}
</script>

<style scoped lang="scss">
.source-config-flyout {
  position: relative;

  &__error {
    padding-top: toRem(20px);
    padding-bottom: toRem(20px);
  }

  &__delete-btn {
    position: absolute;
    bottom: toRem(25px);
    left: toRem(34px);

    &:deep(.base-btn) {
      width: toRem(162px);
    }
  }
}
</style>
