<template>
  <div class="base-code-viewer">
    <Codemirror
      v-model="modelValueComputed"
      :extensions="extensions"
      :disabled="true"
      @ready="(payload: any) => (view = payload.view)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps<{
  modelValue: string
  height?: number | 'auto'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const view = shallowRef()

const modelValueComputed = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const heightComputed = computed(() => {
  return props.height && typeof props.height === 'number'
    ? `${props.height / 16}rem`
    : 'auto'
})

const themeExtension = EditorView.theme({
  '&': {
    height: heightComputed.value,
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

const extensions = [
  basicSetup,
  json(),
  javascript(),
  themeExtension,
  oneDark,
  EditorView.lineWrapping
]
</script>

<style scoped lang="scss">
.base-code-viewer {
  overflow: scroll;
  background-color: #1d1e21;
  border: 1px solid #2b2c2e;
  border-radius: toRem(6px);
  max-height: 500px;
}
</style>
