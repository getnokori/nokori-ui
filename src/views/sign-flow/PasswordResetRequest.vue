<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody v-if="!state.isSuccessShown" one-child>
        <SignCardWrapper>
          <PasswordResetRequestCard
            :handler="handleSubmit"
            back-link="/login"
            :is-loading="state.isLoading"
            :error="state.error"
          >
            <template #logo>
              <img
                :src="logoUrl"
                alt="nokori"
                :style="{ width: '100%', maxWidth: '3.5rem' }"
              />
            </template>
          </PasswordResetRequestCard>
        </SignCardWrapper>
      </SignBody>

      <SignBody v-else one-child>
        <SignCardWrapper>
          <PasswordResetRequestSuccessCard
            :handler="handleSubmit"
            back-link="/login"
            @resend="handleResend"
          >
            <template #logo>
              <img
                :src="logoUrl"
                alt="nokori"
                :style="{ width: '100%', maxWidth: '3.5rem' }"
              />
            </template>
          </PasswordResetRequestSuccessCard>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  PasswordResetRequest as PasswordResetRequestCard,
  PasswordResetRequestSuccess as PasswordResetRequestSuccessCard
} from '@nokori/vue'
import nk from '@/services/nokori.service'
import ContainerWidths from '@/enums/ContainerWidths.enum'

import logoUrl from '@/assets/images/logo-icon.png'
import AppMailTemplates from '@/enums/mail/appMailTemplates.enum'
import MailService from '@/services/mail/mail.service'

interface State {
  isSuccessShown: boolean
  isLoading: boolean
  error: Error | null
}

const state: State = reactive({
  isSuccessShown: false,
  isLoading: false,
  error: null
})

async function handleSubmit(formData: any) {
  state.error = null
  state.isLoading = true

  try {
    const result = await MailService.sendMail({
      scenario: 'reset-password',
      templateId: AppMailTemplates.RESET_PASSWORD_TEMPLATE,
      settings: {
        to: formData.email
      },
      context: {
        appUrl: import.meta.env.VITE_APP_URL
      }
    })

    if (result.status === 'success') {
      state.isSuccessShown = true
    } else {
      state.error = result.data.message
    }
  } catch (error: unknown) {
    state.error = error as Error
  } finally {
    state.isLoading = false
  }
}

function handleResend() {
  state.isSuccessShown = false
}
</script>
