<template>
  <div class="w-full flex overflow-auto relative">
    <FullScreenLoader v-if="state.isLoading" />
    <MailSidebar />
    <div class="w-full">
      <!-- div area -->
      <div class="pt-6 px-7 w-full">
        <div class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-5 ml-0">
          <h1 class="text-2xl font-normal tracking-normal">Mail Templates</h1>
          <div class="hidden md:flex items-center ml-auto">
            <button
              type="button"
              class="inline-flex items-center gap-x-1.5 rounded-md bg-zinc-700 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              @click="handleToggleModel('create')"
            >
              <PlusCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
              New Template
            </button>
            <Teleport to="body">
              <ModalEmailEditor
                v-if="state.modalOpen"
                :template-id="state.selectedTemplateId"
                :edit-mode="state.editMode"
                @close="handleCloseModal()"
              />
            </Teleport>
          </div>
        </div>
      </div>
      <div class="px-5 -mt-2">
        <TableMailTemplates
          :templates="state.templates"
          @row-clicked="handleClickedRow($event)"
          @open-delete-modal="handleOpenDeleteModal($event)"
        />
      </div>
    </div>
    <!-- Delete Template Modal -->
    <Teleport to="body">
      <ModalPromptRedConfirmCancel
        v-if="state.cancelDialogOpen"
        title="Delete Template"
        message="Are you sure you want to delete this template? This action is permanent and cannot be undone."
        button-text="Delete Template"
        @did-confirm="handleDeleteTemplate"
      />
    </Teleport>
    <!-- /Delete Template Modal -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PlusCircleIcon } from '@heroicons/vue/20/solid'
import type { EmailTemplatesAllDTO } from '@/types/mail/Templates.type'
import MailService from '@/services/mail/mail.service'
import RouteNames from '@/enums/RouteNames.enum'

const router = useRouter()

const props = defineProps({
  templateId: {
    type: String,
    default: null
  }
})

const state = reactive({
  modalOpen: false,
  defaultTemplate: null,
  templates: [] as EmailTemplatesAllDTO[],
  selectedTemplateId: null as string | null,
  editMode: false,
  cancelDialogOpen: false,
  templateToDelete: null as string | null,
  isLoading: true
})

watch(
  () => props.templateId,
  (newVal) => {
    if (newVal) {
      state.selectedTemplateId = newVal
      state.editMode = true
      state.modalOpen = true
    }
  },
  {
    immediate: true
  }
)

const handleToggleModel = (mode = 'edit') => {
  state.modalOpen = !state.modalOpen

  if (mode === 'create') {
    state.defaultTemplate = null
    state.editMode = false
  } else {
    state.selectedTemplateId = null
    router.replace({
      name: RouteNames.MAIL_TEMPLATES
    })
  }
}

function handleCloseModal() {
  state.modalOpen = false
  state.selectedTemplateId = null
  router.replace({
    name: RouteNames.MAIL_TEMPLATES
  })

  fetchMailTemplates()
}

function handleOpenDeleteModal(templateId: any) {
  state.templateToDelete = templateId
  state.cancelDialogOpen = true
}

async function handleDeleteTemplate() {
  if (!state.templateToDelete) return null

  const didDelete = await MailService.deleteTemplate(state.templateToDelete)
  if (didDelete.data) {
    state.templateToDelete = null
    state.cancelDialogOpen = false

    fetchMailTemplates()
  }

  state.templateToDelete = null
  state.cancelDialogOpen = false
}

function handleClickedRow(template: EmailTemplatesAllDTO) {
  if (template.templateId) {
    state.selectedTemplateId = template.templateId
    state.modalOpen = true
    router.replace({
      name: RouteNames.MAIL_TEMPLATES,
      params: { templateId: template.templateId }
    })
  }
}

async function fetchMailTemplates() {
  try {
    const templates = await MailService.getTemplates({})
    if (templates.data) state.templates = templates.data
  } catch (error) {
    state.templates = []
  }

  state.isLoading = false
}

fetchMailTemplates()
</script>
<style>
body {
  background-color: #202125;
}
</style>
