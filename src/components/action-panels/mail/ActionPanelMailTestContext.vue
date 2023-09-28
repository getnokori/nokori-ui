<template>
  <ActionPanelBase :open="state.open" :is-loading="state.isSaving">
    <FullScreenLoader v-if="state.isLoading" :full-screen="false" />
    <div>
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-zinc-50">
          Test Email Context
        </h3>
        <div class="mt-2 max-w-xl text-sm text-zinc-300">
          <p>
            Provide context in JSON format that will be used when you test this
            email template.
          </p>
        </div>
        <form class="mt-5 sm:flex sm:items-center">
          <div class="w-full">
            <Codemirror
              v-model="state.json"
              class="rounded-lg"
              :extensions="extensions"
              @ready="handleReady"
            />
          </div>
        </form>
        <div
          v-if="state.hasError"
          class="mt-3 rounded-md py-2 px-3 bg-rose-500/50 text-white text-sm tracking-normal"
        >
          Error, invalid JSON.
        </div>
        <div
          class="mt-4 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
        >
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            @click.stop="handleSaveContext"
          >
            <span v-if="!state.isSaving" class="mx-auto">Save</span>
            <span
              v-if="state.isSaving"
              class="flex-grow flex items-center justify-center"
            >
              <IconLoadingSpinner
                class="animate-spin h-3 w-3 ml-2 text-zinc-50"
              />
            </span>
          </button>
          <button
            ref="cancelButtonRef"
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-500 hover:bg-white/20 sm:col-start-1 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="state.isSaving"
            @click="state.open = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </ActionPanelBase>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive, nextTick } from 'vue'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { json } from '@codemirror/lang-json'

const props = defineProps({
  context: {
    type: String,
    default: '{}'
  }
})

const emit = defineEmits<{
  (e: 'updateContext', value: string): void
}>()

const state = reactive({
  json: props.context,
  open: true,
  hasError: false,
  isSaving: false,
  isLoading: true
})

onMounted(() => {
  state.isLoading = false
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

const editorView = ref<EditorView | null>(null)
const extensions = computed(() => [basicSetup, json(), themeExtension, oneDark])
function handleReady(payload: any) {
  editorView.value = payload.view

  // on next tick to ensure that editor is fully initialized
  nextTick(() => {
    if (editorView.value) {
      // Get the total line count
      const lineCount = editorView.value.state.doc.lines
      // Get the next to last line. The line() method is 1-indexed
      const nextToLastLine = editorView.value.state.doc.line(lineCount - 1)
      // Get the position at the start of the next to last line
      const posStart = nextToLastLine.from
      // Calculate the position at the end of the line
      const posEnd = posStart + nextToLastLine.length
      // Set the selection to that position
      editorView.value.dispatch({
        selection: { anchor: posEnd, head: posEnd },
        scrollIntoView: true
      })
    }
  })
}

function isValidJson(str: string): { result?: boolean; error?: string } {
  try {
    JSON.parse(str)
  } catch (e: any) {
    return { error: e.toString() }
  }
  return { result: true }
}

function handleSaveContext() {
  state.hasError = false
  state.isSaving = true
  const { result, error } = isValidJson(state.json)
  if (error) {
    state.hasError = true
    return
  }
  if (result) {
    emit('updateContext', state.json)
  }
}
</script>
