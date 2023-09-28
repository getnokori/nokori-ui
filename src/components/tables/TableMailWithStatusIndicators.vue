<template>
  <div class="border-t border-white/10 pt-1">
    <table class="w-full whitespace-nowrap text-left">
      <colgroup>
        <col class="w-full sm:w-4/12" />
        <col class="lg:w-4/12" />
        <col class="lg:w-2/12" />
        <col class="lg:w-1/12" />
        <col class="lg:w-1/12" />
      </colgroup>
      <thead class="border-b border-white/10 text-sm leading-6 text-white">
        <tr>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 sm:table-cell text-3xs font-medium uppercase"
          >
            Email Id
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 sm:table-cell text-3xs font-medium uppercase"
          >
            Recipient Email
          </th>
          <th
            scope="col"
            class="py-2 pl-0 pr-4 text-right sm:pr-8 sm:text-left lg:pr-20 text-3xs font-medium uppercase"
          >
            Subject
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 md:table-cell lg:pr-20 text-3xs font-medium uppercase"
          >
            Status
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-4 text-right sm:table-cell sm:pr-6 lg:pr-8 text-3xs font-medium uppercase"
          >
            Time Sent
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr
          v-for="email in emails"
          :key="email.emailId"
          class="text-gray-400 hover:text-gray-200 cursor-pointer"
          @click="$emit('rowClicked', email)"
        >
          <td class="hidden py-1.5 pl-0 pr-4 sm:table-cell sm:pr-8">
            <div class="flex gap-x-3">
              <div class="font-mono text-2xs leading-none">
                {{ email.emailId }}
              </div>
            </div>
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-8 text-sm leading-6 md:table-cell lg:pr-8"
          >
            {{ email.recipientEmail }}
          </td>
          <td class="py-1.5 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
            {{ email.subject }}
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-8 text-sm leading-6 md:table-cell lg:pr-20"
          >
            <div class="flex items-center justify-end gap-x-2 sm:justify-start">
              <time class="text-gray-400 sm:hidden" :datetime="email.date">{{
                email.date
              }}</time>
              <div
                :class="[statuses[email.status], 'flex-none rounded-full p-1']"
              >
                <div class="h-1.5 w-1.5 rounded-full bg-current" />
              </div>
              <div class="hidden sm:block">
                {{ SentMailStatusLabels[email.status] }}
              </div>
            </div>
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8"
          >
            <time :datetime="email.createdAt">{{
              timeSince(email.createdAt)
            }}</time>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type MailSends from '@/types/mail/SentMail.type'
import { timeSince } from '@/utils/dates'
import { SentMailStatusLabels } from '@/enums/mail/SentMailStatus.enum'

const statuses = {
  accepted: 'text-green-800 bg-green-400/10',
  delivered: 'text-green-400 bg-green-400/10',
  queued: 'text-zinc-400 bg-zinc-400/10',
  failed: 'text-rose-400 bg-rose-400/10'
}

const props = defineProps<{
  emails: MailSends[]
}>()

defineEmits<{
  (e: 'rowClicked', row: MailSends): void
}>()
</script>
