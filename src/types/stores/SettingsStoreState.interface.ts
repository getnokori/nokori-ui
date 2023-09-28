import type SettingsTabNames from '@/enums/components/modals/SettingsTabNames.enum'

export default interface SettingsStoreState {
  activeTab: SettingsTabNames
  isSettingsModalOpen: boolean
}
