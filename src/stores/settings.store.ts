import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import SettingsTabNames from '@/enums/components/modals/SettingsTabNames.enum'
import type SettingsStoreState from '@/types/stores/SettingsStoreState.interface'

const useSettingsStore = defineStore('settings', () => {
  const state: SettingsStoreState = reactive({
    activeTab: SettingsTabNames.PROFILE,
    isSettingsModalOpen: false
  })

  function changeTab(tabName: SettingsTabNames) {
    state.activeTab = tabName
  }

  function resetTab() {
    changeTab(SettingsTabNames.PROFILE)
  }

  function toggleSettingsModal() {
    state.isSettingsModalOpen = !state.isSettingsModalOpen
  }

  return {
    ...toRefs(state),
    changeTab,
    resetTab,
    toggleSettingsModal
  }
})

export default useSettingsStore
