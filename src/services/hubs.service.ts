import BaseService from '@/services/base.service'
import type NodeTypes from '@/enums/hubs/NodeTypes.enum'

const resource = '/hubs'

export default {
  getHubs() {
    return BaseService.get(`${resource}`)
  },
  createHub(label: string) {
    const options = {
      label
    }

    return BaseService.post(`${resource}`, options)
  },
  updateHub(hubId: string, label: string) {
    const options = {
      label
    }

    return BaseService.put(`${resource}/${hubId}`, options)
  },
  getHubContents(hubId: string) {
    return BaseService.get(`${resource}/${hubId}/contents`)
  },
  saveNode(
    hubId: string,
    parentNodeId: string,
    nodeType: NodeTypes,
    label: string
  ) {
    const options = {
      parentNodeId,
      nodeType,
      label
    }

    return BaseService.post(`${resource}/${hubId}/contents`, options)
  },
  updateNode(hubId: string, nodeId: string, label: string) {
    const options = {
      nodeId,
      label
    }

    return BaseService.put(`${resource}/${hubId}/contents`, options)
  },
  moveNode(hubId: string, nodeId: string, parentNodeId: string) {
    const body = {
      parentNodeId
    }

    return BaseService.put(`${resource}/${hubId}/contents/${nodeId}`, body)
  },
  deleteNode(hubId: string, nodeId: string) {
    return BaseService.delete(`${resource}/${hubId}/contents/${nodeId}`)
  }
}
