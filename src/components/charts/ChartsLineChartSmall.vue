<template>
  <v-chart class="chart" :option="options" autoresize></v-chart>
</template>

<script setup lang="ts">
import { computed, toRef, ref, reactive, watch } from 'vue'

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
  label: {
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
    top: 35,
    left: 6,
    right: 6,
    bottom: 35
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    backgroundColor: '#303136',
    borderColor: '#303136',
    borderWidth: 0,
    padding: 0,
    formatter: (params: any) => {
      const htmlDate = `<div class="chart-tooltip__date">${props.label}</div>`
      const htmlDataTable = params
        .map((item: any) => {
          const value = `<span class="">${item.value[1]}</span>`

          return `
                <div class="chart-tooltip__row">
                  <div class="chart-tooltip__item">${item.value[0]}</div>
                </div>
                <div class="chart-tooltip__row">
                  <div class="chart-tooltip__item big">${intToString(
                    item.value[1]
                  )}</div>
                </div>
              `
        })
        .join('')

      return `
            <div class="chart-tooltip">
              ${htmlDate}
              ${htmlDataTable}
            </div>
          `
    }
  },
  xAxis: {
    show: true,
    type: 'category',
    boundaryGap: false,

    axisLine: {
      show: true,
      lineStyle: {
        color: '#2a2a2d'
      }
    },
    axisLabel: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
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
      name: props.label,
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
        color: '#109A55'
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

<style lang="scss">
.chart-tooltip {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  width: 10.7rem;
  color: #fff;
  background-color: #000;
  border-radius: 0.5rem;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;

  &__date {
    margin-bottom: 1.5rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__item {
    > .green {
      color: #109a55;
    }

    > .purple {
      color: #8d65f4;
    }

    > .blue {
      color: #3b82f6;
    }
  }
}
</style>
