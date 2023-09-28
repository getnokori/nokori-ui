import useHubsStore from '@/stores/hubs.store'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import type { Ref } from 'vue'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

export default function useHubTreeNodeEditableLabel(
  hubId: string,
  node: HubContentsNode,
  nodeLabel: Ref<string>
) {
  const hubsStore = useHubsStore()

  function activateNodeEditMode() {
    hubsStore.toggleEditMode(node)
  }

  function resetNodeEditMode() {
    // Delete newly created node without provided label
    if (!node.label && !nodeLabel.value) {
      hubsStore.deleteNode(node)
    } else {
      // Put the old label value back to input v-model
      //   if user accidentally clears the edit field
      if (!nodeLabel.value) {
        nodeLabel.value = node.label
      }

      hubsStore.toggleEditMode(node)
    }
  }

  function saveNodeLabel() {
    hubsStore.toggleEditMode(node)

    if (nodeLabel.value !== node.label) {
      switch (node.nodeType) {
        case NodeTypes.ROOT: {
          hubsStore.updateHubLabel(hubId, node, nodeLabel.value)
          break
        }

        case NodeTypes.FOLDER: {
          if (!node.label) {
            // Create mode
            hubsStore.saveNode(hubId, node, nodeLabel.value)
          } else {
            // Update mode
            hubsStore.updateNodeLabel(hubId, node, nodeLabel.value)
          }
          break
        }

        case NodeTypes.QUERY: {
          if (!node.label) {
            // Create mode
            hubsStore.createQuery(hubId, node, nodeLabel.value)
          } else {
            // Update mode
            hubsStore.updateQueryLabel(hubId, node, nodeLabel.value)
          }
          break
        }
      }
    }
  }

  return {
    activateNodeEditMode,
    resetNodeEditMode,
    saveNodeLabel
  }
}
