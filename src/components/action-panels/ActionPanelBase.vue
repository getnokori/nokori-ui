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
              class="relative transform overflow-hidden rounded-lg bg-zinc-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-xl sm:p-6"
            >
              <slot></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

const open = ref(true)
const props = defineProps({
  open: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const isLoading = ref(props.isLoading)

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

watch(
  () => props.open,
  (newVal) => {
    open.value = newVal
  }
)
</script>
