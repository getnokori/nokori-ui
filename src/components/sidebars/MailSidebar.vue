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
  EnvelopeOpenIcon
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Overview', href: '/mail', icon: ChartBarSquareIcon, current: true },
  {
    name: 'Templates',
    href: '/mail/templates',
    icon: CodeBracketSquareIcon,
    current: false
  },
  {
    name: 'Sent',
    href: '/mail/sent',
    icon: EnvelopeOpenIcon,
    current: false
  },
  {
    name: 'Settings',
    href: '/mail/settings',
    icon: Cog6ToothIcon,
    current: false
  }
]
// {
//   name: 'Logs',
//   href: '/mail/logs',
//   icon: CommandLineIcon,
//   current: false
// }
</script>
