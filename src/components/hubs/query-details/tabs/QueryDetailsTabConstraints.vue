<template>
  <template v-if="!checkedContext.length">
    <QueryDetailsMessage>
      <p>You don't have any context keys.</p>
    </QueryDetailsMessage>
  </template>

  <QueryDetailsTable v-else>
    <template #head>
      <QueryDetailsTableRow>
        <QueryDetailsTableHeader />
        <QueryDetailsTableHeader label="Key">
          <QueryDetailsTableInfoIcon content="Tooltip" />
        </QueryDetailsTableHeader>
        <QueryDetailsTableHeader label="Condition" />
        <QueryDetailsTableHeader label="Value">
          <QueryDetailsTableInfoIcon content="Tooltip" />
        </QueryDetailsTableHeader>
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
          <QueryDetailsTableSelect
            v-model="item.key"
            :placeholder="item.placeholder ? 'Key' : ''"
          >
            <option
              v-for="contextItem in checkedContext"
              :key="contextItem.id"
              :value="contextItem.key"
            >
              {{ contextItem.key }}
            </option>
          </QueryDetailsTableSelect>
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableSelect
            v-model="item.operator"
            :placeholder="item.placeholder ? 'Condition' : ''"
          >
            <option
              v-for="condition in QueryDetailsConstraintsService"
              :key="condition.operator"
              :value="condition.operator"
            >
              {{ condition.label }}
            </option>
          </QueryDetailsTableSelect>
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableField
            v-model="item.value"
            :placeholder="item.value ? item.value : 'Value'"
            :disabled="isValueFieldDisabled(item)"
          />
        </QueryDetailsTableCell>

        <QueryDetailsTableCell>
          <QueryDetailsTableRemoveButton
            @click="removeConstraintsItem(item.id)"
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
import QueryDetailsConstraintsService from '@/services/query-details/QueryDetailsConstraints.service'
import type { QueryConfigConstraintsItem } from '@/types/hubs/Query.interface'
import type QueryDetailsTabConstraintsState from '@/types/components/hubs/query-details/QueryDetailsTabConstraintsState.interface'

const queryDetailsStore = useQueryDetailsStore()
const { checkedContext, constraints } = storeToRefs(queryDetailsStore)
const { addConstraintsItem, removeConstraintsItem } = queryDetailsStore

const state: QueryDetailsTabConstraintsState = reactive({
  placeholder: {
    id: nanoid(),
    checked: false,
    key: '',
    operator: '',
    value: '',
    placeholder: true
  }
})

const computedItems = computed(() => [...constraints.value, state.placeholder])

watch(
  () => state.placeholder,
  (newPlaceholder) => {
    if (newPlaceholder.key || newPlaceholder.operator || newPlaceholder.value) {
      addConstraintsItem(newPlaceholder)
      resetPlaceholder()
    }
  },
  { deep: true }
)

function resetPlaceholder() {
  state.placeholder = {
    id: nanoid(),
    checked: false,
    key: '',
    operator: '',
    value: '',
    placeholder: true
  }
}

function isValueFieldDisabled(item: QueryConfigConstraintsItem) {
  if (item.operator) {
    const condition = QueryDetailsConstraintsService.find(
      (condition) => item.operator === condition.operator
    )
    const valueFieldMetadata = condition?.fields?.find(
      (metaItem) => metaItem.name === 'value'
    )

    return !!valueFieldMetadata?.disabled
  }
}
</script>
