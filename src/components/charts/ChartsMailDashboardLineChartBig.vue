<template>
  <v-chart class="chart" :option="options" autoresize></v-chart>
</template>

<script lang="ts" setup>
import { ref, computed, toRef, withDefaults } from 'vue'
import type { Ref } from 'vue'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const props = defineProps<{
  delivered: [string, number][]
  failed: [string, number][]
}>()

const deliveredSeries: Ref<[string, number][]> = toRef(props, 'delivered')
const failedSeries: Ref<[string, number][]> = toRef(props, 'failed')

const YAxisMax = computed(() => {
  const allValues: [string, number][] = [
    ...deliveredSeries.value,
    ...failedSeries.value
  ]
  const values: number[] = allValues.map((item: [string, number]) => item[1])
  const maxValue = Math.max(...values)

  return maxValue * 1.4
})

const xAxisVerticalLinesInterval = () => {
  // Meaningless numbers out of my head :)
  return Math.floor(4 * ((deliveredSeries.value.length * 0.1) / 25))
}

const options = ref({
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
    backgroundColor: '#303135',
    borderColor: '#303136',
    borderWidth: 0,
    padding: 0,
    formatter: (
      params: {
        axisValue: number
        seriesName: string
        value: [string, number]
      }[]
    ) => {
      const htmlDate = `<div class="chart-tooltip__date">${params[0].axisValue}</div>`
      const htmlDataTable = params
        .map((item) => {
          let value
          switch (item.seriesName) {
            case 'Delivered':
              value = `<span class="blue">${item.value[1]}</span>`
              break
            case 'Failed':
              value = `<span class="red">${item.value[1]}</span>`
              break
          }

          return `
                <div class="chart-tooltip__row">
                  <div class="chart-tooltip__item">${item.seriesName}</div>
                  <div class="chart-tooltip__item">${value}</div>
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
      name: 'Failed',
      type: 'line',
      yAxisIndex: 0,
      showSymbol: false,
      symbol: 'emptyCircle',
      symbolSize: 8,
      lineStyle: {
        color: '#ff8181',
        width: 2
      },
      itemStyle: {
        color: '#ff8181'
      },
      data: failedSeries
    },
    {
      name: 'Delivered',
      type: 'line',
      yAxisIndex: 0,
      showSymbol: false,
      symbol: 'emptyCircle',
      symbolSize: 8,
      lineStyle: {
        color: '#007aff',
        width: 2
      },
      itemStyle: {
        color: '#007aff'
      },
      data: deliveredSeries
    }
  ]
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 196px;
}
</style>

<style lang="scss">
.chart-tooltip {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
  width: 16.7rem;
  color: #ffffff;
  background-color: #000;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.2;

  &__date {
    margin-bottom: 1.5rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

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

    > .red {
      color: #ff8181;
    }
  }
}
</style>
