import type { InjectionKey } from 'vue'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

export const HubTreeNodeKey = Symbol() as InjectionKey<HubContentsNode>
