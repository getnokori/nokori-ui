<template>
  <nav
    class="flex items-center justify-between border-t border-white/10 px-4 sm:px-0"
  >
    <div class="-mt-px flex w-0 flex-1">
      <a
        :class="
          currentPageIndex <= 1
            ? 'inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-400 cursor-not-allowed'
            : 'inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer'
        "
        @click.prevent="goToPage(currentPageIndex - 1)"
      >
        <ArrowLongLeftIcon
          class="mr-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        Previous
      </a>
    </div>
    <div class="hidden md:-mt-px md:flex">
      <template v-for="(i, index) in getPageNumbers">
        <a
          v-if="i === '...'"
          :key="index"
          class="inline-flex items-center pointer border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
        >
          {{ i }}
        </a>
        <a
          v-if="i !== '...'"
          :key="index"
          :class="[
            i === currentPageIndex
              ? 'inline-flex items-center border-t-2 border-emerald-500 px-4 pt-4 text-sm font-medium text-emerald-600'
              : 'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-zinc-300 hover:text-zinc-700',
            'cursor-pointer'
          ]"
          @click.prevent="goToPage(+i)"
        >
          {{ i }}
        </a>
      </template>
    </div>
    <div class="-mt-px flex w-0 flex-1 justify-end">
      <a
        :class="
          currentPageIndex >= totalPages
            ? 'inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-400 cursor-not-allowed'
            : 'inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-400 cursor-pointer'
        "
        @click.prevent="goToPage(currentPageIndex + 1)"
      >
        Next
        <ArrowLongRightIcon
          class="ml-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'

const props = withDefaults(
  defineProps<{
    totalCount: number
    currentPageIndex: number
  }>(),
  {
    totalCount: 0,
    currentPageIndex: 1
  }
)

const emit = defineEmits(['update:currentPageIndex'])

const totalPages = computed(() => Math.ceil(props.totalCount / 25)) // Assuming 25 items per page

const getPageNumbers = computed(() => {
  const numbers = []
  const start = Math.max(1, props.currentPageIndex - 4)
  const end = Math.min(totalPages.value, props.currentPageIndex + 4)

  if (start > 1) {
    numbers.push(1, '...')
  }

  for (let i = start; i <= end; i++) {
    numbers.push(i)
  }

  if (end < totalPages.value) {
    numbers.push('...', totalPages)
  }

  return numbers
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  // Emit an event with the new page number so the parent component can handle it
  emit('update:currentPageIndex', page)
}

// Expose the properties and methods we want to use in our template
// defineExpose({ getPageNumbers, goToPage })
</script>
