<template>
  <div class="px-2">
    <div class="mt-4 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table
            class="min-w-full divide-y divide-white/10 border-t border-white/10"
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  class="whitespace-nowrap pt-3 pb-2 pl-4 pr-3 text-left text-3xs uppercase tracking-normal font-medium text-gray-300 sm:pl-0"
                >
                  Template Id
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 pt-3 pb-2 text-left text-3xs uppercase tracking-normal font-medium text-gray-300"
                >
                  Template Name
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 pt-3 pb-2 text-left text-3xs uppercase tracking-normal font-medium text-gray-300"
                >
                  Subject
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 pt-3 pb-2 text-left text-3xs uppercase tracking-normal font-medium text-gray-300"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 pt-3 pb-2 text-left text-3xs uppercase tracking-normal font-medium text-gray-300"
                >
                  Last Modified
                </th>
                <th
                  scope="col"
                  class="relative whitespace-nowrap pt-3 pb-2 pl-3 pr-4 sm:pr-0"
                >
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="template in templates"
                :key="template.templateId"
                class="text-gray-400 hover:text-gray-200 cursor-pointer"
                @click.prevent="$emit('rowClicked', template)"
              >
                <td
                  class="font-mono font-semibold text-zinc-300 whitespace-nowrap py-1 pl-4 pr-3 text-xs sm:pl-0"
                >
                  {{ template.templateId }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ template.templateName }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ template.subject }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ format(new Date(template.createdAt), 'MMM, d, Y') }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{
                    template.updatedAt
                      ? format(new Date(template.updatedAt), 'MMM, d, Y')
                      : '&mdash;'
                  }}
                </td>
                <td
                  class="flex relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 items-center"
                >
                  <a href="#" class="text-emerald-400 hover:text-emerald-300"
                    >Edit<span class="sr-only"
                      >, {{ template.templateId }}</span
                    ></a
                  >
                  <a
                    href="#"
                    @click.stop="$emit('openDeleteModal', template.templateId)"
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
          <!-- <PaginationSimple /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { TrashIcon } from '@heroicons/vue/20/solid'
import { format } from 'date-fns'
import type { EmailTemplatesAllDTO } from '@/types/mail/Templates.type'

defineProps({
  templates: {
    type: Array<EmailTemplatesAllDTO>,
    required: true
  }
})

const state = reactive({
  onHover: false
})

defineEmits<{
  (e: 'rowClicked', template: EmailTemplatesAllDTO): void
  (e: 'openDeleteModal', templateId: string): void
}>()
</script>
