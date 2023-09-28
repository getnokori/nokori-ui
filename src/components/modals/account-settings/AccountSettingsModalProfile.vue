<template>
  <form class="profile" @submit.prevent="handleUpdate">
    <div class="profile__body">
      <div class="profile-section">
        <div class="profile-section__left-part">
          <div class="profile-section__label">Profile Photo</div>
          <p class="profile-section__desc">
            This will be displayed on your profile
          </p>
        </div>

        <div class="profile-section__right-part">
          <ProfilePhotoUploader />
        </div>
      </div>

      <div class="profile-section">
        <div class="profile-section__left-part">
          <div class="profile-section__label">Name</div>
        </div>

        <div class="profile-section__right-part">
          <div class="profile-section__field">
            <BaseField
              id="profile-first-name"
              v-model="state.formData.firstName"
              placeholder="Johnny"
              required
            />
          </div>

          <div class="profile-section__field">
            <BaseField
              id="profile-last-name"
              v-model="state.formData.lastName"
              placeholder="Appleseed"
              required
            />
          </div>
        </div>
      </div>

      <div class="profile-section">
        <div class="profile-section__left-part">
          <div class="profile-section__label">Email</div>
        </div>

        <div class="profile-section__right-part">
          <div class="profile-section__field">
            <BaseField
              id="profile-email"
              v-model="state.formData.email"
              type="email"
              placeholder="johnny.appleseed@gmail.com"
              required
            />
          </div>
        </div>
      </div>

      <div class="profile-section">
        <div class="profile-section__left-part">
          <div class="profile-section__label">Mailing Address</div>
        </div>

        <div class="profile-section__right-part">
          <div class="profile-section__field">
            <BaseSelect
              id="profile-address-country"
              v-model="state.formData.address.country"
              required
            >
              <option value="" disabled hidden>Country</option>
              <option value="us">United States of America</option>
            </BaseSelect>
          </div>

          <div class="profile-section__field">
            <BaseField
              id="profile-address-street"
              v-model="state.formData.address.streetAddress"
              placeholder="Street Address"
              required
            />
          </div>

          <div class="profile-section__field">
            <BaseField
              id="profile-address-street-ext"
              v-model="state.formData.address.streetAddressExt"
              placeholder="Street Address Ext"
            />
          </div>

          <div class="profile-section__field">
            <BaseField
              id="profile-address-city"
              v-model="state.formData.address.locality"
              placeholder="City"
              required
            />
          </div>

          <div class="profile-section__field">
            <BaseSelect
              id="profile-address-state"
              v-model="state.formData.address.region"
              required
            >
              <option value="" disabled hidden>State</option>
              <option value="TN">Tennessee</option>
            </BaseSelect>
          </div>

          <div class="profile-section__field">
            <BaseField
              id="profile-address-zip"
              v-model="state.formData.address.postalCode"
              placeholder="Zip"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div class="profile__footer">
      <div class="profile__actions">
        <div class="profile__btn">
          <BaseButton
            btn-style="text-plain"
            type="button"
            @click="$emit('close')"
          >
            Close
          </BaseButton>
        </div>

        <div class="profile__btn profile__btn--update">
          <BaseButton :is-loading="state.isLoading" type="submit">
            Update
          </BaseButton>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user.store'
import AccountsService from '@/services/accounts.service'
import type UserProfileInfo from '@/types/services/accounts/UserProfileInfo.interface'
import type AccountSettingsModalProfileState from '@/types/components/modals/account-settings/AccountSettingsModalProfileState.interface'

defineEmits<{
  (e: 'close'): void
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { updateUserInfo } = userStore

const state: AccountSettingsModalProfileState = reactive({
  isLoading: false,
  error: null,
  formData: {
    firstName: user.value!.firstName,
    lastName: user.value!.lastName,
    email: user.value!.email,
    address: {
      streetAddress: user.value?.address.streetAddress || '',
      streetAddressExt: user.value?.address.streetAddressExt || '',
      locality: user.value?.address.locality || '',
      region: user.value?.address.region || '',
      postalCode: user.value?.address.postalCode || '',
      country: user.value?.address.country || ''
    }
  }
})

const sanitizedFormData = computed<Partial<UserProfileInfo>>(() =>
  JSON.parse(
    JSON.stringify(state.formData, (key, value) => {
      return value === '' ? undefined : value
    })
  )
)

async function handleUpdate() {
  state.error = null
  state.isLoading = true

  try {
    if (user.value) {
      await AccountsService.updateUserProfileInfo(
        user.value.accountId,
        user.value.userId,
        sanitizedFormData.value
      )

      updateUserInfo(state.formData)
    }
  } catch (error: unknown) {
    state.error = error as Error
    // TODO: show error modal
  } finally {
    state.isLoading = false
  }
}
</script>

<style scoped lang="scss">
.profile {
  &__footer {
    padding-top: toRem(28px);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__btn {
    margin-right: toRem(14px);

    &:last-child {
      margin-right: 0;
    }

    &--update {
      & > .base-btn {
        min-width: toRem(164px);
      }
    }
  }
}

.profile-section {
  display: flex;
  padding-top: toRem(28px);
  padding-bottom: toRem(28px);
  border-bottom: 1px solid #3a3d45;

  &__left-part {
    flex-shrink: 0;
    margin-right: toRem(40px);
    width: 30%;
    color: #e8e8e8;
  }

  &__label {
    padding-top: toRem(12px);
    font-size: toRem(15px);
    font-weight: 500;
    line-height: 1.2;
  }

  &__desc {
    margin-top: toRem(4px);
    margin-bottom: 0;
    font-size: toRem(15px);
    line-height: 1.5;
  }

  &__right-part {
    width: 100%;
    max-width: toRem(300px);
  }

  &__field {
    margin-bottom: toRem(10px);

    &:last-child {
      margin-bottom: 0;
    }

    &:deep(.base-field__input) {
      background-color: hsl(225, 7%, 22%);
      border-color: hsl(225, 7%, 22%);
    }

    &:deep(.base-select) {
      background-color: hsl(225, 7%, 22%);
    }

    &:deep(.base-select__input) {
      border-color: hsl(225, 7%, 22%);
    }
  }
}
</style>
