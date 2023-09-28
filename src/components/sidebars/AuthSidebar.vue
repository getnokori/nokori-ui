<template>
  <SidebarDefault :navigation="navigation" />
</template>
<script lang="ts" setup>
import {
  CodeBracketSquareIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  PaperAirplaneIcon,
  EnvelopeOpenIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import IconUsersRegular from '@/components/icons/IconUsersRegular.vue'

const navigation = [
  { name: 'Dashboard', href: '/auth', icon: ChartBarSquareIcon, current: true },
  {
    name: 'Users',
    href: '/auth/users',
    icon: UserGroupIcon,
    current: false
  }
  // {
  //   name: 'Sessions',
  //   href: '/auth/sessions',
  //   icon: ClockIcon,
  //   current: false
  // }
]
// {
//   name: 'Logs',
//   href: '/mail/logs',
//   icon: CommandLineIcon,
//   current: false
// }
</script>
