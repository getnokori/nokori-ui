<template>
  <div class="editor">
    <div id="editor" class="editor__container">
      <Codemirror
        v-model="body"
        :extensions="extensions"
        @ready="(payload: any) => (editorView = payload.view)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Transaction, StateEffect } from '@codemirror/state'
import { json, jsonLanguage, jsonParseLinter } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { Text } from '@codemirror/state'
import { StreamLanguage } from '@codemirror/stream-parser'
import prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import { oneDark } from '@codemirror/theme-one-dark'
import useQueryDetailsStore from '@/stores/query-details.store'
import type BodyCodeLanguage from '@/types/query/BodyCodeLanguage'

const props = defineProps<{
  body: string
  codeLanguage: { label: string; value: BodyCodeLanguage }
}>()

const emit = defineEmits<{
  (e: 'update:body', value: string): void
}>()

// const view = shallowRef()
const editorView = ref<EditorView | null>(null)

const extensions = computed(() => [
  customKeymapExtension, // Should go before basicSetup
  basicSetup,
  getLanguageExtension(props.codeLanguage.value),
  themeExtension,
  oneDark,
  EditorView.lineWrapping
])

const themeExtension = EditorView.theme({
  '&': {
    height: '12rem',
    backgroundColor: '#1d1e21'
  },
  '.cm-scroller': {
    paddingTop: '0.5rem', // 8px
    paddingBottom: '0.5rem', // 8px
    fontFamily: `'SFMono', ui-monospace, monospace`,
    fontSize: '0.9375rem' // 15px
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

const customKeymapExtension = keymap.of([
  {
    key: 'Mod-Enter',
    run() {
      return true
    }
  }
])

function getLanguageExtension(currentLanguage: BodyCodeLanguage) {
  switch (currentLanguage) {
    case 'json':
      return json()
    case 'xml':
      return xml()
    case 'javascript':
      return javascript()
    case 'html':
      return html()
    case 'plain':
      return html()
    default:
      throw new Error(`Unsupported language: ${currentLanguage}`)
  }
}

const body = computed({
  get() {
    return props.body
  },
  set(value) {
    emit('update:body', value)
  }
})
function prettifyContent() {
  const currentView = editorView.value
  const currentLanguage = props.codeLanguage.value

  if (!currentView) {
    return
  }

  const code = currentView.state.doc.toString()
  let formattedCode = ''

  const parserMap: Record<BodyCodeLanguage, string> = {
    html: 'html',
    javascript: 'babel',
    json: 'json',
    plain: 'babel',
    xml: 'xml'
  }

  const parser = parserMap[currentLanguage]

  if (parser) {
    try {
      formattedCode = prettier.format(code, {
        parser,
        plugins: [parserBabel]
      })
    } catch (error) {
      return
    }
  } else {
    formattedCode = code // If no parser is defined for the current language, don't modify the content.
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

defineExpose({
  prettifyContent
})
</script>

<style scoped lang="scss">
.editor {
  &__container {
    overflow: hidden;
    border: 1px solid #2b2c2e;
    border-radius: toRem(6px);
  }

  &__actions {
    display: flex;
    align-items: center;
    margin-bottom: toRem(15px);
  }

  &__selector {
    margin-right: toRem(10px);
  }

  &__prettier-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: toRem(30px);
    height: toRem(30px);
    background-color: transparent;
    border: 0;
    border-radius: toRem(6px);
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #27282c;
    }

    svg {
      width: 1em;
      height: 1em;
      fill: #90939d;
      transition: var(--default-transition);
    }
  }
}
</style>
