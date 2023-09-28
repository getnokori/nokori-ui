export interface UsersAllDTO {
  userId: string
  email: string
  firstName: string
  lastName: string
  active: boolean
  verified: boolean
  createdAt: string
  lastLoggedInAt: string
}

export interface UsersAllAPIResponse {
  offset: number
  limit: number
  count: number
  users: UsersAllDTO[]
}

export interface UserActivityItemDTO {
  event: string
  eventDate: string
}
