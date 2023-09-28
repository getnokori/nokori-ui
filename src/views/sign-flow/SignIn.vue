<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody one-child>
        <SignCardWrapper>
          <SignInCard
            forgot-password-link="/password-reset-request"
            sign-up-link="/sign-up"
            :handler="handleSubmit"
            :is-loading="state.isLoading"
            :error="state.error"
          >
            <template #logo>
              <img
                :src="logoUrl"
                alt="nokori"
                :style="{ width: '100%', maxWidth: '4rem' }"
              />
            </template>
          </SignInCard>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { SignIn as SignInCard } from '@nokori/vue'
import useUserStore from '@/stores/user.store'
import nk from '@/services/nokori.service'
import ContainerWidths from '@/enums/ContainerWidths.enum'
import RouteNames from '@/enums/RouteNames.enum'

import logoUrl from '@/assets/images/logo-icon.png'

const userStore = useUserStore()
const { fetchUser } = userStore
const router = useRouter()

interface State {
  isLoading: boolean
  error: Error | string | null
}

const state: State = reactive({
  isLoading: false,
  error: null
})

async function handleSubmit(formData: any) {
  state.error = null
  state.isLoading = true

  try {
    const { data, error } = await nk.auth.login(formData)

    if (!error && data) {
      await router.replace({ name: RouteNames.ROOT })
      await fetchUser()
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
