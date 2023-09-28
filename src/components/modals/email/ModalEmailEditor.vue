<template>
  <div
    class="fixed w-full h-full top-0 left-0 items-center justify-center bg-black"
  >
    <div
      v-if="state.isLoading"
      class="fixed w-full h-full top-0 left-0 bg-black/80 z-50 items-center justify-center"
    >
      <div class="flex h-screen w-full justify-center items-center">
        <IconLoadingSpinner class="animate-spin h-6 w-6 text-white" />
      </div>
    </div>
    <div class="grid grid-cols-12 h-full relative">
      <!-- Editor -->
      <div class="col-span-9 min-w-[300px] bg-black">
        <div class="flex items-center bg-zinc-900 py-3">
          <div class="flex flex-row w-full relative">
            <div class="basis-1/3 flex justfy-start ml-4">
              <button
                v-if="state.editMode"
                type="button"
                class="bg-zinc-900 text-zinc-400 group hover:bg-zinc-800 hover:text-zinc-300 relative inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold"
                @click.stop="state.contextModalOpen = true"
              >
                <IconBracketsCurlySolid
                  class="fill-zinc-400 group-hover:fill-zinc-300 mr-1 w-4 h-4"
                />
                Test Context
              </button>
              <Teleport to="body">
                <ActionPanelMailTestContext
                  v-if="state.contextModalOpen"
                  :context="state.context"
                  @after-leave="state.contextModalOpen = false"
                  @update-context="updateContext"
                />
              </Teleport>
            </div>
            <div class="basis-1/3 flex justify-center">
              <span class="isolate inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  :class="[
                    state.viewMode === 'code'
                      ? 'bg-zinc-200 text-gray-900 ring-zinc-300 hover:bg-gray-50 focus:z-10'
                      : 'text-gray-500 bg-[#202125] ring-zinc-600 hover:bg-zinc-700 hover:text-zinc-300',
                    'relative inline-flex items-center rounded-l-md px-3 py-1 text-sm font-semibold ring-1 ring-inset r'
                  ]"
                  @click="toggleCodeView('code')"
                >
                  <CodeBracketSquareIcon class="mr-1 w-4 h-4" />
                  Code
                </button>
                <button
                  type="button"
                  :class="[
                    state.viewMode === 'split'
                      ? 'bg-zinc-200 text-gray-900 ring-zinc-300 hover:bg-gray-50 focus:z-10'
                      : 'text-gray-500 bg-[#202125] ring-zinc-600 hover:bg-zinc-700 hover:text-zinc-300',
                    'relative -ml-px inline-flex items-center  px-3 py-1 text-sm font-semibold  ring-1 ring-inset  focus:z-10'
                  ]"
                  @click="toggleCodeView('split')"
                >
                  <IconSplitView class="fill-zinc-500 mr-1 w-4 h-4" />
                  Split View
                </button>
                <button
                  type="button"
                  :class="[
                    state.viewMode === 'preview'
                      ? 'bg-zinc-200 text-gray-900 ring-zinc-300 hover:bg-gray-50 focus:z-10'
                      : 'text-gray-500 bg-[#202125] ring-zinc-600 hover:bg-zinc-700 hover:text-zinc-300',
                    'relative -ml-px inline-flex items-center rounded-r-md  px-3 py-1 text-sm font-semibold  ring-1 ring-inset  focus:z-10'
                  ]"
                  @click="toggleCodeView('preview')"
                >
                  <ComputerDesktopIcon class="mr-2 w-4 h-4" />
                  Desktop
                </button>
              </span>
            </div>
            <div class="basis-1/3 flex justify-end ml-auto mr-4 w-4">
              <div v-if="state.editMode">
                <button
                  type="button"
                  class="bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-zinc-300 relative inline-flex items-center rounded-md px-3 py-1 text-sm font-semibold"
                  @click.stop="state.sendTestModalOpen = true"
                >
                  <PaperAirplaneIcon class="mr-2 w-4 h-4" />
                  Send Test
                </button>
              </div>
              <Teleport to="body">
                <ActionPanelMailSendTest
                  v-if="state.sendTestModalOpen"
                  @after-leave="state.sendTestModalOpen = false"
                  @send-test-email="handleSendTestEmail"
                />
              </Teleport>
            </div>
          </div>
        </div>
        <div class="flex bg-white relative h-full">
          <div
            v-if="state.viewMode === 'code'"
            class="col-span-5 bg-black h-full w-full flex-none overflow-y-auto"
            style="max-height: calc(100vh - 2rem)"
          >
            <Codemirror
              v-model="state.htmlBody"
              :extensions="extensions"
              class="h-full"
              @ready="(payload: any) => (editorView = payload.view)"
            />
          </div>
          <div
            v-if="state.viewMode === 'split'"
            class="grid grid-cols-12 bg-green-50 h-full overflow-y-auto"
          >
            <div class="col-span-6 bg-black flex-none overflow-y-auto h-screen">
              <Codemirror
                v-model="state.htmlBody"
                :extensions="extensions"
                @ready="(payload: any) => (editorView = payload.view)"
              />
            </div>
            <div class="col-span-6 flex-none h-full">
              <RenderInIFrame :html-document="state.htmlBody" />
            </div>
          </div>
          <div
            v-if="state.viewMode === 'preview'"
            class="col-span-5 flex-none h-full w-full"
          >
            <RenderInIFrame :html-document="state.htmlBody" />
          </div>
        </div>
      </div>
      <!-- /Editor -->

      <!-- Sidebar Begin -->
      <div class="bg-[#202125] p-6 flex-none col-span-3">
        <div
          class="flex items-center justify-between pb-4 border-b-[1px] border-zinc-600"
        >
          <div class="flex flex-col items-start">
            <H2 class="flex text-xl font-regular leading-4 text-gray-200"
              >Template Editor</H2
            >

            <div class="flex font-mono text-gray-400 text-xs pt-0.5">
              {{ state.templateId }}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <div
            v-if="state.error"
            class="bg-rose-500/40 rounded-md px-4 py-2 mb-4 text-sm"
          >
            Error: {{ state.error }}
          </div>
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-100"
              >Template Name</label
            >
            <div class="mt-1">
              <input
                id="templateName"
                v-model="state.templateName"
                type="text"
                name="templateName"
                class="bg-[#202125] bg-white/5 block w-full rounded-md border-0 px-2 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-500 focus:ring-1 focus:ring-inset focus:ring-gray-400 sm:text-15 sm:leading-6"
                placeholder="E.g., Order Confirmation"
                required
              />
            </div>
          </div>

          <div class="mt-5">
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-100"
              >Email Subject</label
            >
            <div class="mt-1">
              <input
                id="templateName"
                v-model="state.subject"
                type="text"
                name="templateName"
                class="bg-[#202125] bg-white/5 block w-full rounded-md border-0 px-2 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-500 focus:ring-1 focus:ring-inset focus:ring-gray-400 sm:text-15 sm:leading-6"
                placeholder="E.g., {{ orderNumber }} has shipped!"
                required
              />
            </div>
          </div>
        </div>

        <div
          class="hidden md:flex items-center ml-auto mt-6 pt-6 border-t-[1px] border-zinc-600"
        >
          <span
            class="text-sm ml-auto mr-4 text-gray-300 hover:text-gray-400 cursor-pointer font-medium"
            @click="$emit('close')"
            >Close</span
          >
          <button
            v-if="state.editMode"
            type="button"
            class="inline-flex disabled:bg-zinc-700 disabled:text-zinc-400 transition-colors items-center gap-x-1.5 rounded-md bg-blue-600 px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 group"
            :disabled="!state.isDirty || state.save.isSaving"
            @click="handleUpdateTemplate()"
          >
            <IconFloppyDisk
              v-if="!state.save.isSaving"
              :class="[
                state.isDirty
                  ? 'text-gray-50 fill-gray-50'
                  : 'text-gray-400 fill-gray-400',
                'w-4 h-4  group-hover:text-gray-100 transition-colors group-hover:fill-gray-100'
              ]"
            />
            <IconLoadingSpinner
              v-if="state.save.isSaving"
              class="animate-spin h-3 w-3 mr-0 text-zinc-50"
            />
            Save
          </button>
          <button
            v-if="!state.editMode"
            type="button"
            class="inline-flex disabled:bg-zinc-700 disabled:text-zinc-400 items-center gap-x-1.5 rounded-md bg-blue-600 px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 group"
            :disabled="!state.save.canSave || state.save.isSaving"
            @click="handleCreateTemplate()"
          >
            <IconFloppyDisk
              v-if="!state.save.isSaving"
              :class="[
                state.isDirty
                  ? 'text-gray-50 fill-gray-50'
                  : 'text-gray-400 fill-gray-400',
                'w-4 h-4  group-hover:text-gray-100 transition-colors group-hover:fill-gray-100'
              ]"
            />
            <IconLoadingSpinner
              v-if="state.save.isSaving"
              class="animate-spin h-3 w-3 mr-0 text-white"
            />
            Create Template
          </button>
        </div>
      </div>
    </div>
    <!-- top -->
    <!-- <div
      class="flex items-center w-full bg-[#202125] py-[1.575rem] h-6 border-b-[1px] border-zinc-600"
    >
      <div class="hidden md:flex items-center ml-auto mr-4">
        <span
          class="text-sm mr-4 text-gray-300 hover:text-gray-400 cursor-pointer font-medium"
          @click="$emit('close')"
          >Close</span
        >
        <button
          type="button"
          class="inline-flex disabled:opacity-50 items-center gap-x-1.5 rounded-md bg-zinc-700 px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 group"
          :disabled="!state.isDirty"
          @click="handleCreateTemplate()"
        >
          <IconFloppyDisk
            class="w-4 h-4 fill-gray-400 text-gray-400 group-hover:text-gray-100 group-hover:fill-gray-100"
          />
          Save & Close
        </button>
      </div>
    </div> -->
    <!-- /top -->

    <!-- <div class="grid grid-cols-12 bg-green-50 h-full">
      <div class="col-span-5 bg-black flex-none">
        <Codemirror
          v-model="state.htmlBody"
          :extensions="extensions"
          @ready="(payload: any) => (editorView = payload.view)"
        />
      </div>
      <div class="col-span-5 flex-none h-full">
        <RenderInIFrame :html-document="state.htmlBody" />
      </div>

      <div class="col-span-2 flex-none h-full bg-[#202125] p-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-100"
            >Template Name</label
          >
          <div class="mt-1">
            <input
              id="templateName"
              v-model="state.templateName"
              type="text"
              name="templateName"
              class="bg-[#202125] block w-full rounded-md border-0 px-2 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-500 focus:ring-1 focus:ring-inset focus:ring-gray-400 sm:text-15 sm:leading-6"
              placeholder="E.g., Order Confirmation"
              required
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-100 mt-4"
            >Description</label
          >
          <div class="mt-1">
            <textarea
              id="templateDesc"
              v-model="state.templateDescription"
              type="textarea"
              name="templateDesc"
              rows="3"
              class="bg-[#202125] block w-full rounded-md border-0 px-2 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset focus:ring-gray-400 sm:text-15 sm:leading-6"
              placeholder="Notifies a customer when..."
            />
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  ref,
  reactive,
  onMounted,
  watch,
  watchEffect,
  toRaw
} from 'vue'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { html } from '@codemirror/lang-html'
import prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import DefaultExampleEmail from '@/fixtures/emails/DefaultEmail'
import { slugify } from '@/utils/strings'
import { CodeBracketSquareIcon } from '@heroicons/vue/24/outline'
import { ComputerDesktopIcon, PaperAirplaneIcon } from '@heroicons/vue/20/solid'
import MailService from '@/services/mail/mail.service'
import type SendMailRequestDTO from '@/types/mail/SendMail.type'

