<template>
  <SignWrapper>
    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody one-child>
        <SignCardWrapper>
          <SignUpEmailVerificationCard
            :email="state.email"
            :is-loading="state.resendFlow.isLoading"
            :error="state.resendFlow.error"
            @resend="handleEmailResend"
          >
            <template #logo>
              <img
                :src="logoUrl"
                alt="nokori"
                :style="{ width: '100%', maxWidth: '4rem' }"
              />
            </template>
          </SignUpEmailVerificationCard>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { reactive, watch, onBeforeMount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { SignUpEmailVerification as SignUpEmailVerificationCard } from '@nokori/vue'
import RouteNames from '@/enums/RouteNames.enum'
import ContainerWidths from '@/enums/ContainerWidths.enum'
import logoUrl from '@/assets/images/logo-icon.png'
import nk from '@/services/nokori.service'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user.store'
import AppMailTemplates from '@/enums/mail/appMailTemplates.enum'
import MailService from '@/services/mail/mail.service'

const userStore = useUserStore()
const { user, userError } = storeToRefs(userStore)

const router = useRouter()

interface State {
  email: string
  isVerificationShown: boolean
  verifyRequestToken: string
  signUpFlow: {
    isLoading: boolean
    error: Error | null
  }
  resendFlow: {
    isLoading: boolean
    error: Error | null
  }
}

const state: State = reactive({
  email: '',
  isVerificationShown: true,
  verifyRequestToken: '',
  signUpFlow: {
    isLoading: true,
    error: null
  },
  resendFlow: {
    isLoading: false,
    error: null
  }
})

onBeforeMount(async () => {
  if (!user.value) {
    await userStore.fetchUser()
    state.resendFlow.isLoading = false
  }

  return true
})

async function handleEmailResend() {
  state.resendFlow.error = null
  state.resendFlow.isLoading = true

  if (!user?.value?.email) {
    router.push({
      name: RouteNames.LOGIN
    })
    state.resendFlow.isLoading = false
    return
  }

  try {
    const result = await MailService.sendMail({
      scenario: 'verify-email',
      templateId: AppMailTemplates.VERIFY_EMAIL_TEMPLATE,
      settings: {
        to: user.value.email
      },
      context: {
        appUrl: import.meta.env.VITE_APP_URL
      }
    })

    if (result.data.status === 'success') console.log(result)
  } catch (error: unknown) {
    state.resendFlow.error = error as Error
  } finally {
    state.resendFlow.isLoading = false
  }
}
</script>
