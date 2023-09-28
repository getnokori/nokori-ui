<template>
  <TransitionRoot as="template" :show="open">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full"
    >
      <Dialog as="div" class="relative z-10" @click="$emit('close')">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
            >
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-300 sm:duration-300"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-300"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel
                  class="pointer-events-auto w-screen max-w-4xl -mr-4"
                >
                  <div
                    class="flex h-full flex-col overflow-y-scroll bg-[#27282c] p-6 pt-10 shadow-xl"
                  >
                    <div class="px-4 sm:px-6">
                      <div
                        class="flex items-center justify-between pb-4 border-b-[1px] border-[#373941]"
                      >
                        <div class="flex flex-col items-start">
                          <DialogTitle
                            v-if="!state.isLoading"
                            class="flex-md font-medium text-xl leading-4 text-gray-100 pb-[2px]"
                            >{{ state.subject }}</DialogTitle
                          >
                          <div
                            v-if="state.isLoading"
                            class="animate-pulse bg-zinc-700 min-w-[300px] h-6 mb-1 rounded-full flex-md font-medium text-xl leading-4 text-gray-100 pb-[2px]"
                          ></div>

                          <div class="flex items-center text-gray-400 text-xs">
                            <div class="font-mono flex">
                              {{ props.emailId }}
                            </div>
                            <div
                              v-if="!state.isLoading"
                              class="flex items-center ml-2 text-gray-200 leading-none"
                            >
                              <div
                                :class="[
                                  statuses[state.status],
                                  'flex-none rounded-full p-1 ml-1 mr-1 h-3.5 w-3.5'
                                ]"
                              >
                                <div
                                  class="h-1.5 w-1.5 rounded-full bg-current"
                                />
                              </div>
                              {{ SentMailStatusLabels[state.status] }}
                            </div>
                            <div
                              v-if="state.isLoading"
                              class="animate-pulse min-w-[80px] h-3 bg-zinc-700 rounded-full flex-none ml-2"
                            ></div>
                          </div>
                        </div>

                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="rounded-full p-1 bg-[#373941] text-gray-400 hover:text-gray-500 focus:outline-none"
                            @click="$emit('close')"
                          >
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div v-if="!state.isLoading" class="px-4 sm:px-6">
                      <div class="flex items-center justify-between pt-4">
                        <div class="flex flex-col items-start">
                          <div class="flex col leading-7">
                            <div
                              class="flex min-w-[80px] text-white font-base font-semibold"
                            >
                              To:
                            </div>
                            <div
                              class="flex flex-none text-zinc-300 tracking-loose"
                            >
                              {{ state.to }}
                            </div>
                          </div>
                          <div class="flex col leading-7">
                            <div
                              class="flex min-w-[80px] text-white font-base font-semibold"
                            >
                              From:
                            </div>
                            <div class="text-zinc-300 align-left">
                              {{ state.from }}
                            </div>
                          </div>
                          <div class="flex col leading-7">
                            <div
                              class="flex min-w-[80px] text-white font-base font-semibold"
                            >
                              Subject:
                            </div>
                            <div class="text-zinc-300">{{ state.subject }}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="state.isLoading" class="px-4 sm:px-6">
                      <div
                        class="animate-pulse flex items-center justify-between pt-4"
                      >
                        <div class="flex flex-col items-start">
                          <div class="flex col leading-7 mb-3">
                            <div
                              class="flex min-w-[280px] text-white font-base font-semibold bg-zinc-700 rounded-full h-4"
                            ></div>
                          </div>
                          <div class="flex col leading-7 mb-3">
                            <div
                              class="flex min-w-[280px] text-white font-base font-semibold bg-zinc-700 rounded-full h-4"
                            ></div>
                          </div>
                          <div class="flex col leading-7 mb-3">
                            <div
                              class="flex min-w-[280px] text-white font-base font-semibold bg-zinc-700 rounded-full h-4"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="!state.isLoading"
                      class="relative mt-6 flex-1 px-4 sm:px-6"
                    >
                      <!-- Your content -->
                      <RenderInIFrame :html-document="state.htmlBody" />
                    </div>
                    <div
                      v-if="state.isLoading"
                      class="animate-pulse mt-6 flex-1 px-4 bg-zinc-700 sm:px-6 rounded-md"
                    ></div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { getHighlighter } from 'shiki-es'
import DefaultExampleEmail from '@/fixtures/emails/GithubExample'
import MailService from '@/services/mail/mail.service'
import type { SentMailStatuses } from '@/enums/mail/SentMailStatus.enum'
import { SentMailStatusLabels } from '@/enums/mail/SentMailStatus.enum'

const props = defineProps({
  emailId: {
    type: String,
    required: true
  }
})

const statuses = {
  accepted: 'text-green-800 bg-green-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  queued: 'text-zinc-400 bg-zinc-400/10',
  failed: 'text-rose-400 bg-rose-400/10'
}
const open = ref(props.emailId !== null)

const state = reactive({
  htmlBody: '',
  from: '',
  to: '',
  subject: '',
  open: props.emailId !== null,
  status: 'delivered' as keyof typeof SentMailStatuses,
  isLoading: true
})

watch(() => props.emailId, fetchEmail)

onMounted(async () => {
  if (props.emailId) {
    fetchEmail(props.emailId)
  }
})

async function fetchEmail(emailId: string) {
  const email = await MailService.getSentMail(emailId)
  if (email.data) {
    state.htmlBody = email.data.html
    state.from = email.data.from
    state.to = email.data.to
    state.subject = email.data.subject
    state.isLoading = false
    state.status = email.data.status
  }
}
</script>
