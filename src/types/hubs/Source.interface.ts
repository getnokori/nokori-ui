import type NodeTypes from '@/enums/hubs/NodeTypes.enum'
import type SourceEngines from '@/enums/sources/SourceEngines.enum'

export default interface Source {
  hubId: string
  sourceId: string
  nodeId: string
  parentAccountId: string
  nodeType: NodeTypes.SOURCE
  engine: SourceEngines
  label: string
  createdAt: string
  updatedAt: string | null
  connectionSettings: {
    host: string
    port: number
    database: string
    user: string
    password: string
  }
}
