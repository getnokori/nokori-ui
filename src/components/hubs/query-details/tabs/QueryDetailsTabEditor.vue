<template>
  <div class="editor">
    <!-- <div class="editor__actions">
      <div class="editor__selector">
        <BaseCustomSelect
          :data="[
            { label: 'PDO', value: 'pdo' },
            { label: 'Mustache', value: 'mustache' }
          ]"
          size="xs"
          placeholder="Merge Type"
          @change="handleMergeChange"
        />
      </div>

      <button
        class="editor__prettier-btn"
        type="button"
        @click="handlePretifying"
      >
        <IconWandMagicSparkles />
      </button>
    </div> -->

    <div class="editor__container">
      <Codemirror
        v-model="query"
        :extensions="extensions"
        @ready="(payload: any) => (view = payload.view)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { sql, MySQL, PostgreSQL, MariaSQL } from '@codemirror/lang-sql'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import useQueryDetailsStore from '@/stores/query-details.store'
import SourceEngines from '@/enums/sources/SourceEngines.enum'
// import prettier from 'prettier/esm/standalone'
// import prettierParserBabel from 'prettier/esm/parser-babel'
// import { format as SQLFormatter } from 'sql-formatter'

const props = defineProps<{
  query: string
}>()

const emit = defineEmits<{
  (e: 'update:query', value: string): void
}>()

const queryDetailsStore = useQueryDetailsStore()
const { selectedSource } = storeToRefs(queryDetailsStore)

const SQLDialect = computed(() => {
  switch (selectedSource.value?.engine) {
    case SourceEngines.MYSQL:
      return MySQL

    case SourceEngines.MARIADB:
      return MariaSQL

    case SourceEngines.POSTGRES:
      return PostgreSQL

    default:
      return undefined
  }
})

const view = shallowRef()

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

const extensions = [
  customKeymapExtension, // Should go before basicSetup
  basicSetup,
  sql({ dialect: SQLDialect.value, upperCaseKeywords: true }),
  javascript(),
  themeExtension,
  oneDark,
  EditorView.lineWrapping
]

const query = computed({
  get() {
    return props.query
  },
  set(value) {
    emit('update:query', value)
  }
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
