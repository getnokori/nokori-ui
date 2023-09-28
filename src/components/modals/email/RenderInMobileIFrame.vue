<template>
  <div class="h-full">
    <iframe
      ref="iframe"
      :srcdoc="htmlDocument"
      frameborder="0"
      style="width: 375px; height: 812px"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, defineProps } from 'vue'
const props = defineProps({
  htmlDocument: {
    type: String,
    required: true
  }
})

const iframe = ref(null)
const aboutBlankUrl = 'about:blank'

// watch for changes to htmlDocument prop
watch(
  () => props.htmlDocument,
  (newHtml) => {
    updateIFrameContent(newHtml)
  }
)

onMounted(() => {
  updateIFrameContent(props.htmlDocument)
})

function updateIFrameContent(html: string) {
  // if (iframe.value) {
  //   const doc = iframe.value.contentWindow.document
  //   doc.open()
  //   doc.write(html)
  //   doc.close()
  // }
}
</script>

<style scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>
