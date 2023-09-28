import useQueryDetailsStore from '@/stores/query-details.store'
import useHubsStore from '@/stores/hubs.store'
import useSettingsStore from '@/stores/settings.store'
import useUserStore from '@/stores/user.store'
// Stripe store is missing intentionally

export default function useStoresReset() {
  const queryDetailsStore = useQueryDetailsStore()
  const hubsStore = useHubsStore()
  const settingsStore = useSettingsStore()
  const userStore = useUserStore()

  queryDetailsStore.$reset()
  hubsStore.$reset()
  settingsStore.$reset()
  userStore.$reset()
}
