export default interface SourceConfigurationFlyoutFormMySQLState {
  formData: {
    label: string
    host: string
    port: number
    schema: string
    user: string
    password: string
  }
  createMode: {
    isLoading: boolean
    error: Error | null
  }
  editMode: {
    isLoading: boolean
    error: Error | null
  }
  connectionTest: {
    isLoading: boolean
    isSuccess: boolean
    error: Error | null
  }
}