const initialHtmlBody = ref('')

const props = withDefaults(
  defineProps<{
    templateId: string | null
    editMode: boolean
  }>(),
  {
    editMode: false
  }
)

const state = reactive({
  htmlBody: undefined as string | undefined,
  templateName: '',
  templateId: null as string | null,
  subject: '',
  context: '',
  contextModalOpen: false,
  sendTestModalOpen: false,
  error: null as string | null,
  stateLoaded: false,
  isDirty: false,
  isVertical: false,
  codeViewActive: true,
  splitViewActive: false,
  isLoading: true,
  editMode: props.editMode,
  viewMode: 'code' as 'code' | 'split' | 'preview',
  save: {
    canSave: false,
    isSaving: false
  }
})

let initialState = {} as any

watch(
  state,
  (newState) => {
    newState.isDirty =
      newState.htmlBody !== initialState.htmlBody ||
      newState.templateName !== initialState.templateName ||
      newState.subject !== initialState.subject ||
      newState.context !== initialState.context
  },
  { deep: true }
)

watch(
  () => state.htmlBody,
  (newValue) => {
    if (state.stateLoaded && newValue !== initialHtmlBody.value) {
      state.isDirty = true
    }
    if (state.stateLoaded && newValue === initialHtmlBody.value) {
      state.isDirty = false
    }

    if (!state.stateLoaded && state.htmlBody) {
      initialHtmlBody.value = state.htmlBody
    }

    if (!state.stateLoaded) {
      initialState = { ...state }
    }

    state.stateLoaded = true
  },
  {
    immediate: false
  }
)

