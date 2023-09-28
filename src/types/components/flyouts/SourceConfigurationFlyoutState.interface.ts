import type Source from '@/types/hubs/Source.interface'

export default interface SourceConfigurationFlyoutState {
  source: {
    data: Source | null
    isLoading: boolean
    error: Error | null
  }
  deleting: {
    isLoading: boolean
    error: Error | null
  }
  isDeleteSourceModalOpen: boolean
}
