<template>
  <template v-if="isAppLoading">
    <div class="app-loading">
      <FullScreenLoader />
    </div>
  </template>

  <template v-else-if="isAppError">
    <div class="app-error">
      <div class="app-error__container">
        <BaseError> An error has occurred. </BaseError>

        <BaseButton
          class="app-error__btn"
          type="button"
          :is-loading="isLogoutLoading"
          @click="handleLogout"
        >
          Try To Login Again
        </BaseButton>
      </div>
    </div>
  </template>

  <template v-else>
    <template v-if="isFullscreen">
      <RouterView />
    </template>

    <template v-else>
      <div
        v-if="user && user.verified === 0"
        class="bg-[#000000] pt-2 pb-2 text-center text-15"
      >
        <div v-if="!state.didClickResendEmail">
          👋 Welcome! Please verify your email.
          <button
            type="button"
            className="rounded bg-blue-600 ml-2 py-1 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            @click="($event: any) => handleResendEmailClick()"
          >
            Resend Email
          </button>
        </div>

        <div v-else>Verifcation email sent! 🚀 Please check your inbox.</div>
      </div>
      <TheHeader />

      <div class="row">
        <TheNavigation />
        <RouterView />
      </div>

      <Teleport to="body">
        <Transition>
          <AccountSettingsModal
            v-if="isSettingsModalOpen"
            @close="toggleSettingsModal"
          />
        </Transition>
      </Teleport>
    </template>
  </template>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  onUpdated,
  ref,
  reactive
} from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import {
  fullscreenRoutes,
  protectedSignUpRoutes
} from '@/router/helpers/pageLists'
import useStripeStore from '@/stores/stripe.store'
import useUserStore from '@/stores/user.store'
import useSettingsStore from '@/stores/settings.store'
import useLogout from '@/composables/useLogout'
import nk from '@/services/nokori.service'
import RouteNames from '@/enums/RouteNames.enum'
import AppMailTemplates from './enums/mail/appMailTemplates.enum'

const isProtectedSignUpRouteCheckLoading = ref(true)

const stripeStore = useStripeStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const { isStripeLoading, stripeError } = storeToRefs(stripeStore)

// prettier-ignore
const {
  hasPaymentMethod,
  isSignUpCompleted,
  isUserLoading,
  isUserPaymentAndPlanCheckLoading,
  user,
  userError
} = storeToRefs(userStore)

const { fetchUser } = userStore

const { isSettingsModalOpen } = storeToRefs(settingsStore)
const { toggleSettingsModal } = settingsStore

const { isLogoutLoading, handleLogout } = useLogout()

const route = useRoute()
const router = useRouter()

const state = reactive({
  didClickResendEmail: false
})

async function handleResendEmailClick(): Promise<boolean> {
  state.didClickResendEmail = true
  // await loladb.resendVerificationEmail()
  const { user } = userStore
  if (!user) {
    return false
  }

  await nk.mail.send({
    scenario: 'verify-email',
    templateId: AppMailTemplates.VERIFY_EMAIL_TEMPLATE,
    settings: {
      to: user.email
    },
    context: {
      appUrl: import.meta.env.VITE_APP_URL
    }
  })

  return true
}

onBeforeMount(async () => {
  const isProtectedSignUpRoute = protectedSignUpRoutes.includes(
    route.name as RouteNames
  )

  await useStripeStore().initStripeInstance()

  // Automatic login
  if (!route.meta.public) {
    await fetchUser()
  }

  // Prevent access to payment / plan / welcome routes for fully signed up users
  // console.log('sign up complete', isSignUpCompleted.value)
  if (isProtectedSignUpRoute && isSignUpCompleted.value) {
    await router.replace({ name: RouteNames.ROOT })
  }

  if (
    user.value &&
    !isSignUpCompleted.value &&
    route.name !== RouteNames.SIGN_UP_VERIFICATION
  ) {
    await router.push({ name: RouteNames.SIGN_UP_PLEASE_VERIFY })
  }

  isProtectedSignUpRouteCheckLoading.value = false

  if (!user.value && !route.meta.public) {
    handleLogout()
  }
})

onMounted(() => {
  if (window.top && window.top !== window.self) {
    window.top.location = window.self.location
  }

  nk.auth.on('LOGGED_OUT', () => {
    router.push({ name: RouteNames.LOGIN })
  })
})

onUpdated(async () => {
  if (user.value && isUserPaymentAndPlanCheckLoading.value) {
    // if (!hasPaymentMethod.value) {
    //   await router.replace({ name: RouteNames.SIGN_UP_PAYMENT })
    //   isUserPaymentAndPlanCheckLoading.value = false
    // } else {
    //   isUserPaymentAndPlanCheckLoading.value = false
    // }
    isUserPaymentAndPlanCheckLoading.value = false
  }
})

const isAppLoading = computed(() => {
  return (
    isStripeLoading.value ||
    isUserLoading.value ||
    isUserPaymentAndPlanCheckLoading.value ||
    isProtectedSignUpRouteCheckLoading.value
  )
})

const isAppError = computed(() => {
  return stripeError.value || userError.value
})

const isFullscreen = computed(() =>
  fullscreenRoutes.includes(route.name as RouteNames)
)
</script>

<style scoped lang="scss">
.app-loading,
.app-error {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: toRem(80px);
  padding-bottom: toRem(80px);
  height: 100%;
}

.app-error {
  margin-left: auto;
  margin-right: auto;
  max-width: toRem(540px);

  &__container {
    text-align: center;
  }

  &__btn {
    margin-top: toRem(20px);
    min-width: toRem(250px);
  }
}

.row {
  display: grid;
  grid-template-columns: var(--nav-width) auto;
  height: calc(100% - var(--header-height));
}
</style>
