<template>
  <SourceConfigurationFlyoutForm @submit.prevent="handleSubmit">
    <SourceConfigurationFlyoutFormSection>
      <SourceConfigurationFlyoutFormSectionRow>
        <SourceConfigurationFlyoutFormSectionField
          id="source-name"
          label="Source Name"
          description="This name is used to identify this source when building queries
              within the query editor."
        >
          <BaseField id="source-name" v-model="state.formData.label" required />
        </SourceConfigurationFlyoutFormSectionField>
      </SourceConfigurationFlyoutFormSectionRow>

      <!-- <template #sidebar>
        <SourceConfigurationFlyoutAccess />
      </template> -->
    </SourceConfigurationFlyoutFormSection>

    <SourceConfigurationFlyoutFormSection title="Connection Settings - Basic">
      <SourceConfigurationFlyoutFormSectionRow>
        <SourceConfigurationFlyoutFormSectionField
          id="source-host"
          label="Host"
        >
          <BaseField id="source-host" v-model="state.formData.host" required />
        </SourceConfigurationFlyoutFormSectionField>

        <SourceConfigurationFlyoutFormSectionField
          id="source-port"
          label="Port"
          type="port"
        >
          <div class="flyout-section__input">
            <BaseField id="source-port" v-model.number="state.formData.port" />
          </div>
        </SourceConfigurationFlyoutFormSectionField>
      </SourceConfigurationFlyoutFormSectionRow>

      <SourceConfigurationFlyoutFormSectionRow>
        <SourceConfigurationFlyoutFormSectionField
          id="source-schema"
          label="Default Schema"
        >
          <BaseField id="source-schema" v-model="state.formData.schema" />
        </SourceConfigurationFlyoutFormSectionField>
      </SourceConfigurationFlyoutFormSectionRow>

      <SourceConfigurationFlyoutFormSectionRow>
        <SourceConfigurationFlyoutFormSectionField
          id="source-username"
          label="Username"
        >
          <BaseField
            id="source-username"
            v-model="state.formData.user"
            required
          />
        </SourceConfigurationFlyoutFormSectionField>
      </SourceConfigurationFlyoutFormSectionRow>

      <SourceConfigurationFlyoutFormSectionRow>
        <SourceConfigurationFlyoutFormSectionField
          id="source-password"
          label="Password"
        >
          <BaseField
            id="source-password"
            v-model="state.formData.password"
            type="password"
            autocomplete="new-password"
            required
          />
        </SourceConfigurationFlyoutFormSectionField>
      </SourceConfigurationFlyoutFormSectionRow>
    </SourceConfigurationFlyoutFormSection>

    <template #footer>
      <BaseButton
        btn-style="text-plain"
        :is-loading="state.connectionTest.isLoading"
        type="button"
        @click="testConnection"
      >
        Test Connection
      </BaseButton>

      <template v-if="!isEditMode">
        <BaseButton :is-loading="state.createMode.isLoading" type="submit">
          Save Settings
        </BaseButton>
      </template>

      <template v-else>
        <BaseButton :is-loading="state.editMode.isLoading" type="submit">
          Update Settings
        </BaseButton>
      </template>
    </template>
  </SourceConfigurationFlyoutForm>

  <Teleport to="body">
    <Transition>
      <SuccessModal
        v-if="state.connectionTest.isSuccess"
        title="Test connection"
        subtitle="Connection verified!"
        @close="toggleSuccessModal"
      />
    </Transition>

    <Transition>
      <ConnectionErrorModal
        v-if="state.connectionTest.error"
        title="Failure"
        description="Connection attempt failed."
        :response="state.connectionTest.error.message"
        btn-label="Update Settings"
        @close="closeErrorModal"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import useSourceConfigurationFormSQLBased from '@/composables/hubs/useSourceConfigurationFormSQLBased'
import type Source from '@/types/hubs/Source.interface'
import type SourceEngines from '@/enums/sources/SourceEngines.enum'

const props = defineProps<{
  engine: SourceEngines
  hubId: string
  isEditMode: boolean
  source: Source | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'closeAll'): void
}>()

const {
  state,
  testConnection,
  toggleSuccessModal,
  closeErrorModal,
  handleSubmit
} = useSourceConfigurationFormSQLBased(props, emit)
</script>
