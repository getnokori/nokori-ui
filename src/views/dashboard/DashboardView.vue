<template>
  <section class="w-full max-w-200 mx-auto overflow-auto relative">
    <FullScreenLoader v-if="state.isLoading" />
    <div class="relative px-5 pt-7 pl-7 pb-16 pr-10 min-h-screen">
      <div>
        <header class="flex items-center h-5 mb-4 pl-2">
          <h2 class="text-2xl font-normal tracking-normal dark:text-dark-95">
            Home
          </h2>
        </header>
        <div
          class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-5 -ml-2"
        >
          <div class="date">
            <PeriodSelector
              v-model="state.dateRange"
              @updated-dates="handleCalendarUpdate"
            />
          </div>
          <div class="hidden md:flex items-center ml-auto">
            <div class="flex items-center ml-auto">
              <span
                class="flex-shrink-0 w-1.25 h-1.25 rounded-full mr-1.5 border-2 border-wtf-majorelle"
              >
              </span>
              <span
                class="text-15 whitespace-nowrap text-grey dark:text-dark-grey"
              >
                Current Period
              </span>
            </div>
            <!-- <div class="flex items-center ml-2">
              <span
                class="flex-shrink-0 w-1.25 h-1.25 rounded-full mr-1.5 border-2 border-wtf-cotton"
               
              ></span
              >
              <span
                class="text-13 whitespace-nowrap text-grey dark:text-dark-grey"
                data-v-54ccee02=""
              >
                Last Period
              </span>
            </div> -->
          </div>
        </div>
        <div class="flex">
          <div class="pl-2 mb-6 pb-5 w-full">
            <div>
              <div class="pl-1 flex items-center overflow-visible mb-3">
                <div class="menu">
                  <span class="text-15 font-normal text-zinc-400"
                    >Total API Requests</span
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
            <div class="mt-10 relative">
              <ChartsLineChartBig
                :data="state.chart.data"
                series-label="Total API Requests"
              />
            </div>
            <!-- <div class="w-full grid relative h-[16rem] mt-4">
              <ChartsLineSplitBar />
            </div> -->
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

        <!-- The smaller metrics -->
        <div>
          <div
            class="chart-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 -mx-4 clear"
          >
            <FigureWLineChart
              figure="usage.hubs"
              label="Hubs Requests"
              :dates="state.dateRange"
            />
            <FigureWLineChart
              figure="usage.auth"
              label="Auth Events"
              :dates="state.dateRange"
            />
            <FigureWLineChart
              figure="usage.email"
              label="Mail Events"
              :dates="state.dateRange"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { format, sub } from 'date-fns'
import FrequenciesService from '@/services/frequencies.service'
import { intToString } from '@/utils/strings'

const state = reactive({
  dateRange: [sub(new Date(), { days: 30 }), new Date()] as Date[],
  chart: {
    data: [] as [string, number][] as [string, number][],
    isLoading: false,
    isError: false
  },
  totalRequests: 0 as number | string,
  currentFrom: '' as string,
  chartDates: {
    fromDate: '' as string,
    toDate: '' as string
  },
  isLoading: true
})

watch(() => state.dateRange, fetchChartData)
watch(() => state.dateRange, formatChartDates)

function handleCalendarUpdate(calendar: any) {
  state.dateRange = calendar
}

function formatChartDates() {
  state.chartDates.fromDate = format(state.dateRange[0], 'MMM d')
  state.chartDates.toDate = format(state.dateRange[1], 'MMM d')
}

async function fetchChartData(): Promise<any> {
  state.chart.isLoading = true

  try {
    const apiResponse = await FrequenciesService.getEvents(
      state.dateRange[0].toISOString().split('T')[0],
      state.dateRange[1].toISOString().split('T')[0],
      'usage'
    )

    if (apiResponse.data) {
      const data = apiResponse.data
      state.chart.data = data.map((item: any) => [item.date, item.count]) as [
        string,
        number
      ][]
      const total = data.reduce((acc: number, item: any) => acc + item.count, 0)

      state.totalRequests = intToString(total)
    } else {
      state.chart.data = []
      state.totalRequests = 0
    }
  } catch {
    state.chart.isError = true
  } finally {
    state.chart.isLoading = false
  }

  state.isLoading = false
}

fetchChartData()
formatChartDates()
</script>

<style>
body {
  background-color: #202125;
}

.main-chart-height {
  height: 245px;
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

.chart-grid:before {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
  display: block;
  width: 32px;
  --tw-bg-opacity: 1;
  background-color: rgba(31, 33, 37, var(--tw-bg-opacity));
  content: '';
}

.chart-grid:after {
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 1;
  display: block;
  width: 32px;
  --tw-bg-opacity: 1;
  background-color: rgba(31, 33, 37, var(--tw-bg-opacity));
  content: '';
}

.chart-grid {
  position: relative;
}

.chart-grid > div:nth-child(3n + 1) {
  border-left-width: 0;
}

.chart-grid > div {
  border-top-width: 1px;
  border-left-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgba(54, 54, 58, var(--tw-border-opacity));
}
</style>
