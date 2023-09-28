<template>
  <div class="px-2">
    <div class="mt-4 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-500">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-0"
                >
                  Account ID
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-300"
                >
                  First Name
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-300"
                >
                  Last Name
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-300"
                >
                  Email
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-300"
                >
                  Verified
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-300"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  class="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-300"
                >
                  Last Logged In
                </th>
                <th
                  scope="col"
                  class="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                >
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="transaction in transactions"
                :key="transaction.accountId"
                class="text-gray-400 hover:text-gray-200 cursor-pointer"
                @click="handleRowClick(transaction.accountId)"
              >
                <td
                  class="font-mono whitespace-nowrap py-1 pl-4 pr-3 text-xs sm:pl-0"
                >
                  {{ transaction.accountId }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ transaction.firstName }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ transaction.lastName }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ transaction.email }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ transaction.verified }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ transaction.createdAt }}
                </td>
                <td class="whitespace-nowrap px-2 py-1 text-sm">
                  {{ transaction.lastLoggedInAt }}
                </td>
                <td
                  class="relative whitespace-nowrap py-1 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <a href="#" class="text-emerald-400 hover:text-emerald-300"
                    >Edit<span class="sr-only"
                      >, {{ transaction.accountId }}</span
                    ></a
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <PaginationSimple />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const state = reactive({
  onHover: false
})

function handleRowClick(accountId: string) {
  console.log('Clicked', accountId)
}

const transactions = [
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq1',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq2',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq1',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq2',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq1',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq2',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq1',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq2',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq1',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq2',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq1',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq2',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq1',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  },
  {
    accountId: 'nk.acct.mv8ryFgxpyU2iqgZNKq2',
    firstName: 'Jeremy',
    lastName: 'Daley',
    verified: 1,
    email: 'jeremydaley@gmail.com',
    createdAt: 'May 17, 2023',
    lastLoggedInAt: 'Jun 1, 2023'
  }
]
</script>
