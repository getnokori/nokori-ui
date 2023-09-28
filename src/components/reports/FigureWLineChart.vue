<template>
  <div class="relative pb-10 px-4 pl-10 pt-10 pr-10">
    <div>
      <div class="-ml-1 flex items-center overflow-visible">
        <div class="menu mb-2">
          <span class="text-15 text-zinc-400">{{ label }}</span
          ><!---->
        </div>
      </div>
      <div class="flex items-center">
        <h3 class="text-24 leading-5 dark:text-dark-95 pt-2 pb-2">
          {{ state.total }}
        </h3>
        <!---->
      </div>
      <!-- <p class="text-grey text-zinc-500">
        vs. {{ state.totalPrevious }} last period
      </p> -->
      <div class="mb-1">
        <ChartsLineChartSmall :label="props.label" :data="state.data" />
        <p class="-mt-7 pl-2 text-grey font-2xs text-zinc-500">Jan 11</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import FrequenciesService from '@/services/frequencies.service'
import DashboardService from '@/services/dashboard.service'
import { intToString } from '@/utils/strings'

const props = defineProps({
  figure: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  dates: {
    type: Array<Date>,
    required: true
  },
  source: {
    type: String,
    required: false
  }
})

const state = reactive({
  data: [] as [string, number][],
  total: '0' as string | number,
  totalPrevious: '0',
  chart: {
    isLoading: false,
    isError: false
  }
})

watch(
  () => props.dates,
  (dates) => {
    if (props?.source === 'dashboard') {
      fetchDashboardData(dates)
    } else {
      fetchChartData(dates)
    }
    fetchChartData(dates)
  }
)

async function fetchChartData(dates: Date[]): Promise<any> {
  state.chart.isLoading = true

  try {
    const apiResponse = await FrequenciesService.getEvents(
      dates[0].toISOString().split('T')[0],
      dates[1].toISOString().split('T')[0],
      props.figure
    )

    if (apiResponse.data) {
      const data = apiResponse.data
      state.data = data.map((item: any) => [item.date, item.count]) as [
        string,
        number
      ][]

      state.total = intToString(
        state.data.reduce((acc, [_, value]) => acc + value, 0)
      )
      // state.totalPrevious = Math.floor(state.total * Math.random())
    } else {
      state.data = []
      state.total = '0'
    }
  } catch {
    state.chart.isError = true
  } finally {
    state.chart.isLoading = false
  }
}

async function fetchDashboardData(dates: Date[]): Promise<any> {
  state.chart.isLoading = true
  try {
    const apiResponse = await DashboardService.getMetric(
      dates[0].toISOString().split('T')[0],
      dates[1].toISOString().split('T')[0],
      props.figure
    )

    if (apiResponse.data) {
      const data = apiResponse.data

      state.data = data.map((item: any) => [item.date, item.count]) as [
        string,
        number
      ][]

      state.total = state.data.reduce((acc, [_, value]) => acc + value, 0)
      // state.totalPrevious = Math.floor(state.total * Math.random())
    } else {
      state.data = []
      state.total = 0
    }
  } catch {
    state.chart.isError = true
  } finally {
    state.chart.isLoading = false
  }
}

fetchChartData(props.dates)
</script>
