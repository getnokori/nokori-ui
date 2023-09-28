import { computed, reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import nk from '@/services/nokori.service'
import type UserStoreState from '@/types/stores/UserStoreState.interface'
import type UserProfileInfo from '@/types/services/accounts/UserProfileInfo.interface'

const useUserStore = defineStore('user', () => {
  const state: UserStoreState = reactive({
    user: null,
    isUserLoading: false,
    isUserPaymentAndPlanCheckLoading: false,
    userError: null
  })

  const hasPaymentMethod = computed(() => {
    return !!state.user?.subscriptions?.hasPaymentMethod
  })

  const hasPlanId = computed(() => {
    return !!state.user?.subscriptions?.planId
  })

  const userPlanId = computed((): string | null => {
    return state.user?.subscriptions?.planId ?? null
  })

  const isSignUpCompleted = computed(() => {
    return !!state?.user?.verified && !!state?.user?.hasPassword
  })

  async function fetchUser() {
    state.userError = null
    state.isUserLoading = true
    state.isUserPaymentAndPlanCheckLoading = true

    try {
      const { data, error } = await nk.auth.getUser()
      if (!error) {
        state.user = data
      } else {
        state.userError = error
      }
    } catch (error: unknown) {
      state.userError = error as Error
    } finally {
      state.isUserLoading = false
    }
  }

  function updateUserInfo(
    updatedUserInfo: Pick<
      UserProfileInfo,
      'firstName' | 'lastName' | 'email' | 'address'
    >
  ) {
    if (state.user) {
      state.user.firstName = updatedUserInfo.firstName
      state.user.lastName = updatedUserInfo.lastName
      state.user.email = updatedUserInfo.email
      state.user.address.streetAddress = updatedUserInfo.address.streetAddress
      state.user.address.streetAddressExt =
        updatedUserInfo.address.streetAddressExt
      state.user.address.locality = updatedUserInfo.address.locality
      state.user.address.region = updatedUserInfo.address.region
      state.user.address.postalCode = updatedUserInfo.address.postalCode
      state.user.address.country = updatedUserInfo.address.country
    }
  }

  function setUserVerified() {
    if (state.user) {
      state.user.verified = 1
    }
  }

  return {
    ...toRefs(state),
    hasPaymentMethod,
    hasPlanId,
    userPlanId,
    isSignUpCompleted,
    fetchUser,
    updateUserInfo,
    setUserVerified
  }
})

export default useUserStore
