<template>
  <div>
    <dl
      class="grid grid-cols-1 divide-y divide-zinc-700 bg-white/5 overflow-hidden rounded-lg shadow md:grid-cols-3 md:divide-x md:divide-y-0"
    >
      <div v-for="item in stats" :key="item.name" class="px-4 py-5 sm:p-6">
        <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold text-white">
            {{ item.stat }}
            <div
              :class="[
                item.changeType === 'increase'
                  ? ' text-green-500'
                  : ' text-[#bb3a5c]',
                'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
              ]"
            >
              <!-- <ArrowUpIcon
                v-if="item.changeType === 'increase'"
                class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                aria-hidden="true"
              />
              <ArrowDownIcon
                v-else
                class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-[#bb3a5c]"
                aria-hidden="true"
              /> -->
              <!-- <span class="sr-only">
                {{ item.changeType === 'increase' ? 'Increased' : 'Decreased' }}
                by
              </span>
              {{ item.change }} -->
            </div>
          </div>
        </dd>
        <dt class="text-base font-medium text-zinc-300 tracking-normal">
          {{ item.name }}
        </dt>
        <dt class="text-sm font-normal tracking-normal text-zinc-400 -mt-1">
          {{ item.description }}
        </dt>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'

defineProps({
  stats: {
    type: Array as any,
    required: true
  }
})
</script>
