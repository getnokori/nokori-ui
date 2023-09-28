<template>
  <TransitionRoot as="template" :show="isOpenProxy">
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
              class="relative transform overflow-hidden rounded-lg bg-zinc-800 px-8 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-8"
            >
              <div class="absolute right-0 top-0 hidden pr-6 pt-6 sm:block">
                <button
                  v-if="!isLoading"
                  type="button"
                  class="rounded-md bg-zinc-800 text-zinc-500 hover:text-zinc-400 focus:outline-none"
                  @click="open = false"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-400/30 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <ExclamationTriangleIcon
                    class="h-6 w-6 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold leading-6 text-zinc-200"
                    >{{ props.title }}</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-zinc-300 tracking-normal">
                      {{ props.message }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-6 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:text-white/70 shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  :disabled="isLoading"
                  @click.prevent="handleConfirm"
                >
                  <IconLoadingSpinner
                    v-if="isLoading"
                    class="animate-spin h-3 w-3 mr-[7px] text-zinc-50"
                  />
                  {{ props.buttonText }}
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white disabled:bg-white/40 disabled:ring-zinc-500 disabled:text-zinc-800 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  :disabled="isLoading"
                  @click="open = false"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'didConfirm'): void
}>()

const open = ref(true)
const isLoading = ref(false)
const isOpenProxy = computed({
  get() {
    if (isLoading.value) {
      return true
    }

    return open.value
  },
  set(value: boolean) {
    // We block any changes to the isOpen value if the modal is persistent.
    // It's an ugly workaround and it prevents us from animating upon closing the modal,
    // but HeadlessUI as of now doesn't support persistent modals.
    // Thus the only way to hide this modal is from outside this component (with a v-if).
    if (isLoading.value) {
      return
    }

    open.value = value
  }
})

function handleConfirm() {
  isLoading.value = true
  emit('didConfirm')
}
</script>
