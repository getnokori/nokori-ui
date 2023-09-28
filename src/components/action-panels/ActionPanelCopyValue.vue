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
              class="relative transform overflow-hidden rounded-lg bg-zinc-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-xl sm:p-6"
            >
              <div class="bg-zinc-800 sm:rounded-lg">
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
                    <p class="mt-1">
                      For guidance, please consult the
                      <a
                        href="#"
                        class="underline text-blue-500"
                        target="_blank"
                        >Mail Documentation</a
                      >
                    </p>
                  </div>
                  <form class="mt-5 sm:flex sm:items-center">
                    <div
                      class="w-full relative mt-2 rounded-md shadow-sm bg-white/5"
                    >
                      <input
                        id="fieldValue"
                        :value="showTooltip ? 'Copied!' : inputValue"
                        type="text"
                        name="fieldValue"
                        class="block w-full bg-white/10 rounded-md transparent border-0 py-1.5 pr-10 text-gray-200 ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600/40 sm:text-sm sm:leading-6"
                        readonly
                        @focus=";($event.target as HTMLInputElement).select()"
                      />
                      <div
                        class="absolute inset-y-0 right-0 flex items-center pr-3 z-50"
                      >
                        <a href="#" class="aria-hidden">
                          <DocumentDuplicateIcon
                            class="h-5 w-5 text-white-400"
                            aria-hidden="true"
                            @click.stop="copyToClipboard"
                          />
                        </a>
                      </div>
                    </div>
                  </form>
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
import { ref, watch } from 'vue'
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
const open = ref(true)
const showTooltip = ref(false)

const props = defineProps<{
  title: string
  subtext: string
  fieldLabel?: string
  fieldValue: any
  placeholder?: string
}>()

const inputValue = ref(props.fieldValue)

watch(
  () => props.fieldValue,
  (newVal) => {
    inputValue.value = newVal
  }
)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(inputValue.value)
    showTooltip.value = true
    setTimeout(() => {
      showTooltip.value = false
    }, 1000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>