watch(
  () => state.templateName,
  (newValue) => {
    if (newValue && !state.editMode) {
      state.templateId = slugify(newValue)
    }

    if (newValue && newValue !== '') {
      if (state.subject && state.subject !== '') {
        state.save.canSave = true
      }
    } else {
      state.save.canSave = false
    }
  }
)

watch(
  () => state.subject,
  (newValue) => {
    if (newValue && newValue !== '') {
      if (state.templateName && state.templateName !== '') {
        state.save.canSave = true
      }
    } else {
      state.save.canSave = false
    }
  }
)

watchEffect(() => {
  state.templateId = props.templateId
  state.editMode = props.editMode
})

function toggleCodeView(view: 'code' | 'split' | 'preview') {
  state.viewMode = view
}

const editorView = ref<EditorView | null>(null)
const extensions = computed(() => [basicSetup, html(), themeExtension, oneDark])

const emit = defineEmits<{
  (e: 'close'): void
}>()

onMounted(() => {
  if (!state.htmlBody) {
    state.htmlBody = DefaultExampleEmail
  }

  prettifyContent()
})

const themeExtension = EditorView.theme({
  '&': {
    height: '100%',
    backgroundColor: '#000000'
  },
  '.cm-scroller': {
    paddingTop: '0.5rem', // 8px
    paddingBottom: '0.5rem', // 8px
    fontFamily: `'SFMono', ui-monospace, monospace`,
    fontSize: '0.8375rem' // 15px
  },
  '.cm-gutters': {
    backgroundColor: 'transparent'
  },
  '.cm-gutterElement': {
    backgroundColor: 'transparent'
  },
  '.cm-gutterElement span[title="Fold line"]': {
    display: 'block',
    transform: 'translateY(-3px)'
  },
  '.cm-activeLine': {
    backgroundColor: 'transparent'
  }
})

