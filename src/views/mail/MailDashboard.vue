<template>
  <div class="w-full h-full flex relative">
    <FullScreenLoader v-if="state.isLoading" />
    <MailSidebar />
    <div class="flex col w-full">
      <!-- div area -->
      <div class="pt-6 px-7 w-full">
        <div class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-5 ml-0">
          <h2 class="text-2xl font-normal tracking-normal">Mail Overview</h2>
          <div class="hidden md:flex items-center ml-auto">
            <div class="flex items-center ml-auto">
              <div class="flex w-full">
                <PeriodSelector
                  v-model="state.dateRange"
                  @updated-dates="handleCalendarUpdate"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="mb-6 pb-5 w-full">
            <div>
              <div class="pl-1 flex items-center overflow-visible mb-3">
                <div class="menu">
                  <span class="text-15 font-normal text-zinc-400"
                    >Total Mail Sends</span
                  >
                </div>
              </div>
              <div class="flex items-center">
                <h3 class="text-3xl pl-1 leading-5">
                  {{ state.totalRequests }}
                </h3>
                <!---->
              </div>
              <!-- <p class="text-grey mb-2 dark:text-dark-grey">
                vs. $0.00 last period
              </p> -->
            </div>
            <div class="grid mt-10 relative">
              <!-- <ChartsLineChartBigMulti
                :series="state.chart.data"
                series-label="Total API Requests"
              /> -->
              <ChartsMailDashboardLineChartBig
                :delivered="state.chart.data.delivered"
                :failed="state.chart.data.failed"
                series-label="Total Mail Sends"
              />
            </div>
            <div class="flex items-center">
              <div class="mt-3 pl-1 text-sm text-grey text-zinc-500">
                {{ state.chartDates.fromDate }}
              </div>
              <div class="ml-auto mt-3 pl-1 text-sm text-grey text-zinc-500">
                {{ state.chartDates.toDate }}
              </div>
            </div>
          </div>
        </div>

        <div class="border-zinc-100 border-1 rounded-md">
          <div
            class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-5 ml-0"
          >
            <h2 class="text-2xl font-normal tracking-normal">Latest Sent</h2>
            <div
              class="flex ml-auto mr-2 bg-zinc-700/80 px-4 py-1 rounded-full"
            >
              <a href="/mail/sent" class="flex text-sm font-medium">
                View all sent mail
                <ArrowLongRightIcon class="ml-2 w-5 leading-none" />
              </a>
            </div>
          </div>
          <TableMailWithStatusIndicators
            :emails="state.emails"
            @row-clicked="handleRowClick"
          />
        </div>
      </div>
    </div>
    <Teleport to="body">
      <FlyoutMailPreview
        v-if="state.emailId"
        :email-id="state.emailId"
        @close="handleModalClose"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { format, sub } from 'date-fns'
import MailStatsService from '@/services/mail/stats.service'
import type SentMail from '@/types/mail/SentMail.type'
import MailService from '@/services/mail/mail.service'
import { ArrowLongRightIcon } from '@heroicons/vue/20/solid'

const state = reactive({
  dateRange: [sub(new Date(), { days: 30 }), new Date()] as Date[],
  chart: {
    data: {
      delivered: [] as [string, number][] as [string, number][],
      failed: [] as [string, number][] as [string, number][]
    },
    isLoading: false,
    isError: false
  },
  totalRequests: 0 as number | string,
  emails: [] as SentMail[],
  emailId: null as string | null,
  chartDates: {
    fromDate: '' as string,
    toDate: '' as string
  },
  isLoading: true
})

watch(() => state.dateRange, fetchChartData)
watch(() => state.dateRange, fetchTableData)
watch(() => state.dateRange, formatChartDates)

function handleCalendarUpdate(calendar: any) {
  state.dateRange = calendar
}

function handleRowClick(email: SentMail) {
  state.emailId = email.emailId
}

function handleModalClose() {
  state.emailId = null
}

function formatChartDates() {
  state.chartDates.fromDate = format(state.dateRange[0], 'MMM d')
  state.chartDates.toDate = format(state.dateRange[1], 'MMM d')
}

async function fetchChartData(): Promise<void> {
  state.chart.isLoading = true
  state.totalRequests = 0

  try {
    const delivered = await MailStatsService.getSendsStat(
      format(state.dateRange[0], 'yyyy-MM-dd'),
      format(state.dateRange[1], 'yyyy-MM-dd'),
      'delivered'
    )

    const failed = await MailStatsService.getSendsStat(
      format(state.dateRange[0], 'yyyy-MM-dd'),
      format(state.dateRange[1], 'yyyy-MM-dd'),
      'failed'
    )

    state.chart.data.delivered = delivered.data
    state.chart.data.failed = failed.data

    state.totalRequests += delivered.data.reduce(
      (acc: number, [_, value]: [string, number]) => acc + value,
      0
    )

    state.totalRequests += failed.data.reduce(
      (acc: number, [_, value]: [string, number]) => acc + value,
      0
    )
  } catch {
    state.chart.isError = true
  } finally {
    state.chart.isLoading = false
  }
}

async function fetchTableData() {
  const from: string | null = format(state.dateRange[0], 'yyyy-MM-dd')
  const to: string | null = format(state.dateRange[1], 'yyyy-MM-dd')
  const emails = await MailService.getSentMailAll({ limit: 10, from, to })
  if (emails?.data?.rows?.length) {
    state.emails = emails.data.rows
  } else {
    state.emails = []
  }

  state.isLoading = false
}

fetchTableData()
fetchChartData()
formatChartDates()
</script>

<style>
body {
  background-color: #202125;
}

.border-wtf-majorelle {
  --tw-border-opacity: 1;
  border-color: rgba(66, 137, 247, var(--tw-border-opacity));
}

.w-1\.25 {
  width: 10px;
}

.h-1\.25 {
  height: 10px;
}
</style>
