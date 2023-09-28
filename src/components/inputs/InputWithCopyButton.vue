<template>
  <div class="w-full relative">
    <input
      :value="showTooltip ? 'Copied!' : inputText"
      type="text"
      :class="[
        'w-full text-xs bg-zinc-700 rounded px-2 py-3 relative h-4 border-none aria-hidden border-transparent focus:border-transparent focus:ring-0',
        showTooltip ? 'font-sans' : 'font-mono'
      ]"
      readonly
    />
    <div class="top-1 absolute right-1 cursor-pointer" @click="copyToClipboard">
      <DocumentDuplicateIcon class="w-4 h-4 text-gray-400" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline' // path to your CopyIcon component
const showTooltip = ref(false)

const props = defineProps({
  inputText: {
    type: String,
    required: true
  }
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.inputText)
    showTooltip.value = true
    setTimeout(() => {
      showTooltip.value = false
    }, 1000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>
