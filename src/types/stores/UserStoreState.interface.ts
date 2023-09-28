export default interface UserStoreState {
  user: {
    userId: string
    accountId: string
    accountType: string
    avatarURI: string | null
    lastLoggedInAt: string
    verified: 0 | 1
    hasPassword: 0 | 1
    subscriptions: {
      planId: string | null
      hasPaymentMethod: boolean
    }
    firstName: string
    lastName: string
    email: string
    address: {
      streetAddress: string | null
      streetAddressExt: string | null
      locality: string | null
      region: string | null
      postalCode: string | null
      country: string | null
    }
    verifyRequestToken: string | null
  } | null
  isUserLoading: boolean
  isUserPaymentAndPlanCheckLoading: boolean
  userError: unknown | null
}
