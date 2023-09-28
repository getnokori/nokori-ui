<template>
  <div class="bg-[#18181a] min-w-[225px]">
    <div class="pt-5 px-6">
      <nav class="flex flex-1 flex-col h-full">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in props.navigation" :key="item.name">
                <router-link
                  :to="item.href"
                  :class="[
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    isActive(item.href)
                      ? 'text-white-200'
                      : 'text-gray-500 hover:text-gray-200 hover:bg-zinc-800'
                  ]"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      'h-6 w-6 shrink-0',
                      isActive(item.href)
                        ? 'text-white-200'
                        : 'text-gray-500 group-hover:text-gray-100'
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useRoute } from 'vue-router'

interface NavigationItem {
  name: string
  href: string
  icon: any
  current: boolean
}

const props = defineProps({
  navigation: {
    type: Array<NavigationItem>,
    required: true
  }
})

const route = useRoute()

function isActive(href: string) {
  return route.path === href
}
</script>
