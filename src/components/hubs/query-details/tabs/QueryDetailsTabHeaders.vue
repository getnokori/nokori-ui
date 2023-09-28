<template>
  <QueryDetailsTable>
    <template #head>
      <QueryDetailsTableRow>
        <QueryDetailsTableHeader />
        <QueryDetailsTableHeader label="Key">
          <QueryDetailsTableInfoIcon content="Tooltip" />
        </QueryDetailsTableHeader>
        <QueryDetailsTableHeader label="Value" />
        <QueryDetailsTableHeader label="Description" />
        <QueryDetailsTableHeader />
      </QueryDetailsTableRow>
    </template>

    <template #body>
      <QueryDetailsTableRow
        v-for="(item, index) in computedItems"
        :key="index"
        :placeholder="!!item.placeholder"
        :inactive="!item.placeholder && !item.checked"
      >
        <QueryDetailsTableCell>
          <QueryDetailsTableCheckbox
            v-model="item.checked"
            :field-id="item.id"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableField
            v-model="item.key"
            :placeholder="item.key ? item.key : 'Key'"
            :is-validation-error="validateItemKeyName(item)"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableField
            v-model="item.value"
            :placeholder="item.value ? item.value : 'Value'"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableField
            v-model="item.description"
            maxlength="100"
            :placeholder="item.description ? item.description : 'Description'"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableRemoveButton @click="removeHeaderItem(item.id)">
            <IconTrashCanSolid />
          </QueryDetailsTableRemoveButton>
        </QueryDetailsTableCell>
      </QueryDetailsTableRow>
    </template>
  </QueryDetailsTable>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import useQueryDetailsStore from '@/stores/query-details.store'
import type { QueryConfigHeaderItem } from '@/types/hubs/Query.interface'
import type QueryDetailsTabHeadersState from '@/types/components/hubs/query-details/QueryDetailsTabContextState.interface'

const queryDetailsStore = useQueryDetailsStore()
const { headers, checkedHeaders } = storeToRefs(queryDetailsStore)
const { addHeaderItem, removeHeaderItem } = queryDetailsStore

const state: QueryDetailsTabHeadersState = reactive({
  placeholder: {
    id: nanoid(),
    checked: false,
    key: '',
    value: '',
    description: '',
    placeholder: true
  }
})

const computedItems = computed(() => [...headers.value, state.placeholder])

watch(
  () => state.placeholder,
  (newPlaceholder) => {
    if (
      newPlaceholder.key ||
      newPlaceholder.value ||
      newPlaceholder.description
    ) {
      addHeaderItem(newPlaceholder)
      resetPlaceholder()
    }
  },
  { deep: true }
)

function validateItemKeyName(itemToValidate: QueryConfigHeaderItem) {
  if (!itemToValidate.checked) return false

  const index = checkedHeaders.value.findIndex(
    (item) => item.key === itemToValidate.key && item.id !== itemToValidate.id
  )

  return index !== -1
}

function resetPlaceholder() {
  state.placeholder = {
    id: nanoid(),
    checked: false,
    key: '',
    value: '',
    description: '',
    placeholder: true
  }
}
</script>
