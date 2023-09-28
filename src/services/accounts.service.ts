import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'
import type UserProfileInfo from '@/types/services/accounts/UserProfileInfo.interface'

const resource = '/accounts'

export default {
  uploadUserAvatar(
    accountId: string,
    userId: string,
    file: FormData
  ): AxiosPromise<{ avatarURI: string }> {
    return BaseService.put(
      `${resource}/${accountId}/users/${userId}/avatar`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },
  updateUserProfileInfo(
    accountId: string,
    userId: string,
    formData: Partial<UserProfileInfo>
  ) {
    return BaseService.put(`${resource}/${accountId}/users/${userId}`, formData)
  },
  getAccountSetting(
    accountId: string,
    setting: string
  ): AxiosPromise<{ value: string }> {
    return BaseService.get(
      `${resource}/${accountId}/settings?setting=${setting}`
    )
  }
}
