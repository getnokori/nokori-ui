<template>
  <TransitionRoot as="template" :show="state.open">
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
                  class="pointer-events-auto w-screen max-w-md -mr-4"
                >
                  <div
                    class="flex h-full flex-col overflow-y-scroll bg-[#27282c] py-6 shadow-xl"
                  >
                    <div class="px-4 sm:px-6">
                      <div class="flex items-center justify-between">
                        <div class="flex flex-col items-start">
                          <DialogTitle
                            class="flex text-base font-semibold leading-4 text-gray-200"
                            >Mail Log</DialogTitle
                          >

                          <div class="flex font-mono text-gray-400 text-xs">
                            {{ props.logId }}
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
                    <div class="relative mt-6 flex-1 px-4 sm:px-6">
                      <!-- Your content -->
                      <div
                        class="text-xs font-medium overflow-x-scroll bg-[#1E1E1E] px-2 py-2 leading-4"
                        v-html="state.parsedJson"
                      ></div>
                    </div>
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
import { ref, onMounted, reactive } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { getHighlighter } from 'shiki-es'

const props = defineProps({
  logId: {
    type: String,
    required: true
  }
})

const open = ref(props.logId !== null)
const logEntry = `{
	"log-level": "info",
	"event": "delivered",
	"campaigns": [],
	"tags": [],
	"flags": {
		"is-system-test": false,
		"is-routed": false,
		"is-authenticated": true,
		"is-test-mode": false
	},
	"storage": {
		"region": "us-west1",
		"env": "production",
		"key": "BAABAQVYsg5IuWX3Rp1Esq6Tb2AlvrrTYQ==",
		"url": "https://storage-us-west1.api.mailgun.net/v3/domains/m.nokori.com/messages/BAABAQVYsg5IuWX3Rp1Esq6Tb2AlvrrTYQ=="
	},
	"recipient": "wes@nokori.com",
	"user-variables": {
		"verify_url": "https://app.nokori.com/sign-up/verify?token=fvjcyb7ByQE2Vl919TX4J9eJrf&accountId=nk.acct.mMwoiwOIMWgIEfrfWqF"
	},
	"timestamp": 1685862201.901279,
	"envelope": {
		"targets": "wes@nokori.com",
		"transport": "smtp",
		"sending-ip": "198.61.254.17",
		"sender": "postmaster@m.nokori.com"
	},
	"delivery-status": {
		"mx-host": "aspmx.l.google.com",
		"enhanced-code": "",
		"attempt-no": 1,
		"session-seconds": 0.671,
		"tls": true,
		"code": 250,
		"message": "OK",
		"certificate-verified": true,
		"description": "",
		"utf8": true
	},
	"template": {
		"name": "confirm_account_creation"
	},
	"id": "oNvgHEm4RfeYW2IEPNfxrw",
	"recipient-domain": "nokori.com",
	"message": {
		"size": 1060,
		"attachments": [],
		"headers": {
			"message-id": "20230604070321.92fcdb3d8a272da3@m.nokori.com",
			"to": "eugenefromrus@gmail.com",
			"subject": "Please verify your email",
			"from": "Team nokori <hello@nokori.com>"
		}
	}
}`
const state = reactive({
  parsedJson: {},
  open: props.logId !== null
})
const html = ref('')

onMounted(async () => {
  const highlighter = await getHighlighter({
    theme: 'dark-plus',
    themes: ['dark-plus'],
    langs: ['json']
  })

  state.parsedJson = highlighter.codeToHtml(logEntry.trim(), { lang: 'json' })
})
</script>
