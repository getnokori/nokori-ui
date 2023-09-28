export default interface UserProfileInfo {
  active: boolean
  accountType: string
  firstName: string
  lastName: string
  email: string
  address: {
    streetAddress: string
    streetAddressExt: string
    locality: string // City
    region: string // State
    postalCode: string
    country: string
  }
}
