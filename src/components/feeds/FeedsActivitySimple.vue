<template>
  <ul role="list" class="space-y-6">
    <li
      v-for="(activityItem, activityItemIdx) in activity"
      :key="activityItem.event"
      class="relative flex gap-x-4"
    >
      <div
        :class="[
          activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
          'absolute left-0 top-0 flex w-6 justify-center'
        ]"
      >
        <div class="w-px bg-zinc-600" />
      </div>
      <div class="relative flex h-6 w-6 flex-none items-center justify-center">
        <div
          class="h-1.5 w-1.5 rounded-full bg-zinc-700 ring-1 ring-gray-300/50"
        />
      </div>
      <p class="flex-auto py-0.5 text-xs leading-5 text-gray-400">
        {{ activityLabels[activityItem.event] }}
      </p>
      <time
        :datetime="activityItem.eventDate"
        class="flex-none py-0.5 text-xs leading-5 text-gray-400"
        >{{ timeSince(activityItem.eventDate) }}</time
      >
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import type { UserActivityItemDTO } from '@/types/auth/users.type'
import { timeSince } from '@/utils/dates'

defineProps<{
  activity: UserActivityItemDTO[]
}>()

const activityLabels: any = {
  USER_CREATED: 'Created an account.',
  USER_VERIFIED: 'Verified their account.',
  LOGGED_IN: 'Logged in.',
  LOGGED_OUT: 'Logged out.',
  PASSWORD_RECOVERY: 'Requested a password recovery.',
  PASSWORD_RESET: 'Reset their password.',
  USER_DEACTIVATED: 'Deactivated their account.'
}
</script>
