import { ref } from 'vue'
import useHubTreeNodeEditableLabel from '@/composables/hubs/useHubTreeNodeEditableLabel'
import useHubTreeNodeButtonHandlers from '@/composables/hubs/useHubTreeNodeButtonHandlers'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

export default function useHubTreeNode(hubId: string, node: HubContentsNode) {
  const nodeLabel = ref(node.label)

  // prettier-ignore
  const {
    activateNodeEditMode,
    resetNodeEditMode,
    saveNodeLabel
  } = useHubTreeNodeEditableLabel(hubId, node, nodeLabel)

  // prettier-ignore
  const {
    nodeRef,
    editFieldRef,
    handleClick,
    handleKeydown,
    handleAddButtonClick,
    handleAddButtonKeydown,
    handleConfigureButtonClick,
    isDropdownOpen,
    toggleDropdown
  } = useHubTreeNodeButtonHandlers(hubId, node, nodeLabel)

  return {
    nodeLabel,
    activateNodeEditMode,
    resetNodeEditMode,
    saveNodeLabel,
    nodeRef,
    editFieldRef,
    handleClick,
    handleKeydown,
    handleAddButtonClick,
    handleAddButtonKeydown,
    handleConfigureButtonClick,
    isDropdownOpen,
    toggleDropdown
  }
}
