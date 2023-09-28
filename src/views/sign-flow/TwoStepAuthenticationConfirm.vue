<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody one-child>
        <SignCardWrapper>
          <TwoStepVerificationCode
            :handler="handleSubmit"
            :phone-ending="3031"
            try-again-link="/two-step-authentication"
          >
            <template #logo>
              <img
                :src="logoUrl"
                alt="nokori"
                :style="{ width: '100%', maxWidth: '3.5rem' }"
              />
            </template>
          </TwoStepVerificationCode>
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { TwoStepVerificationCode } from '@nokori/vue'
import ContainerWidths from '@/enums/ContainerWidths.enum'

import logoUrl from '@/assets/images/logo-icon.png'

function handleSubmit() {
  // DO SOMETHING
}
</script>
