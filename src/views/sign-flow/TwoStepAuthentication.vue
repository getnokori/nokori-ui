<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody one-child>
        <SignCardWrapper>
          <TwoStepVerification :handler="handleSubmit" skip-link="/app">
            <template #logo>
              <img
                :src="logoUrl"
                alt="nokori"
                :style="{ width: '100%', maxWidth: '3.5rem' }"
              />
            </template>
          </TwoStepVerification>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { TwoStepVerification } from '@nokori/vue'
import ContainerWidths from '@/enums/ContainerWidths.enum'

import logoUrl from '@/assets/images/logo-icon.png'

function handleSubmit() {
  // DO SOMETHING
}
</script>
