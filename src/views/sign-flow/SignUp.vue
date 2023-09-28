<template>
  <SignWrapper>
    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody
        v-if="!state.isVerificationShown"
        class="sign-body--without-header"
      >
        <SignInfo>
          <SignInfoLogo />

          <SignInfoList>
            <SignInfoListItem>
              <template #title>🎉 Limited Time Offer 🎉</template>

              <template #description>
                Get free unlimited cloud function executions forever when you
                sign up before August 31st.
              </template>
            </SignInfoListItem>
            <SignInfoListItem>
              <template #title>Get started quickly</template>

              <template #description>
                Sign-up is fast and easy. Start building in 5 minutes or less.
              </template>
            </SignInfoListItem>
            <SignInfoListItem>
              <template #title>Streamline your workflow</template>

              <template #description>
                Cut down the time it takes to get live with our revolutionary
                low-code tools and products.
              </template>
            </SignInfoListItem>

            <SignInfoListItem>
              <template #title>Amazing Support</template>

              <template #description>
                Enjoy incredible support from our team of experts.
              </template>
            </SignInfoListItem>
          </SignInfoList>
        </SignInfo>

        <SignCardWrapper>
          <SignUpCard
            heading-tag="h2"
            sign-in-link="/login"
            :handler="handleSubmit"
            :is-loading="state.signUpFlow.isLoading"
            :password-strength="true"
            :error="state.signUpFlow.error"
            :email="state.email"
          >
            <template #logo>
              <img
                :src="logoUrl"
                alt="nokori"
                :style="{ width: '100%', maxWidth: '3.5rem' }"
              />
            </template>
          </SignUpCard>
        </SignCardWrapper>
      </SignBody>

      <SignBody v-else one-child>
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
                :style="{ width: '100%', maxWidth: '3.5rem' }"
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
import { reactive, watch, onMounted } from 'vue'
import {
  SignUp as SignUpCard,
  SignUpEmailVerification as SignUpEmailVerificationCard
} from '@nokori/vue'
import nk from '@/services/nokori.service'
import RouteNames from '@/enums/RouteNames.enum'
import ContainerWidths from '@/enums/ContainerWidths.enum'
import logoUrl from '@/assets/images/logo-icon.png'
import { event, purchase } from 'vue-gtag'
import { useRouter } from 'vue-router'

import useUserStore from '@/stores/user.store'
import AppMailTemplates from '@/enums/mail/appMailTemplates.enum'
const userStore = useUserStore()
const { fetchUser } = userStore

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
  isVerificationShown: false,
  verifyRequestToken: '',
  signUpFlow: {
    isLoading: false,
    error: null
  },
  resendFlow: {
    isLoading: false,
    error: null
  }
})
async function handleSubmit(formData: any) {
  state.signUpFlow.error = null
  state.signUpFlow.isLoading = true

  if (formData.email) {
    state.email = formData.email
  }

  try {
    purchase({
      /** Unique ID for the transaction. */
      transaction_id: state.email
    })
  } catch (error) {
    // DO SOMETHING
  }

  try {
    event('conversion', {
      send_to: 'AW-11259158732/z3GHCM685ckYEMzB5Pgp'
    })
  } catch (error) {
    // DO SOMETHING
  }

  try {
    const { data, error } = await nk.auth.signup(formData)

    if (error) {
      //handle error case
      state.signUpFlow.error = error as Error
      return
    }
  } catch (error: unknown) {
    state.signUpFlow.error = error as Error
  } finally {
    state.signUpFlow.isLoading = false
  }

  try {
    if (state.signUpFlow.error) {
      return
    }

    await nk.mail.send({
      scenario: 'verify-email',
      templateId: AppMailTemplates.VERIFY_EMAIL_TEMPLATE,
      settings: {
        to: formData.email
      },
      context: {
        appUrl: import.meta.env.VITE_APP_URL
      }
    })

    state.isVerificationShown = true
  } catch (error) {
    state.signUpFlow.error = error as Error
  } finally {
    state.signUpFlow.isLoading = false
  }
}

async function handleEmailResend() {
  state.resendFlow.error = null
  state.resendFlow.isLoading = true

  try {
    const { data, error } = await nk.mail.send({
      scenario: 'verify-email',
      templateId: AppMailTemplates.VERIFY_EMAIL_TEMPLATE,
      settings: {
        to: state.email
      },
      context: {
        appUrl: import.meta.env.VITE_APP_URL
      }
    })

    if (error) {
      state.resendFlow.error = error
    }
  } catch (error: unknown) {
    state.resendFlow.error = error as Error
  } finally {
    state.resendFlow.isLoading = false
  }
}

onMounted(() => {
  if (router.currentRoute.value.query.email) {
    state.email = router.currentRoute.value.query.email as string
  }
})
</script>
