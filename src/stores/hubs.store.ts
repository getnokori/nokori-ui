import { defineStore } from 'pinia'
import { computed, reactive, toRefs, watch } from 'vue'
import type { Query } from '@/types/hubs/Query.interface'
import useQueryDetailsStore from './query-details.store'
import HubsService from '@/services/hubs.service'
import QueriesService from '@/services/queries.service'
import Ids from '@/enums/Ids.enum'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import NodeSubTypes from '@/enums/hubs/NodeSubTypes.enum'
import MySQLCommands from '@/enums/queries/MySQLCommands.enum'
import StorageEnums from '@/enums/storage/Storage.enum'
import type Hub from '@/types/hubs/Hub.interface'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'
import type SourceType from '@/types/hubs/SourceType.interface'
import type HubsStoreState from '@/types/stores/HubsStoreState.interface'

const useHubsStore = defineStore('hubs', () => {
  const state: HubsStoreState = reactive({
    searchQuery: '',
    hubs: {
      data: [],
      isLoading: false,
      error: null
    },
    queries: {
      activeQuery: null
    },
    sources: {
      hubSourcesNodeId: null,
      sourceTypeToCreate: null,
      sourceNodeToEdit: null,
      isSourceSelectorFlyoutOpen: false,
      isSourceConfigurationFlyoutOpenInCreateMode: false,
      isSourceConfigurationFlyoutOpenInEditMode: false
    }
  })

  const filteredHubs = computed(() => {
    if (!state.searchQuery) return state.hubs.data

    const queries: HubContentsNode[] = []
    const searchQuery = state.searchQuery.toLowerCase().trim()

    for (const hub of state.hubs.data) {
      const traverseNodes = (nextNode: HubContentsNode) => {
        if (nextNode.children) {
          for (const childNode of nextNode.children) {
            if (
              childNode.nodeType === NodeTypes.QUERY &&
              childNode.label.toLowerCase().includes(searchQuery)
            ) {
              queries.push(childNode)
            } else {
              if (childNode.children) {
                traverseNodes(childNode)
              }
            }
          }
        }
      }

      // Queries only
      traverseNodes(hub.contents!.children![0])
    }

    return queries
  })

  watch(
    () => state.queries.activeQuery,
    (newActiveQuery) => {
      if (newActiveQuery) {
        localStorage.setItem(
          StorageEnums.ACTIVE_QUERY_KEY,
          newActiveQuery.nodeId
        )
      }
    }
  )

  async function fetchHubs() {
    state.hubs.error = null
    state.hubs.isLoading = true

    try {
      const { data } = await HubsService.getHubs()

      state.hubs.data = data

      if (state.hubs.data.length) {
        const requests = state.hubs.data.map((hub) =>
          HubsService.getHubContents(hub.hubId)
        )

        const responses = await Promise.all(requests)

        const contents: HubContentsNode[] = responses.map(
          (response) => response.data
        )

        console.log('contents', contents)
        const hubsContents = contents.filter((content) => content.nodeType)
        console.log(hubsContents)

        state.hubs.data.forEach((hub, index) => {
          hub.contents = hubsContents[index]
          _addCustomPropertiesToHubContents(hub)
        })
      }
    } catch (error: unknown) {
      state.hubs.error = error as Error
    } finally {
      state.hubs.isLoading = false
    }
  }

  async function updateHubLabel(
    hubId: string,
    node: HubContentsNode,
    label: string
  ) {
    try {
      node.label = label
      await HubsService.updateHub(hubId, label)
    } catch (error: unknown) {
      // TODO: add error handling in UI
    }
  }

  function createNode(parentNode: HubContentsNode, nodeType: NodeTypes) {
    if (!parentNode.children) {
      parentNode.children = []
    }

    if (!parentNode.isExpanded) {
      parentNode.isExpanded = true
    }

    switch (nodeType) {
      case NodeTypes.FOLDER: {
        parentNode.children.push({
          hubId: parentNode.hubId,
          nodeId: Ids.TEMP_NODE_ID,
          parentNodeId: parentNode.nodeId,
          nodeType: NodeTypes.FOLDER,
          label: '',
          isExpanded: false,
          isEditModeOn: true
        })

        break
      }

      case NodeTypes.QUERY: {
        parentNode.children.push({
          hubId: parentNode.hubId,
          nodeId: Ids.TEMP_NODE_ID,
          parentNodeId: parentNode.nodeId,
          nodeType: NodeTypes.QUERY,
          label: '',
          engine: null,
          isEditModeOn: true,
          isActive: false,
          isDirty: false,
          command: MySQLCommands.SELECT
        })

        break
      }
    }
  }

  async function saveNode(hubId: string, node: HubContentsNode, label: string) {
    try {
      if (!node.parentNodeId) {
        throw new Error(
          `"node.parentNodeId" shouldn't be ${node.parentNodeId}.`
        )
      }

      node.label = label

      const parentNode = _findParentNode(node)

      if (parentNode) {
        _sortNodeChildren(parentNode)
      }

      const { data } = await HubsService.saveNode(
        hubId,
        node.parentNodeId,
        node.nodeType,
        label
      )

      node.nodeId = data.nodeId
    } catch (error: unknown) {
      // TODO: add error handling in UI
    }
  }

  async function updateNodeLabel(
    hubId: string,
    node: HubContentsNode,
    label: string
  ) {
    try {
      node.label = label
      const parentNode = _findParentNode(node)

      if (parentNode) {
        _sortNodeChildren(parentNode)
      }

      await HubsService.updateNode(hubId, node.nodeId, label)
    } catch (error: unknown) {
      // TODO: add error handling in UI
    }
  }

  const resortNodesWithChildren = (
    nodes: HubContentsNode[]
  ): HubContentsNode[] => {
    return nodes.sort((a, b) => (b.children ? 1 : 0) - (a.children ? 1 : 0))
  }

  function deleteNode(node: HubContentsNode) {
    const findNode = (nextNode: HubContentsNode) => {
      if (nextNode.children) {
        for (const childNode of nextNode.children) {
          if (childNode.nodeId === node.nodeId) {
            const index = nextNode.children.findIndex(
              (item: HubContentsNode) => item.nodeId === node.nodeId
            )

            // Update child nodes' parentNodeId to match the deleted node's parentNodeId
            for (const grandChildNode of childNode.children || []) {
              grandChildNode.parentNodeId = childNode.parentNodeId
            }

            // Move child nodes to the deleted node's parent before removing the node
            nextNode.children.splice(index, 1, ...(childNode.children || []))

            // Resort the nodes so that nodes with children are at the top
            const parentNode = _findParentNode(node)
            if (parentNode) {
              _sortNodeChildren(parentNode)
            }

            if (state.queries.activeQuery?.nodeId === node.nodeId) {
              state.queries.activeQuery = null
            }

            if (!nextNode.children.length) {
              delete nextNode.children
              nextNode.isExpanded = false
            }

            break
          } else {
            if (childNode.children) {
              findNode(childNode)
            }
          }
        }
      }
    }

    const hub = _findHub(node.hubId)

    if (hub) {
      const queriesRootNode = hub.contents!.children![0]
      findNode(queriesRootNode)
    }
  }

  function moveNode(srcNodeId: string, newParentNodeId: string) {
    // Find a node with the given nodeId in the tree
    const findNode = (
      nextNode: HubContentsNode,
      nodeId: string
    ): HubContentsNode | null => {
      if (nextNode.nodeId === nodeId) {
        return nextNode
      }

      if (nextNode.children) {
        for (const childNode of nextNode.children) {
          const foundNode = findNode(childNode, nodeId)
          if (foundNode) {
            return foundNode
          }
        }
      }

      return null
    }

    const srcNode = _findNode((id: string) => id === srcNodeId)
    if (!srcNode) return null
    // Remove the node from its current location
    deleteNode(srcNode)

    // Find the new parent node
    const hub = _findHub(srcNode.hubId)
    if (!hub) {
      return null
    }

    const queriesRootNode = hub.contents!.children![0]
    const newParentNode = findNode(queriesRootNode, newParentNodeId)
    if (!newParentNode) {
      return null
    }

    // Update the node's parentNodeId
    srcNode.parentNodeId = newParentNodeId

    // Add the node to the new parent's children
    if (!newParentNode.children) {
      newParentNode.children = []
    }
    newParentNode.children.push(srcNode)

    // Resort the nodes so that nodes with children are at the top
    _sortNodeChildren(newParentNode)

    return true
  }

  async function createQuery(
    hubId: string,
    node: HubContentsNode,
    label: string
  ) {
    try {
      node.label = label

      const parentNode = _findParentNode(node)

      if (parentNode) {
        _sortNodeChildren(parentNode)
      }

      const { data } = await QueriesService.createQuery({
        hubId,
        parentNodeId: node.parentNodeId,
        label
      })

      const { meta, config } = data as Query

      node.hubId = data.meta.hubId
      node.nodeId = data.config.query.queryId
      // node['queryId']: any = data.config.query.queryId
      // node.parentNodeId = parentNode
      node.nodeType = NodeTypes.QUERY
      node.label = label

      selectQuery(node)
    } catch (error: unknown) {
      // TODO: add error handling in UI
    }
  }

  function selectQuery(node: HubContentsNode) {
    if (state.queries.activeQuery?.nodeId !== node.nodeId) {
      if (state.queries.activeQuery) {
        state.queries.activeQuery.isActive = false
      }

      node.isActive = true
      state.queries.activeQuery = node
    }
  }

  async function updateQueryLabel(
    hubId: string,
    node: HubContentsNode,
    label: string
  ) {
    try {
      const queryDetailsStore = useQueryDetailsStore()

      node.label = label

      const parentNode = _findParentNode(node)

      if (parentNode) {
        _sortNodeChildren(parentNode)
      }

      await QueriesService.updateQuery(node.nodeId, {
        meta: {
          hubId,
          label
        },
        config: {
          query: {
            queryId: node.nodeId
          }
        }
      })

      if (queryDetailsStore.savedQuery.data) {
        queryDetailsStore.savedQuery.data.meta.label = label
      }
    } catch (error: unknown) {
      // TODO: add error handling in UI
    }
  }

  async function deleteQuery(hubId: string, queryId: string) {
    const hub = _findHub(hubId)
    const rootNode = hub?.contents
    const queries = rootNode?.children?.find(
      (node) => node.nodeSubType === NodeSubTypes.QUERIES
    )

    if (queries) {
      if (queries.children) {
        const index = queries.children.findIndex(
          (query) => query.nodeId === queryId
        )

        queries.children.splice(index, 1)
      }
    }

    if (state.queries.activeQuery?.nodeId === queryId) {
      state.queries.activeQuery = null
    }
  }

  function toggleNode(node: HubContentsNode) {
    node.isExpanded = !node.isExpanded
  }

  function toggleEditMode(node: HubContentsNode) {
    node.isEditModeOn = !node.isEditModeOn
  }

  function addSource(hubId: string, source: HubContentsNode) {
    const hub = state.hubs.data.find((hub) => hub.hubId === hubId)
    const rootNode = hub?.contents
    const sources = rootNode?.children?.find(
      (node) => node.nodeSubType === NodeSubTypes.SOURCES
    )

    if (sources) {
      if (!sources.children) {
        sources.children = []
      }

      if (!sources.isExpanded) {
        sources.isExpanded = true
      }

      sources.children.push(source)
    }
  }

  function deleteSource(hubId: string, sourceId: string) {
    const hub = state.hubs.data.find((hub) => hub.hubId === hubId)
    const rootNode = hub?.contents
    const sources = rootNode?.children?.find(
      (node) => node.nodeSubType === NodeSubTypes.SOURCES
    )

    if (sources) {
      if (sources.children) {
        const index = sources.children.findIndex(
          (source) => source.nodeId === sourceId
        )
        sources.children.splice(index, 1)
      }
    }
  }

  function updateSourceNode(updatedSource: HubContentsNode) {
    if (state.sources.sourceNodeToEdit) {
      state.sources.sourceNodeToEdit.label = updatedSource.label
    }
  }

  function toggleSourceSelectorFlyout(sourcesNodeId: string | null) {
    if (sourcesNodeId) {
      state.sources.hubSourcesNodeId = sourcesNodeId
    } else {
      state.sources.hubSourcesNodeId = null
    }

    state.sources.isSourceSelectorFlyoutOpen =
      !state.sources.isSourceSelectorFlyoutOpen
  }

  function toggleSourceConfigurationFlyoutInCreateMode(
    sourceType?: SourceType
  ) {
    if (sourceType) {
      state.sources.sourceTypeToCreate = sourceType
    } else {
      state.sources.sourceTypeToCreate = null
    }

    state.sources.isSourceConfigurationFlyoutOpenInCreateMode =
      !state.sources.isSourceConfigurationFlyoutOpenInCreateMode
  }

  function toggleSourceConfigurationFlyoutInEditMode(
    sourceNode?: HubContentsNode
  ) {
    if (sourceNode) {
      state.sources.sourceNodeToEdit = sourceNode
    } else {
      state.sources.sourceNodeToEdit = null
    }

    state.sources.isSourceConfigurationFlyoutOpenInEditMode =
      !state.sources.isSourceConfigurationFlyoutOpenInEditMode
  }

  function restoreActiveQueryFromStorage() {
    const activeQueryNodeId = localStorage.getItem(
      StorageEnums.ACTIVE_QUERY_KEY
    )

    if (activeQueryNodeId) {
      const activeQueryNode = _findNode(
        (nodeId: string) => nodeId === activeQueryNodeId
      )

      if (activeQueryNode) {
        selectQuery(activeQueryNode)
      } else {
        localStorage.removeItem(StorageEnums.ACTIVE_QUERY_KEY)
      }
    }
  }

  function setQueryNodeDirtyState(nodeId: string, value: boolean) {
    const node = _findNode((id: string) => id === nodeId)

    if (node) {
      node.isDirty = value
    }
  }

  function _addCustomPropertiesToHubContents(hub: Hub) {
    const rootNode = hub.contents

    function iterateOverNodes(node: HubContentsNode) {
      switch (node.nodeType) {
        case NodeTypes.ROOT:
        case NodeTypes.FOLDER:
          node.isEditModeOn = false
          node.isExpanded = false
          break

        case NodeTypes.QUERY:
          node.isActive = false
          node.isEditModeOn = false
          break
      }

      if (node.children) {
        for (const childNode of node.children) {
          iterateOverNodes(childNode)
        }
      }
    }

    iterateOverNodes(rootNode)
  }

  function _findHub(hubId: string) {
    return state.hubs.data.find((hub) => hub.hubId === hubId)
  }

  function _findNode(
    testCallback: (nodeId: string) => boolean
  ): HubContentsNode | null {
    let result: HubContentsNode | null = null

    const traverseNodes = (nextNode: HubContentsNode) => {
      if (testCallback(nextNode.nodeId)) {
        result = nextNode
      } else {
        if (nextNode.children) {
          for (const childNode of nextNode.children) {
            if (result) break
            traverseNodes(childNode)
          }
        }
      }
    }

    for (const hub of state.hubs.data) {
      if (result) break
      traverseNodes(hub.contents!.children![0])
    }

    return result
  }

  function findNodeById(nodeId: string) {
    return _findNode((id: string) => id === nodeId)
  }

  function _findParentNode(node: HubContentsNode): HubContentsNode | null {
    let parentNode: HubContentsNode | null = null

    const findParentNode = (nextNode: HubContentsNode) => {
      if (nextNode.nodeId === node.parentNodeId) {
        parentNode = nextNode
      } else {
        if (nextNode.children) {
          for (const childNode of nextNode.children) {
            if (parentNode) break

            if (childNode.nodeType === NodeTypes.FOLDER) {
              findParentNode(childNode)
            }
          }
        }
      }
    }

    const hub = _findHub(node.hubId)

    if (hub) {
      const queriesRootNode = hub.contents!.children![0]
      findParentNode(queriesRootNode)
    }

    return parentNode
  }

  function _sortNodeChildren(node: HubContentsNode) {
    if (!node.children) {
      return
    }

    node.children.sort((nodeA: HubContentsNode, nodeB: HubContentsNode) => {
      switch (nodeA.nodeType) {
        case NodeTypes.FOLDER: {
          switch (nodeB.nodeType) {
            case NodeTypes.FOLDER: {
              return nodeA.label.localeCompare(nodeB.label)
            }

            case NodeTypes.QUERY: {
              return -1
            }
          }

          break
        }

        case NodeTypes.QUERY: {
          switch (nodeB.nodeType) {
            case NodeTypes.FOLDER: {
              return 1
            }

            case NodeTypes.QUERY: {
              return nodeA.label.localeCompare(nodeB.label)
            }
          }

          break
        }
      }

      // NodeTypes.TABLE
      return nodeA.label.localeCompare(nodeB.label)
    })
  }

  return {
    ...toRefs(state),
    addSource,
    createNode,
    createQuery,
    deleteNode,
    deleteQuery,
    deleteSource,
    fetchHubs,
    filteredHubs,
    findNodeById,
    moveNode,
    restoreActiveQueryFromStorage,
    saveNode,
    selectQuery,
    setQueryNodeDirtyState,
    toggleEditMode,
    toggleNode,
    toggleSourceConfigurationFlyoutInCreateMode,
    toggleSourceConfigurationFlyoutInEditMode,
    toggleSourceSelectorFlyout,
    updateHubLabel,
    updateNodeLabel,
    updateQueryLabel,
    updateSourceNode
  }
})

export default useHubsStore
