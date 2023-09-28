<template>
  <div class="px-6 py-4">
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
            class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
          >
            Email Id
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
          >
            Recipient Email
          </th>
          <th
            scope="col"
            class="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
          >
            Status
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
          >
            Duration
          </th>
          <th
            scope="col"
            class="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
          >
            Deployed at
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr
          v-for="item in activityItems"
          :key="item.commit"
          class="text-gray-400 hover:text-gray-200 cursor-pointer"
          @click="handleRowClick(item.commit)"
        >
          <td class="hidden py-1.5 pl-0 pr-4 sm:table-cell sm:pr-8">
            <div class="flex gap-x-3">
              <div class="font-mono text-2xs leading-none">
                {{ item.commit }}
              </div>
            </div>
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-8 text-sm leading-6 md:table-cell lg:pr-20"
          >
            {{ item.recipientEmail }}
          </td>
          <td class="py-1.5 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
            <div class="flex items-center justify-end gap-x-2 sm:justify-start">
              <time class="text-gray-400 sm:hidden" :datetime="item.dateTime">{{
                item.date
              }}</time>
              <div
                :class="[statuses[item.status], 'flex-none rounded-full p-1']"
              >
                <div class="h-1.5 w-1.5 rounded-full bg-current" />
              </div>
              <div class="hidden text-white sm:block">{{ item.status }}</div>
            </div>
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-8 text-sm leading-6 md:table-cell lg:pr-20"
          >
            {{ item.duration }}
          </td>
          <td
            class="hidden py-1.5 pl-0 pr-4 text-right text-sm leading-6 sm:table-cell sm:pr-6 lg:pr-8"
          >
            <time :datetime="item.dateTime">{{ item.date }}</time>
          </td>
        </tr>
      </tbody>
    </table>
    <Teleport to="body">
      <FlyoutMailLog
        v-if="state.selectedLogId"
        :log-id="state.selectedLogId"
        @close="handleModalClose"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const statuses: Record<string, string> = {
  Accepted: 'text-green-800 bg-green-400/10',
  Delivered: 'text-green-400 bg-green-400/10',
  Error: 'text-rose-400 bg-rose-400/10'
}

const state = reactive({
  selectedLogId: null as string | null
})

function handleRowClick(logId: string) {
  state.selectedLogId = logId
}

function handleModalClose() {
  state.selectedLogId = null
}

const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Delivered',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00'
  },
  {
    user: {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f1',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Accepted',
    duration: '1m 32s',
    date: '3 hours ago',
    dateTime: '2023-01-23T09:00'
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f2',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Error',
    duration: '1m 4s',
    date: '12 hours ago',
    dateTime: '2023-01-23T00:00'
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f3',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Delivered',
    duration: '2m 15s',
    date: '2 days ago',
    dateTime: '2023-01-21T13:00'
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f4',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Delivered',
    duration: '1m 12s',
    date: '5 days ago',
    dateTime: '2023-01-18T12:34'
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f5',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Delivered',
    duration: '1m 56s',
    date: '1 week ago',
    dateTime: '2023-01-16T15:54'
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f6',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Delivered',
    duration: '3m 45s',
    date: '1 week ago',
    dateTime: '2023-01-16T11:31'
  },
  {
    user: {
      name: 'Whitney Francis',
      imageUrl:
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    commit: 'mail.2d89f0c82323f23f7',
    recipientEmail: 'wes.melton@gmail.com',
    branch: 'main',
    status: 'Delivered',
    duration: '37s',
    date: '2 weeks ago',
    dateTime: '2023-01-09T08:45'
  }
]
</script>
