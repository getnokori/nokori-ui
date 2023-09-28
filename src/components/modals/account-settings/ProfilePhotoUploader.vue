<template>
  <div class="profile-photo-uploader">
    <div class="profile-photo-uploader__photo">
      <template v-if="user?.avatarURI">
        <img :src="avatarUrl" :alt="`${user?.firstName} ${user?.lastName}`" />
      </template>

      <template v-else>
        <IconUserSolid />
      </template>
    </div>

    <label class="profile-photo-uploader__label">
      <input
        ref="imageUploadFieldRef"
        class="profile-photo-uploader__input"
        type="file"
        accept="image/*"
        @change="uploadImage"
      />
      <template v-if="state.isLoading">
        <LoadingIndicator size="xs" color="#fff" no-padding />
      </template>

      <template v-else>
        Upload Photo
        <IconUploadRegular />
      </template>
    </label>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user.store'
import useUserAvatar from '@/composables/useUserAvatar'
import AccountsService from '@/services/accounts.service'

const imageUploadFieldRef = ref<HTMLInputElement | null>(null)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { avatarUrl } = useUserAvatar()

const state: {
  isLoading: boolean
  error: Error | null
} = reactive({
  file: null,
  isLoading: false,
  error: null
})

async function uploadImage() {
  state.error = null
  state.isLoading = true

  try {
    if (user.value) {
      const formData = new FormData()

      if (imageUploadFieldRef.value?.files?.length) {
        formData.append('file', imageUploadFieldRef.value.files[0])
        imageUploadFieldRef.value.value = ''
      }

      const { data } = await AccountsService.uploadUserAvatar(
        user.value.accountId,
        user.value.userId,
        formData
      )

      user.value.avatarURI = data.avatarURI
    }
  } catch (error: unknown) {
    state.error = error as Error
  } finally {
    state.isLoading = false
  }
}
</script>

<style scoped lang="scss">
.profile-photo-uploader {
  display: flex;
  align-items: center;

  &__photo {
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: toRem(24px);
    width: toRem(92px);
    height: toRem(92px);
    background-color: hsl(225, 7%, 22%);
    border-radius: 50%;

    & > img {
      display: block;
      width: 100%;
    }

    & > svg {
      width: toRem(48px);
      height: toRem(55px);
      fill: #777;
    }
  }

  &__input {
    position: absolute;
    z-index: -1;
    width: 0;
    height: 0;
    opacity: 0;
  }

  &__label {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding-left: toRem(15px);
    padding-right: toRem(15px);
    width: toRem(150px);
    height: toRem(42px);
    color: #fff;
    background-color: hsl(225, 7%, 22%);
    border-radius: toRem(6px);
    font-size: toRem(14px);
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: hsl(225, 7%, 25%);
    }

    &:active {
      background-color: hsl(225, 7%, 32%);
    }

    & > svg {
      flex-shrink: 0;
      margin-left: toRem(12px);
      width: toRem(16px);
      height: toRem(16px);
      fill: #e8e8e8;
    }
  }
}
</style>