async function handleUpdateTemplate(shouldClose = false) {
  state.save.isSaving = true
  state.error = null

  if (!state.templateId) {
    state.error = 'Template Name is required'
    state.save.isSaving = false
    return
  }

  const updateRequest = {
    templateName: state.templateName,
    subject: state.subject,
    template: state.htmlBody,
    context: state.context ? JSON.stringify(state.context) : null
  }

  try {
    const updateTemplateRequest = await MailService.updateTemplate(
      state.templateId,
      updateRequest
    )
    if (updateTemplateRequest.data) {
      if (shouldClose) emit('close')

      initialState = toRaw({ ...state })

      state.save.isSaving = false
    }
  } catch (error: any) {
    state.error = error.message
    state.save.isSaving = false
  }
}

async function handleCreateTemplate() {
  state.save.isSaving = true
  state.error = null

  if (!state.templateId) {
    state.error = 'Template Name is required'
    state.save.isSaving = false
    return
  }

  if (!state.htmlBody) {
    state.error = 'Template HTML must not be empty.'
    state.save.isSaving = false
    return
  }

  const createRequest: {
    templateId: string
    templateName: string
    subject: string
    template: string
    context?: string | null
  } = {
    templateId: state.templateId,
    templateName: state.templateName,
    subject: state.subject,
    template: state.htmlBody,
    context: state.context ? JSON.stringify(state.context) : null
  }

  try {
    const createTemplateRequest = await MailService.createTemplate(
      createRequest
    )
    if (createTemplateRequest.data) {
      state.editMode = true
      // emit('close')
    }
  } catch (error: any) {
    state.error = error.message
  }

  state.save.isSaving = false
}

function prettifyContent() {
  const currentView = editorView.value
  const currentLanguage = 'html'

  if (!currentView) {
    return
  }

  const code = currentView.state.doc.toString()
  let formattedCode = ''
  try {
    formattedCode = prettier.format(code, {
      parser: currentLanguage,
      plugins: [parserBabel]
    })
  } catch (error) {
    return
  }

  currentView.dispatch({
    changes: {
      from: 0,
      to: currentView.state.doc.length,
      insert: formattedCode
    },
    selection: { anchor: 0, head: 0 }
  })
}

async function updateContext(context: string) {
  state.context = context

  await handleUpdateTemplate(false)
  state.contextModalOpen = false
}

async function handleSendTestEmail(emailAddress: string) {
  state.error = null

  if (!state.templateId) {
    state.error = 'Template Id is required'
    state.sendTestModalOpen = false
    return
  }

  await handleUpdateTemplate(false)
  if (state.error) {
    state.sendTestModalOpen = false
    return
  }

  const sendRequest: SendMailRequestDTO = {
    test: true,
    templateId: state.templateId,
    settings: {
      to: emailAddress,
      from: 'Nokori Send Test <send-test@nokori.com>'
    }
  }

  try {
    const didSendEmail = await MailService.sendTestMail(sendRequest)
    if (didSendEmail.data) {
      state.sendTestModalOpen = false
      return
    }
  } catch (error: any) {
    state.error = error.message
  }

  state.sendTestModalOpen = false
}

async function fetchTemplate() {
  if (!state.templateId) {
    state.isLoading = false
    return
  }

  const templateRequest = await MailService.getTemplate(state.templateId)
  if (templateRequest.data) {
    const { template, templateName, subject, context } = templateRequest.data

    state.htmlBody = template
    state.subject = subject
    state.templateName = templateName
    state.context = context
    state.isDirty = false

    state.isLoading = false
    state.error = null

    initialState = toRaw({ ...state })
  }
}

fetchTemplate()
</script>
