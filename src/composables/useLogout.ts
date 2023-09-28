import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import useStoresReset from '@/composables/useStoresReset'
import nk from '@/services/nokori.service'
import type UseLogoutState from '@/types/composables/UseLogoutState.interface'

export default function useLogout() {
  const router = useRouter()

  const state: UseLogoutState = reactive({
    isLogoutLoading: false,
    logoutError: null
  })

  async function handleLogout() {
    state.logoutError = null
    state.isLogoutLoading = true

    try {
      const { data } = await nk.auth.logout()

      await router.replace(data.redirectTo)
      useStoresReset()
    } catch (error: unknown) {
      state.logoutError = error as Error
    } finally {
      state.isLogoutLoading = false
    }
  }

  return {
    ...toRefs(state),
    handleLogout
  }
}
