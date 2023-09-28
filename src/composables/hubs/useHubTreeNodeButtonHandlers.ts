import { nextTick, ref } from 'vue'
import useHubsStore from '@/stores/hubs.store'
import useHubTreeNodeEditableLabel from '@/composables/hubs/useHubTreeNodeEditableLabel'
import useHubTreeNodeDropdown from '@/composables/hubs/useHubTreeNodeDropdown'
import KeyCodes from '@/enums/user-inputs/KeyCodes.enum'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import NodeSubTypes from '@/enums/hubs/NodeSubTypes.enum'
import type { Ref } from 'vue'
import type HubTreeNode from '@/components/hubs/HubTreeNode.vue'
import type HubTreeNodeEditField from '@/components/hubs/HubTreeNodeEditField.vue'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

export default function useHubTreeNodeButtonHandlers(
  hubId: string,
  node: HubContentsNode,
  nodeLabel: Ref<string>
) {
  const nodeRef = ref<InstanceType<typeof HubTreeNode> | null>(null)
  const editFieldRef = ref<InstanceType<typeof HubTreeNodeEditField> | null>(
    null
  )

  const {
    selectQuery,
    toggleNode,
    toggleSourceSelectorFlyout,
    toggleSourceConfigurationFlyoutInEditMode
  } = useHubsStore()

  const { isDropdownOpen, toggleDropdown } = useHubTreeNodeDropdown()

  // prettier-ignore
  const {
    activateNodeEditMode,
    resetNodeEditMode,
    saveNodeLabel
  } = useHubTreeNodeEditableLabel(hubId, node, nodeLabel)

  function handleClick(event?: MouseEvent) {
    switch (node.nodeType) {
      case NodeTypes.ROOT: {
        // `detail` is a way to detect mouse clicks only
        // `Enter` key toggles edit mode
        if (!event || event.detail) {
          if (!node.isEditModeOn && node.children) {
            toggleNode(node)
          }
        }

        break
      }

      case NodeTypes.CATEGORY:
      case NodeTypes.FOLDER: {
        if (!node.isEditModeOn && node.children) {
          toggleNode(node)
        }

        break
      }

      case NodeTypes.SOURCE: {
        handleConfigureButtonClick()
        break
      }

      case NodeTypes.QUERY: {
        if (!node.isEditModeOn) {
          if (!event || event.detail) {
            selectQuery(node)
          }
        }

        break
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    const buttonElement = event.target as HTMLButtonElement
    const nodeElement = buttonElement.closest('.node') as HTMLLIElement
    const sidebarTreeRoot = nodeElement.closest(
      '.hubs-sidebar__tree'
    ) as HTMLDivElement
    const treeNodeList = sidebarTreeRoot.querySelectorAll('.node')

    const currentNodeIndex = Array.from(treeNodeList).findIndex((node) =>
      node.isEqualNode(nodeElement)
    )

    switch (event.code) {
      case KeyCodes.ARROW_DOWN: {
        event.preventDefault()

        if (!node.isEditModeOn) {
          const nextNodeElement = treeNodeList.item(
            currentNodeIndex + 1
          ) as HTMLLIElement | null

          if (nextNodeElement) {
            focusNode(nextNodeElement)
          }
        }

        break
      }

      case KeyCodes.ARROW_UP: {
        event.preventDefault()

        if (!node.isEditModeOn) {
          const previousNodeElement = treeNodeList.item(
            currentNodeIndex - 1
          ) as HTMLLIElement | null

          if (previousNodeElement) {
            focusNode(previousNodeElement)
          }
        }

        break
      }

      case KeyCodes.ARROW_LEFT: {
        if (!node.isEditModeOn) {
          if (node.isExpanded) {
            handleClick()
          } else {
            const parentElement = nodeElement.parentElement as HTMLUListElement
            const parentNodeElement = parentElement?.closest(
              '.node'
            ) as HTMLLIElement

            if (parentNodeElement) {
              focusNode(parentNodeElement)
            }
          }
        }

        break
      }

      case KeyCodes.ARROW_RIGHT: {
        if (!node.isEditModeOn && node.children) {
          if (!node.isExpanded) {
            handleClick()
          } else {
            const firstChildNodeElement = nodeElement.querySelector(
              '.node'
            ) as HTMLLIElement

            focusNode(firstChildNodeElement)
          }
        }

        break
      }

      case KeyCodes.ENTER: {
        switch (node.nodeType) {
          case NodeTypes.ROOT:
          case NodeTypes.FOLDER:
          case NodeTypes.QUERY: {
            if (!node.isEditModeOn) {
              activateNodeEditMode()
              nextTick(() => {
                ;(editFieldRef.value?.fieldRef as HTMLInputElement).focus()
              })
            } else {
              if (nodeLabel.value) {
                saveNodeLabel()
              } else {
                resetNodeEditMode()
              }

              focusNode(nodeRef.value?.nodeRef as HTMLLIElement)
            }

            break
          }
        }

        break
      }

      case KeyCodes.TAB: {
        switch (node.nodeType) {
          case NodeTypes.ROOT:
          case NodeTypes.FOLDER:
          case NodeTypes.QUERY: {
            if (node.isEditModeOn) {
              resetNodeEditMode()
            }

            break
          }
        }

        break
      }

      case KeyCodes.ESCAPE: {
        switch (node.nodeType) {
          case NodeTypes.ROOT:
          case NodeTypes.FOLDER:
          case NodeTypes.QUERY: {
            if (node.isEditModeOn) {
              resetNodeEditMode()
              focusNode(nodeRef.value?.nodeRef as HTMLLIElement)
            }

            break
          }
        }

        break
      }

      case KeyCodes.SPACE: {
        switch (node.nodeType) {
          case NodeTypes.ROOT:
          case NodeTypes.CATEGORY:
          case NodeTypes.FOLDER:
          case NodeTypes.SOURCE: {
            if (!node.isEditModeOn && node.children) {
              event.preventDefault()
              toggleNode(node)
            }

            break
          }

          case NodeTypes.QUERY: {
            if (!node.isEditModeOn) {
              selectQuery(node)
            }

            break
          }
        }

        break
      }
    }
  }

  function handleAddButtonClick() {
    switch (node.nodeType) {
      case NodeTypes.CATEGORY: {
        switch (node.nodeSubType) {
          case NodeSubTypes.QUERIES: {
            toggleDropdown()
            break
          }

          case NodeSubTypes.SOURCES: {
            toggleSourceSelectorFlyout(node.nodeId)
            break
          }
        }

        break
      }

      case NodeTypes.FOLDER: {
        toggleDropdown()
        break
      }
    }
  }

  function handleConfigureButtonClick() {
    switch (node.nodeType) {
      case NodeTypes.SOURCE: {
        toggleSourceConfigurationFlyoutInEditMode(node)
        break
      }
    }
  }

  function handleAddButtonKeydown(event: KeyboardEvent) {
    const buttonElement = event.target as HTMLButtonElement
    const nodeElement = buttonElement.closest('.node') as HTMLLIElement
    const dropdownElement = nodeElement.querySelector(
      '.dropdown'
    ) as HTMLUListElement

    switch (event.code) {
      case KeyCodes.ARROW_DOWN: {
        if (!isDropdownOpen.value) {
          toggleDropdown()
        } else {
          focusNode(dropdownElement)
        }

        break
      }

      case KeyCodes.ESCAPE: {
        toggleDropdown()
        break
      }
    }
  }

  function focusNode(node: HTMLElement) {
    const wrapperElement = node.firstElementChild as HTMLElement
    const buttonElement = wrapperElement.firstElementChild as HTMLButtonElement

    buttonElement.focus()
  }

  return {
    nodeRef,
    editFieldRef,
    handleClick,
    handleKeydown,
    handleAddButtonClick,
    handleConfigureButtonClick,
    handleAddButtonKeydown,
    isDropdownOpen,
    toggleDropdown
  }
}
