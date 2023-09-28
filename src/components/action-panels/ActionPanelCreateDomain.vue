<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-zinc-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6"
            >
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-base font-semibold leading-6 text-zinc-100">
                  {{ title }}
                </h3>
                <div
                  class="mt-2 max-w-xl text-sm text-zinc-300 tracking-normal"
                >
                  <p>
                    {{ subtext }}
                  </p>
                </div>
                <form class="mt-5 sm:flex sm:items-center">
                  <div class="w-full sm:max-w-xs">
                    <label for="formField" class="sr-only">{{
                      fieldLabel
                    }}</label>
                    <input
                      id="formField"
                      v-model="state.formValue"
                      type="text"
                      name="formField"
                      class="block w-full bg-white/5 rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600/50 sm:text-sm sm:leading-6"
                      :placeholder="placeholder"
                    />
                  </div>
                  <button
                    type="submit"
                    class="mt-3 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:ml-3 sm:mt-0 max-w-md flex"
                    @click.prevent="handleSubmit"
                  >
                    <span v-if="!state.isLoading" class="mx-auto">Save</span>
                    <span
                      v-if="state.isLoading"
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
                  class="bg-rose-500/40 rounded-lg px-5 py-1 text-sm tracking-normal mt-2"
                >
                  {{ state.error }}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  title: string
  subtext: string
  buttonText: string
  fieldLabel: string
  placeholder: string
  error: string | null
}>()

const state = reactive({
  isLoading: false,
  formValue: '',
  error: (props.error || null) as string | null
})

watch(
  () => props.error,
  (newVal) => {
    state.error = newVal
    state.isLoading = false
  }
)

const emit = defineEmits<{
  (e: 'submit', value: any): void
}>()

const open = ref(true)

function handleSubmit() {
  state.isLoading = true
  const validated = validateInput(state.formValue)
  if (!validated) {
    return
  }
  emit('submit', state.formValue)
}

function validateInput(domainName: string) {
  // RFC 1035: The labels must follow the rules for ARPANET host names.
  // They must start with a letter, end with a letter or digit and have as interior characters only letters, digits, and hyphen.
  // Labels must be 63 characters or less.
  const rfc1035Regex = /^([a-z]([-a-z0-9]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i

  if (!rfc1035Regex.test(domainName)) {
    state.error = 'Must be a valid domain'
    state.isLoading = false
    return null
  } else if (!domainName || domainName.length < 1) {
    state.error = 'Domain must be specified'
    state.isLoading = false
    return null
  } else {
    state.error = null
  }

  return true
}
</script>
