import type SourceCategories from '@/enums/sources/SourceCategories.enum'
import type SourceEngines from '@/enums/sources/SourceEngines.enum'

export default interface SourceType {
  id: string
  name: string
  category: SourceCategories
  engine: SourceEngines
  description: string
  website: string
  websiteAnchorText: string
  docsURL: string
  buttonText: string
  logo: string
  isConfigurable: boolean
  isHostable: boolean
}
