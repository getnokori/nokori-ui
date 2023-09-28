<template>
  <div class="node-edit-field">
    <input
      ref="fieldRef"
      v-bind="$attrs"
      class="node-edit-field__input"
      type="text"
      :value="modelValue"
      @input="handleInput"
    />
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { HubTreeNodeKey } from '@/utils/injection-keys'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'outsideClick'): void
}>()

const node = inject(HubTreeNodeKey) as HubContentsNode

const fieldRef = ref<null | HTMLInputElement>(null)

defineExpose({
  fieldRef
})

onClickOutside(fieldRef, (event: MouseEvent) => {
  // For some reason `onClickOutside` treats `Space` key pressing
  // as an outside click... `detail` is a way to detect mouse clicks only
  if (event.detail) {
    emit('outsideClick')
  }
})

onMounted(() => {
  if (node.isEditModeOn && fieldRef.value) {
    ;(fieldRef.value as HTMLInputElement).focus()
  }
})

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped lang="scss">
.node-edit-field {
  &__input {
    padding: 0;
    width: 100%;
    height: 2.1335em;
    background-color: transparent;
    border: 0;
    outline: 0;
    font-weight: 500;
    line-height: normal;
    appearance: none;
  }
}
</style>
