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
            @update:checked-state="handleFieldChange"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableField
            v-model="item.key"
            :model-field-type="'key'"
            :placeholder="item.key ? item.key : 'Key'"
            :field-id="item.id"
            @update:field-value="handleFieldChange"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableField
            v-model="item.value"
            :model-field-type="'value'"
            :field-id="item.id"
            :placeholder="item.value ? item.value : 'Value'"
            @update:field-value="handleFieldChange"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableField
            v-model="item.description"
            :model-field-type="'value'"
            :field-id="item.id"
            maxlength="100"
            :placeholder="item.description ? item.description : 'Description'"
            @update:field-value="handleFieldChange"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableRemoveButton
            @click="removeQueryParamsItem(item.key)"
          >
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
import type { QueryConfigQueryParamsItem } from '@/types/hubs/Query.interface'
import type QueryDetailsTabQueryParamsState from '@/types/components/hubs/query-details/QueryDetailsTabContextState.interface'

const queryDetailsStore = useQueryDetailsStore()
const { queryParams, checkedQueryParams } = storeToRefs(queryDetailsStore)
const { addQueryParamsItem, updateQueryParamsItem, removeQueryParamsItem } =
  queryDetailsStore

const state: QueryDetailsTabQueryParamsState = reactive({
  placeholder: {
    id: nanoid(),
    checked: false,
    key: '',
    value: '',
    description: '',
    placeholder: true
  }
})

const computedItems = computed(() => [...queryParams.value, state.placeholder])

function handleFieldChange(event: any) {
  const index = computedItems.value.findIndex((item) => item.id === event.id)
  if (index > -1) {
    updateQueryParamsItem(event.id, computedItems.value[index])
  }
}

watch(
  () => state.placeholder,
  (newPlaceholder) => {
    if (
      newPlaceholder.key ||
      newPlaceholder.value ||
      newPlaceholder.description
    ) {
      addQueryParamsItem(newPlaceholder)
      resetPlaceholder()
    }
  },
  { deep: true }
)

function validateItemKeyName(itemToValidate: QueryConfigQueryParamsItem) {
  if (!itemToValidate.checked) return false

  const index = checkedQueryParams.value.findIndex(
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
