import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user.store'

export default function useUserAvatar() {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const avatarUrl = computed(
    () =>
      `${import.meta.env.VITE_STATIC_CONTENT_BASE_URL}${user.value?.avatarURI}`
  )

  return {
    avatarUrl
  }
}
