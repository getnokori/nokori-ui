<template>
  <div class="w-full flex overflow-auto relative">
    <FullScreenLoader v-if="state.isLoading" />
    <MailSidebar />
    <div class="flex col w-full">
      <!-- div area -->
      <div class="pt-6 px-7 w-full">
        <div class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-5 ml-0">
          <h1 class="text-2xl font-normal tracking-normal">Mail Settings</h1>
          <div class="hidden md:flex items-center ml-auto"></div>
        </div>
        <form>
          <div class="space-y-12">
            <div
              class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300/10 pb-12 md:grid-cols-3"
            >
              <div>
                <h2 class="text-base font-semibold leading-7 text-zinc-300">
                  Default From Address
                </h2>
                <p class="mt-1 text-sm leading-6 text-gray-500">
                  When no from address is provided, we'll use the default.
                </p>
              </div>

              <div
                class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2"
              >
                <div class="sm:col-span-4">
                  <label
                    for="defaultFrom"
                    class="block text-sm font-medium leading-6 text-zinc-300"
                    >Default From Address</label
                  >
                  <div class="mt-2">
                    <div
                      class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-zinc-500"
                    >
                      <span
                        class="flex select-none items-center pl-3 text-gray-500 sm:text-sm"
                      ></span>
                      <input
                        id="defaultFrom"
                        v-model="state.defaultFrom"
                        type="email"
                        name="defaultFrom"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-zinc-300 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="sara@yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300/10 pb-12 md:grid-cols-3"
            >
              <div>
                <h2 class="text-base font-semibold leading-7 text-zinc-300">
                  Verified Domains
                </h2>
                <p class="mt-1 text-sm leading-6 text-gray-500">
                  To send email through nokori, you must verify ownership of the
                  sending domains.
                </p>
              </div>

              <div class="flex-1 w-full col-span-2">
                <div
                  class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"
                >
                  <div>
                    <div class="flex items-center mb-3">
                      <h2
                        class="text-base font-semibold leading-7 text-zinc-300"
                      >
                        Domains
                      </h2>
                      <button
                        type="button"
                        class="ml-auto inline-flex items-center gap-x-1.5 rounded-md bg-zinc-700/70 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        @click="state.showNewDomainModal = true"
                      >
                        <PlusCircleIcon
                          class="-ml-0.5 h-5 w-5 text-zinc-300"
                          aria-hidden="true"
                        />
                        New Domain
                      </button>
                      <Teleport to="body">
                        <ActionPanelCreateDomain
                          v-if="state.showNewDomainModal"
                          :open="state.showNewDomainModal"
                          title="New Domain"
                          subtext="Enter the domain you want to verify."
                          field-label="Domain"
                          placeholder="example.com"
                          button-text="Add Domain"
                          :error="state.errors.domainCreate"
                          @submit="handleDomainCreate"
                          @after-leave="state.showNewDomainModal = false"
                        />
                      </Teleport>
                    </div>
                    <table
                      v-if="state.domains.length > 0"
                      class="w-full text-xs mt-4"
                    >
                      <thead>
                        <tr
                          class="text-3xs font-medium text-gray-300 uppercase text-left"
                        >
                          <th>Domain</th>
                          <th>Status</th>
                          <th>Last Checked</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="domain in state.domains"
                          :key="domain.domain"
                          class="divide-gray-100/20 border-t last:border-b border-gray-100/20 text-sm leading-7 items-center"
                        >
                          <td class="font-mono text-gray-300">
                            {{ domain.domain }}
                          </td>
                          <td
                            class="mt-1 flex justify-start sm:mt-0 sm:flex-auto"
                          >
                            <div class="flex items-center justify-end gap-x-2">
                              <div
                                :class="[
                                  statuses[domain.status],
                                  'flex-none rounded-full p-1'
                                ]"
                              >
                                <div
                                  :class="[
                                    domain.status === 'verifying'
                                      ? ' animate-pulse'
                                      : '',
                                    'h-1.5 w-1.5 rounded-full bg-current'
                                  ]"
                                />
                              </div>
                              <div>{{ statusLabels[domain.status] }}</div>
                            </div>
                          </td>
                          <td class="mt-1 justify-between sm:mt-0 sm:flex-auto">
                            {{
                              domain.lastVerified
                                ? timeSince(domain.lastVerified)
                                : 'Never'
                            }}
                          </td>
                          <td
                            class="mt-1 justify-end sm:mt-0 ml-auto flex items-center"
                          >
                            <a
                              href="#"
                              class="mr-2 underline"
                              @click.stop="handleClickDomainSettings(domain)"
                              >Settings</a
                            >
                            <a
                              href="#"
                              class=""
                              @click.stop="state.domainToDelete = domain.domain"
                            >
                              <TrashIcon
                                class="ml-2 h-5 w-5 text-gray-400 hover:text-red-300"
                                aria-hidden="true"
                              />
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <Teleport to="body">
              <ActionPanelCopyValue
                v-if="state.showDomainVerify"
                title="Verify Domain"
                subtext="Add the value below as a TXT record to your DNS settings to verify ownership of the domain."
                :field-value="state.domainSettings.verificationKey"
                @after-leave="state.showDomainVerify = false"
              />
            </Teleport>
            <!-- Delete Template Modal -->
            <Teleport to="body">
              <ModalPromptRedConfirmCancel
                v-if="state.domainToDelete"
                title="Delete Domain"
                message="Are you sure you want to delete this domain? You will no longer be able to send email from this domain."
                button-text="Delete Domain"
                @did-confirm="handleDeleteDomain"
              />
            </Teleport>
            <!-- /Delete Template Modal -->
          </div>

          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              class="text-sm font-semibold leading-6 text-zinc-300 disabled:text-zinc-500"
              :disabled="state.isSaving"
              @click.prevent="router.push('/mail')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-md bg-blue-600/70 px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              @click.prevent="handleFormSubmit"
            >
              <span v-if="!state.isSaving" class="mx-auto">Save</span>
              <span
                v-if="state.isSaving"
                class="flex flex-none bg-none items-center justify-center"
              >
                <IconLoadingSpinner class="animate-spin ml-2 text-zinc-50" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlusCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'
