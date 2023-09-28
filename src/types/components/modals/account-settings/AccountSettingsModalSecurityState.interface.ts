export default interface AccountSettingsModalSecurityState {
  apiKey: {
    value: string
    isConfirmationModalOpen: boolean
    fetching: {
      isLoading: boolean
      error: Error | null
    }
    refreshing: {
      isLoading: boolean
      error: Error | null
    }
  }
  password: {
    isLoading: boolean
    error: Error | null
  }
}
