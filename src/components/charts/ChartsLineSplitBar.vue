<template>
  <v-chart class="chart" :option="options" autoresize></v-chart>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'

import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

const props = defineProps({
  usersCreated: {
    type: Array,
    required: true
  },
  usersDeactivated: {
    type: Array,
    required: true
  },
  xAxis: {
    type: Array,
    required: true
  }
})

const usersCreated = toRef(props, 'usersCreated')
const usersDeactivated = toRef(props, 'usersDeactivated')
const xAxis = toRef(props, 'xAxis')

const YAxisMax = computed(() => {
  const values = usersCreated.value as number[]
  const maxValue = Math.max(...values)

  return maxValue + maxValue * 0.2
})

const YAxisMin = computed(() => {
  const values = usersDeactivated.value as number[]
  const minValue = Math.min(...values)

  const calculated = minValue + minValue * 0.2

  return Math.abs(calculated) > YAxisMax.value
    ? calculated
    : YAxisMax.value * -1
})

const options = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
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
  grid: {
    top: '0',
    left: '-45',
    right: '5',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      axisPointer: {
        shadowStyle: {
          color: 'rgba(255, 255, 255, .025)'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#36363A',
          type: [5, 5, 5], // before v5.0.0, it can only be `solid`, `dotted`, `dashed`
          dashOffset: 2,
          width: 1
        },
        symbolOffset: [5, 0]
      },
      type: 'category',
      splitLine: {
        show: true,
        interval: 0,
        lineStyle: {
          color: '#36363A',
          type: [5, 5, 5], // before v5.0.0, it can only be `solid`, `dotted`, `dashed`
          dashOffset: 2,
          width: 1
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      data: xAxis
    }
  ],
  yAxis: [
    {
      show: false,
      type: 'value',
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: 'New Accounts',
      type: 'bar',
      stack: 'Total',
      barWidth: 9,
      itemStyle: {
        color: '#2563eb',
        borderRadius: [50, 50, 0, 0]
      },
      label: {
        show: false
      },
      emphasis: {
        focus: 'series'
      },
      data: usersCreated
    },
    {
      name: 'Lost Accounts',
      type: 'bar',
      itemStyle: {
        color: '#BB3A5C',
        borderRadius: [0, 0, 50, 50]
      },
      stack: 'Total',
      label: {
        show: false
      },
      emphasis: {
        focus: 'series'
      },
      data: usersDeactivated
    }
  ]
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
