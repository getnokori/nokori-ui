<template>
  <SignWrapper>
    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody one-child>
        <SignCardWrapper>
          <SignUpSuccessCard
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
          </SignUpSuccessCard>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { SignUpSuccess as SignUpSuccessCard } from '@nokori/vue'
import useUserStore from '@/stores/user.store'
import nk from '@/services/nokori.service'
import ContainerWidths from '@/enums/ContainerWidths.enum'

import logoUrl from '@/assets/images/logo-icon.png'

const { setUserVerified } = useUserStore()

const route = useRoute()

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

async function handleVerification() {
  state.error = null
  state.isLoading = true

  try {
    const { error } = await nk.auth.verifyUser({
      verifyToken: state.token
    })

    if (error) {
      state.error = error
    } else {
      setUserVerified()
    }
  } catch (error: unknown) {
    state.error = error as Error
  } finally {
    state.isLoading = false
  }
}

handleVerification()
</script>