import { reactive } from 'vue'
import { timeSince } from '@/utils/dates'
import type MailDomainsModelDTO from '@/types/mail/MailDomains.type'
import MailService from '@/services/mail/mail.service'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = reactive({
  showNewDomainModal: false,
  showDomainVerify: false,
  deleteDialogOpen: false,
  domainToDelete: null as string | null,
  defaultFrom: null as string | null,
  domainSettings: {
    verificationKey: null as string | null
  },
  domains: [] as MailDomainsModelDTO[],
  errors: {
    domainCreate: null as string | null
  },
  isSaving: false,
  isLoading: true
})

async function handleDomainCreate(domain: string) {
  if (!domain) {
    state.showNewDomainModal = false
    return
  }
  try {
    const response = await MailService.createDomain(domain)
    if (response.data) {
      fetchDomains()
      state.domainSettings.verificationKey = `nokori-domain-validation=${response.data.verificationKey}`
      state.showNewDomainModal = false
      state.showDomainVerify = true
    }
  } catch (error: any) {
    state.errors.domainCreate = error.message
  }
}

function handleClickDomainSettings(domain: any) {
  state.domainSettings.verificationKey = `nokori-domain-validation=${domain.verificationKey}`
  state.showDomainVerify = true
}

const statuses = {
  verified: 'text-green-600 bg-green-400/10',
  verifying: 'text-yellow-600 bg-yellow-200/10'
}

const statusLabels = {
  verified: 'Verified',
  verifying: 'Verifying'
}

async function handleDeleteDomain() {
  if (!state.domainToDelete) return null

  try {
    const didDelete = await MailService.deleteDomain(state.domainToDelete)
    if (didDelete.data) {
      state.domainToDelete = null

      fetchDomains()
    }
  } catch (error: any) {
    fetchDomains()
  }
  state.domainToDelete = null
}

async function handleFormSubmit() {
  state.isSaving = true
  if (!state.defaultFrom) {
    state.isSaving = false
    return
  }

  const settings: { key: string; value: any }[] = []
  settings.push({
    key: 'defaultFrom',
    value: state.defaultFrom
  })
  try {
    const response = await MailService.saveSettings(settings)
    if (response.data) router.push('/mail')
  } catch (error) {
    state.isSaving = false
  }

  // state.isSaving = false
}

async function getDefaultFrom() {
  try {
    const response = await MailService.getSetting('defaultFrom')
    if (response.data) {
      state.defaultFrom = response.data.value
    }
  } catch (error) {
    state.defaultFrom = null
  }

  state.isLoading = false
}

async function fetchDomains() {
  try {
    const response = await MailService.getDomains()
    state.domains = response.data
  } catch (error) {
    state.domains = []
  }
}

fetchDomains()
getDefaultFrom()
</script>
<style>
body {
  background-color: #202125;
}
</style>
