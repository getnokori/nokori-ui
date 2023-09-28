<template>
  <v-chart class="chart" :option="options" autoresize></v-chart>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'

import VChart from 'vue-echarts'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { intToString } from '@/utils/strings'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  seriesLabel: {
    type: String,
    required: true
  }
})

const series = toRef(props, 'data')

watch(series, (newVal) => {
  series.value = newVal
})

const YAxisMax = computed(() => {
  const values = props.data.map((item: any) => item[1])
  const maxValue = Math.max(...values)

  return maxValue + maxValue * 0.2
})

const options = ref({
  animation: true,
  animationEase: 'cubicIn',
  animationDuration: 500,
  grid: {
    top: 0,
    left: 6,
    right: 6,
    bottom: 1
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    padding: 20,
    backgroundColor: 'rgba(45,45,45)',
    borderColor: 'rgba(45,45,45)',
    textStyle: {
      color: '#CCCCCC',
      fontSize: '15px',
      lineHeight: '72'
    }
  },
  xAxis: {
    show: true,
    type: 'category',
    boundaryGap: false,
    axisLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: true,
      interval: 1,
      lineStyle: {
        color: '#36363A',
        type: [5, 5, 5], // before v5.0.0, it can only be `solid`, `dotted`, `dashed`
        dashOffset: 2,
        width: 1
      }
    }
  },
  yAxis: [
    {
      type: 'value',
      position: 'left',
      min: 0,
      max: YAxisMax.value,
      showAllSymbol: false,
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: 'Total Requests',
      type: 'line',
      yAxisIndex: 0,
      showSymbol: false,
      symbol: 'emptyCircle',
      symbolSize: 8,
      lineStyle: {
        color: '#2563eb',
        width: 1.5
      },
      itemStyle: {
        color: '#2563eb'
      },
      data: series
    }
  ]
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 197px;
}
</style>

<style lang="scss"></style>
