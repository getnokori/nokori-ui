<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody one-child>
        <SignCardWrapper>
          <PasswordResetCard
            :handler="handleSubmit"
            password-strength
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
          </PasswordResetCard>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PasswordReset as PasswordResetCard } from '@nokori/vue'
import nk from '@/services/nokori.service'
import ContainerWidths from '@/enums/ContainerWidths.enum'

import logoUrl from '@/assets/images/logo-icon.png'

const route = useRoute()
const router = useRouter()

interface State {
  token: string
  isLoading: boolean
  error: Error | null
}

const state: State = reactive({
  token: route.query.token as string,
  isLoading: false,
  error: null
})

async function handleSubmit({ newPassword }: { newPassword: string }) {
  state.error = null
  state.isLoading = true

  try {
    const { data, error } = await nk.auth.changePassword({
      token: state.token,
      password: newPassword
    })

    if (!error) {
      router.replace(data.redirectTo)
    } else {
      state.error = error
    }
  } catch (error: unknown) {
    state.error = error as Error
  } finally {
    state.isLoading = false
  }
}
</script>
