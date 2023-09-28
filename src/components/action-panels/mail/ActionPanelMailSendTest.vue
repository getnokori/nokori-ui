<template>
  <ActionPanelBase :open="state.open" :is-loading="state.isSending">
    <FullScreenLoader v-if="state.isLoading" :full-screen="false" />
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-base font-semibold leading-6 text-zinc-100">
        Send a Test Email
      </h3>
      <div class="mt-2 max-w-lg text-sm text-zinc-300 tracking-normal">
        <p>
          Enter the email address where you would like to send a test email.
        </p>
      </div>
      <form class="mt-5 sm:flex sm:items-center">
        <div class="w-full">
          <label for="recipientEmail" class="sr-only">Test Recipient</label>
          <input
            id="recipientEmail"
            v-model="state.recipientEmail"
            type="text"
            name="recipientEmail"
            class="block w-full bg-white/5 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600/50 sm:text-sm sm:leading-6"
            placeholder="you@testwebsite.com"
          />
        </div>
        <button
          type="submit"
          class="mt-3 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:ml-2 sm:mt-0 max-w-md flex"
          @click.prevent="handleSubmit"
        >
          <span v-if="!state.isSending" class="mx-auto">
            <PaperAirplaneIcon class="w-4 h-4" />
          </span>
          <span
            v-if="state.isSending"
            class="flex-grow flex items-center justify-center"
          >
            <IconLoadingSpinner
              class="animate-spin h-3 w-3 ml-2 text-zinc-50"
            />
          </span>
        </button>
      </form>
      <div
        v-if="state.error"
        class="mt-3 rounded-md py-1.5 px-3 text-sm tracking-normal flex w-full bg-rose-400/50"
      >
        A valid email is required
      </div>
    </div>
  </ActionPanelBase>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { PaperAirplaneIcon } from '@heroicons/vue/20/solid'

const state = reactive({
  open: true,
  isLoading: true,
  isSending: false,
  recipientEmail: '',
  error: false
})

onMounted(() => {
  state.isLoading = false
})

const emit = defineEmits<{
  (e: 'sendTestEmail', recipientEmail: string): void
}>()

function validateEmail(email: string) {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return regex.test(email)
}

function handleSubmit() {
  state.isSending = true
  state.error = false

  if (!state.recipientEmail || state.recipientEmail === '') {
    state.error = true
    state.isSending = false
    return
  }

  const isValid = validateEmail(state.recipientEmail)
  if (!isValid) {
    state.error = true
    state.isSending = false
    return
  }

  emit('sendTestEmail', state.recipientEmail)
}
</script>
