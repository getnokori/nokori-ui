import type NodeTypes from '@/enums/hubs/NodeTypes.enum'
import type NodeSubTypes from '@/enums/hubs/NodeSubTypes.enum'
import type SourceEngines from '@/enums/sources/SourceEngines.enum'
import type MySQLCommands from '@/enums/queries/MySQLCommands.enum'

export default interface HubContentsNode {
  hubId: string
  nodeId: string
  parentNodeId: string | null
  nodeType: NodeTypes
  label: string
  nodeSubType?: NodeSubTypes
  engine?: SourceEngines | null
  command?: MySQLCommands
  isExpanded?: boolean
  isActive?: boolean
  isEditModeOn?: boolean
  isDirty?: boolean
  children?: HubContentsNode[]
}
