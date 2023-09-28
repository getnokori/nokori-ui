import { onMounted, onUnmounted } from 'vue'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import type { Ref } from 'vue'

export default function useBodyScrollLock(ref: Ref) {
  onMounted(() => disableBodyScroll(ref.value))
  onUnmounted(() => {
    const openedModalInstances = document.querySelectorAll('.js-modal')

    // Enable body scroll if we have only the current modal instance opened
    if (openedModalInstances.length === 1) {
      // enableBodyScroll(ref.value)
      clearAllBodyScrollLocks()
    }
  })
}
