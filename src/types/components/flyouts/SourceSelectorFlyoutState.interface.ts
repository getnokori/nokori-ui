import type SourceType from '@/types/hubs/SourceType.interface'
import type SourceCategories from '@/enums/sources/SourceCategories.enum'

export default interface SourceSelectorFlyoutState {
  sourceCatalog: {
    data: SourceType[]
    isLoading: boolean
    error: Error | null
  }
  searchQuery: string
  selectedCategory: SourceCategories
  isHostedOnly: boolean
}
