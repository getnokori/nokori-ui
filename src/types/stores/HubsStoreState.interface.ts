import type Hub from '@/types/hubs/Hub.interface'
import type SourceType from '@/types/hubs/SourceType.interface'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

export default interface HubsStoreState {
  searchQuery: string,
  hubs: {
    data: Hub[]
    isLoading: boolean
    error: Error | null
  }
  queries: {
    activeQuery: HubContentsNode | null
  }
  sources: {
    hubSourcesNodeId: string | null
    sourceTypeToCreate: SourceType | null
    sourceNodeToEdit: HubContentsNode | null
    isSourceSelectorFlyoutOpen: boolean
    isSourceConfigurationFlyoutOpenInCreateMode: boolean
    isSourceConfigurationFlyoutOpenInEditMode: boolean
  }
}
