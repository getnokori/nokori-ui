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
            User Id
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 sm:table-cell text-3xs font-medium uppercase"
          >
            Email
          </th>
          <th
            scope="col"
            class="py-2 pl-0 pr-4 text-right sm:pr-8 sm:text-left text-3xs font-medium uppercase"
          >
            Name
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-4 sm:table-cell text-3xs font-medium uppercase"
          >
            Status
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-4 sm:table-cell text-3xs font-medium uppercase"
          >
            Verified
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-4 text-right sm:table-cell sm:pr-6 lg:pr-4 text-3xs font-medium uppercase"
          >
            Date Created
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-4 text-right sm:table-cell sm:pr-6 lg:pr-8 text-3xs font-medium uppercase"
          >
            Last Logged In
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr
          v-for="user in users"
          :key="user.userId"
          class="text-gray-400 hover:text-gray-200 cursor-pointer"
          @click="$emit('rowClicked', user)"
        >
          <td class="hidden py-1.5 pl-0 pr-4 sm:table-cell sm:pr-4">
            <div class="flex gap-x-3">
              <div class="font-mono text-2xs leading-none">
                {{ user.userId }}
              </div>
            </div>
          </td>
          <td class="hidden py-1.5 pl-0 pr-4 text-sm leading-6 sm:table-cell">
            {{ user.email }}
          </td>
          <td class="py-1.5 pl-0 pr-4 text-sm leading-6">
            {{ user.firstName }} {{ user.lastName }}
          </td>
          <td class="py-1.5 pl-0 pr-4 text-sm leading-6">
            <div class="flex items-center justify-end gap-x-2 sm:justify-start">
              <div
                :class="[
                  user.active
                    ? 'text-green-500 bg-green-400/10'
                    : 'text-rose-400 bg-rose-400/10',
                  'flex-none rounded-full p-1'
                ]"
              >
                <div class="h-1.5 w-1.5 rounded-full bg-current" />
              </div>
              <div class="hidden sm:block">
                {{ user.active ? 'Active' : 'Inactive' }}
              </div>
            </div>
          </td>
          <td class="hidden py-1.5 pl-0 pr-4 text-sm leading-6 sm:table-cell">
            <CheckCircleIcon
              v-if="user.verified"
              class="h-5 w-5 text-green-500"
            />
            <ClockIcon v-if="!user.verified" class="h-5 w-5 text-zinc-400/70" />
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-4"
          >
            <time :datetime="user.createdAt">{{
              timeSince(user.createdAt)
            }}</time>
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-4"
          >
            <time :datetime="user.lastLoggedInAt">{{
              timeSince(user.lastLoggedInAt)
            }}</time>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import type MailSends from '@/types/mail/SentMail.type'
import { timeSince } from '@/utils/dates'
import AccountStatusLabel from '@/enums/accounts/AccountStatus.enum'
import { SentMailStatusLabels } from '@/enums/mail/SentMailStatus.enum'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
import { ClockIcon } from '@heroicons/vue/24/outline'
import type { UsersAllDTO } from '@/types/auth/users.type'

const statuses = {
  active: 'text-green-500 bg-green-400/10',
  inactive: 'text-rose-400 bg-rose-400/10'
}

defineProps<{
  users: UsersAllDTO[]
}>()

defineEmits<{
  (e: 'rowClicked', row: UsersAllDTO): void
}>()
</script>
