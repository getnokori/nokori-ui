<template>
  <DatePicker
    v-model:value="state.selectedDates"
    range
    value-type="date"
    :clearable="false"
    prefix-class="xmx"
    :open="state.open"
    :disabled-date="(date: Date) => date > new Date()"
    @click="toggle"
    @close="handleClose"
  >
    <template #input>
      <div class="font-normal text-15">
        <button
          class="date__btn hover:bg-zinc-800 active:bg-zinc-900 h-10"
          type="button"
        >
          <template v-if="modelValue[0]"
            >{{ dateStart }} - {{ dateEnd }}</template
          >
          <template v-else>{{ placeholder }}</template>
          <ChevronDownIcon class="-mr-1 ml-2 chevron-down" aria-hidden="true" />
        </button>
      </div>
    </template>
  </DatePicker>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import { format, sub } from 'date-fns'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

import DatePicker from 'vue-datepicker-next'
import '@/assets/styles/vendor/datepicker.scss'

const props = defineProps({
  modelValue: {
    type: Array<Date>,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select Date'
  }
})

const state = reactive({
  open: false,
  selectedDates: props.modelValue,
  lastSelectedDates: props.modelValue,
  shortcuts: []
})

// {
//       text: 'Yesterday',
//       onClick() {
//         return [sub(new Date(), { days: 1 }), new Date()]
//       }
//     },
//     {
//       text: 'Past Week',
//       onClick() {
//         return [sub(new Date(), { days: 7 }), sub(new Date(), { days: 1 })]
//       }
//     },
//     {
//       text: 'Last 30 days',
//       onClick() {
//         return [sub(new Date(), { days: 30 }), sub(new Date(), { days: 1 })]
//       }
//     },
//     {
//       text: 'Month To Date',
//       onClick() {
//         const today = new Date()
//         return [
//           new Date(today.getFullYear(), today.getMonth(), 1),
//           sub(today, { days: 1 })
//         ]
//       }
//     },
//     {
//       text: 'Year To Date',
//       onClick() {
//         const today = new Date()
//         return [new Date(today.getFullYear(), 0, 1), sub(today, { days: 1 })]
//       }
//     }

const emit = defineEmits(['updatedDates'])

function handleClose() {
  state.open = false
  if (state.selectedDates !== state.lastSelectedDates) {
    state.lastSelectedDates = state.selectedDates
    emit('updatedDates', state.selectedDates)
  }
}

function toggle() {
  if (state.open) {
    state.open = false
    return
  }
  state.open = true
}

const dateStart = computed(() => format(state.selectedDates[0], 'MMMM d, yyyy'))
const dateEnd = computed(() => format(state.selectedDates[1], 'MMMM d, yyyy'))
</script>

<style lang="scss" scoped>
.chevron-down {
  width: 1.3rem !important;
  height: 1.3rem !important;
}
.date {
  display: flex;
  align-items: center;

  &__btn {
    display: flex;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 1.2rem;
    padding-right: 1.2rem;
    // height: 4.2rem;
    color: #f5f5f6;
    border: 0;
    border-radius: 0.5rem;
    outline: 0;

    // line-height: 4.2rem;
    transition: all 200ms ease;
    cursor: pointer;

    > .icon {
      &:first-child {
        transform: translateY(-0.2rem);
        margin-right: 1rem;
        width: 1.3rem;
        height: 1.5rem;
        fill: #f5f5f6;
      }

      &:last-child {
        margin-left: 1.5rem;
        width: 0.8rem;
        height: 0.5rem;
        fill: #f5f5f6;
      }
    }
  }
}

.mmx-datepicker-main {
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1);
  background-color: rgb(27, 28, 31);
}
</style>
