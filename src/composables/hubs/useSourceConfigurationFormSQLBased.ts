import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useHubsStore from '@/stores/hubs.store'
import SourceService from '@/services/sources.service'
import SourcesDefaultPorts from '@/enums/sources/SourcesDefaultPorts.enum'
import type Source from '@/types/hubs/Source.interface'
import type SourceEngines from '@/enums/sources/SourceEngines.enum'
import type SourceConfigurationFlyoutFormMySQLState from '@/types/components/flyouts/SourceConfigurationFlyoutFormMySQLState.interface'

export default function useSourceConfigurationFormSQLBased(
  props: {
    engine: SourceEngines
    hubId: string
    isEditMode: boolean
    source: Source | null
  },
  emit: {
    (e: 'close'): void
    (e: 'closeAll'): void
  }
) {
  const hubsStore = useHubsStore()
  const { sources } = storeToRefs(hubsStore)
  const { addSource, updateSourceNode } = hubsStore

  const state: SourceConfigurationFlyoutFormMySQLState = reactive({
    formData: {
      label: '',
      host: '',
      port: 0,
      schema: '',
      user: '',
      password: ''
    },
    createMode: {
      isLoading: false,
      error: null
    },
    editMode: {
      isLoading: false,
      error: null
    },
    connectionTest: {
      isLoading: false,
      isSuccess: false,
      error: null
    }
  })

  async function testConnection() {
    state.connectionTest.error = null
    state.connectionTest.isLoading = true

    try {
      if (props.engine) {
        const { data } = await SourceService.validateSource(
          props.engine,
          state.formData.host,
          state.formData.port,
          state.formData.user,
          state.formData.password
        )

        if (data) {
          state.connectionTest.isSuccess = true
        }
      }
    } catch (error: unknown) {
      state.connectionTest.error = error as Error
    } finally {
      state.connectionTest.isLoading = false
    }
  }

  function toggleSuccessModal() {
    state.connectionTest.isSuccess = !state.connectionTest.isSuccess
  }

  function closeErrorModal() {
    state.connectionTest.error = null
  }

  function handleSubmit() {
    if (!props.isEditMode) {
      createSource()
    } else {
      updateSource()
    }
  }

  async function createSource() {
    state.createMode.error = null
    state.createMode.isLoading = true

    try {
      if (sources.value.sourceTypeToCreate) {
        const { data } = await SourceService.createSource(
          props.hubId,
          sources.value.hubSourcesNodeId,
          state.formData.label,
          sources.value.sourceTypeToCreate.engine,
          state.formData.host,
          state.formData.port,
          state.formData.schema,
          state.formData.user,
          state.formData.password
        )

        addSource(props.hubId, data)

        emit('closeAll')
      }
    } catch (error: unknown) {
      // TODO: add Toast with an error
      state.createMode.error = error as Error
    } finally {
      state.createMode.isLoading = false
    }
  }

  async function updateSource() {
    state.editMode.error = null
    state.editMode.isLoading = true

    try {
      if (sources.value.sourceNodeToEdit?.nodeId) {
        const { data } = await SourceService.updateSource(
          sources.value.sourceNodeToEdit?.nodeId,
          state.formData.label,
          state.formData.host,
          state.formData.port,
          state.formData.schema,
          state.formData.user,
          state.formData.password
        )

        updateSourceNode(data)

        emit('close')
      }
    } catch (error: unknown) {
      // TODO: add Toast with an error
      state.editMode.error = error as Error
    } finally {
      state.editMode.isLoading = false
    }
  }

  if (!props.isEditMode) {
    state.formData.port =
      SourcesDefaultPorts[
        sources.value.sourceTypeToCreate?.engine.toUpperCase() as keyof typeof SourcesDefaultPorts
      ]
  } else {
    if (props.source) {
      /* eslint-disable vue/no-setup-props-destructure */
      state.formData.label = props.source.label
      state.formData.host = props.source.connectionSettings.host
      state.formData.port = props.source.connectionSettings.port
      state.formData.schema = props.source.connectionSettings.database
      state.formData.user = props.source.connectionSettings.user
      state.formData.password = props.source.connectionSettings.password
    }
  }

  return {
    state,
    testConnection,
    toggleSuccessModal,
    closeErrorModal,
    handleSubmit
  }
}
