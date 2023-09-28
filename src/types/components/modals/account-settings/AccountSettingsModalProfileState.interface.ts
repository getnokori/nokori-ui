export default interface AccountSettingsModalProfileState {
  isLoading: boolean
  error: Error | null
  formData: {
    firstName: string
    lastName: string
    email: string
    address: {
      streetAddress: string
      streetAddressExt: string
      locality: string
      region: string
      postalCode: string
      country: string
    }
  }
}
