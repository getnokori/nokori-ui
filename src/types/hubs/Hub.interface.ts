import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

export default interface Hub {
  archived: 0 | 1
  createdAt: string
  hubId: string
  label: string
  updatedAt: string | null
  contents: HubContentsNode
}
