export default interface HubTreeNodeQueryState {
  deleting: {
    isLoading: boolean
    error: Error | null
  }
  isDeleteQueryModalOpen: boolean
}
