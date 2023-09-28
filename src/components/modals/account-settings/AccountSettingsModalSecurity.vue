<template>
  <div class="security">
    <div class="security-section">
      <div class="security-section__header">
        <div>
          <div class="security-section__title">API Key</div>
          <p class="security-section__desc">
            Use this to access nokori via the SDK or CLI
          </p>
        </div>

        <button
          class="security-section__refresh-btn"
          type="button"
          @click="toggleConfirmationModal"
        >
          <IconRotateRightSolid />
          Refresh Key
        </button>
      </div>

      <div class="security-section__body">
        <div class="security-api">
          <template
            v-if="
              state.apiKey.fetching.isLoading ||
              state.apiKey.refreshing.isLoading
            "
          >
            <LoadingIndicator />
          </template>

          <template
            v-else-if="
              state.apiKey.fetching.error || state.apiKey.refreshing.error
            "
          >
            <template v-if="state.apiKey.fetching.error">
              <BaseError>
                {{ state.apiKey.fetching.error.message }}
              </BaseError>
            </template>

            <template v-else-if="state.apiKey.refreshing.error">
              <BaseError>
                {{ state.apiKey.refreshing.error.message }}
              </BaseError>
            </template>
          </template>

          <template v-else>
            <div class="security-api__field">
              <BaseField
                id="security-api-key"
                v-model="state.apiKey.value"
                disabled
              />
            </div>

            <div class="security-api__btn">
              <BaseButton
                v-tooltip="{
                  content: 'Copied',
                  distance: 10,
                  shown: apiKeyCopied,
                  triggers: []
                }"
                @click="copyApiKey()"
              >
                Copy Key
              </BaseButton>
            </div>
          </template>
        </div>
      </div>
    </div>

    <form class="security-section" @submit.prevent="handlePasswordChange">
      <div class="security-section__header">
        <div>
          <div class="security-section__title">Password</div>
        </div>
      </div>

      <div class="security-section__body">
        <div class="security-password">
          <div class="security-password__row">
            <div class="security-password__left-part">
              <div class="security-password__label">Password</div>
            </div>

            <div class="security-password__right-part">
              <div class="security-password__field">
                <BaseField
                  id="security-password"
                  v-model="passwordField"
                  type="password"
                  placeholder="••••••••••••••"
                  :validation-error="
                    passwordFormValidator.passwordField.$errors
                  "
                />
              </div>
            </div>
          </div>

          <div class="security-password__row">
            <div class="security-password__left-part">
              <div class="security-password__label">Confirm</div>
            </div>

            <div class="security-password__right-part">
              <div class="security-password__field">
                <BaseField
                  id="security-password-confirmation"
                  v-model="passwordConfirmationField"
                  type="password"
                  placeholder="••••••••••••••"
                  :validation-error="
                    passwordFormValidator.passwordConfirmationField.$errors
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="security-section__footer">
        <div class="security-section__btn">
          <BaseButton type="submit" :is-loading="state.password.isLoading">
            Save
          </BaseButton>
        </div>
      </div>
    </form>
  </div>

  <Teleport to="body">
    <Transition>
      <ActionConfirmationModal
        v-if="state.apiKey.isConfirmationModalOpen"
        title="Refresh API Key?"
        description="Refreshing your API key will immediately invalidate any existing sessions using the existing key."
        keyword="refresh"
        btn-label="Refresh API Key"
        @confirmed="handleAPIKeyRefresh"
        @close="toggleConfirmationModal"
      />
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { useVuelidate } from '@vuelidate/core'
import { required, sameAs, helpers } from '@vuelidate/validators'
import AuthService from '@/services/auth.service'
import RouteNames from '@/enums/RouteNames.enum'
import type AccountSettingsModalSecurityState from '@/types/components/modals/account-settings/AccountSettingsModalSecurityState.interface'

const router = useRouter()

const state: AccountSettingsModalSecurityState = reactive({
  apiKey: {
    value: '',
    isConfirmationModalOpen: false,
    fetching: {
      isLoading: false,
      error: null
    },
    refreshing: {
      isLoading: false,
      error: null
    }
  },
  password: {
    isLoading: false,
    error: null
  }
})

const passwordField = ref('')
const passwordConfirmationField = ref('')

const passwordFormValidator = useVuelidate(
  {
    passwordField: {
      required: helpers.withMessage('This field is required', required)
    },
    passwordConfirmationField: {
      sameAs: helpers.withMessage(
        'Passwords do not match',
        sameAs(passwordField)
      )
    }
  },
  { passwordField, passwordConfirmationField },
  { $lazy: true }
)

const { copy: copyApiKey, copied: apiKeyCopied } = useClipboard({
  source: state.apiKey.value
})

async function fetchAPIKey() {
  state.apiKey.fetching.error = null
  state.apiKey.fetching.isLoading = true

  try {
    const { data } = await AuthService.getAPIKey()
    state.apiKey.value = data.publicKey
  } catch (error: unknown) {
    state.apiKey.fetching.error = error as Error
  } finally {
    state.apiKey.fetching.isLoading = false
  }
}

async function handleAPIKeyRefresh() {
  toggleConfirmationModal()

  state.apiKey.refreshing.error = null
  state.apiKey.refreshing.isLoading = true

  try {
    const { data } = await AuthService.refreshAPIKey()
    state.apiKey.value = data.apiKey
  } catch (error: unknown) {
    state.apiKey.refreshing.error = error as Error
  } finally {
    state.apiKey.refreshing.isLoading = false
  }
}

async function handlePasswordChange() {
  const hasValidationErrors = await passwordFormValidator.value.$validate()

  if (!hasValidationErrors) return

  state.password.error = null
  state.password.isLoading = true

  try {
    await AuthService.changePassword(passwordField.value)
    await router.replace(RouteNames.LOGOUT)
  } catch (error: unknown) {
    state.password.error = error as Error
    // TODO: show ErrorModal with an error
  } finally {
    state.password.isLoading = false
  }
}

function toggleConfirmationModal() {
  state.apiKey.isConfirmationModalOpen = !state.apiKey.isConfirmationModalOpen
}

fetchAPIKey()
</script>

<style scoped lang="scss">
.security {
  padding-top: toRem(22px);
  padding-bottom: toRem(22px);
}

.security-section {
  margin-bottom: toRem(30px);
  padding-top: toRem(25px);
  padding-bottom: toRem(35px);
  padding-left: toRem(25px);
  padding-right: toRem(25px);
  background-color: #27282c;
  border-radius: toRem(6px);

  &:last-child {
    margin-bottom: 0;
  }

  &__header {
    display: flex;
    align-items: flex-end;
    padding-bottom: toRem(18px);
    border-bottom: 1px solid #3a3d45;
  }

  &__title {
    font-size: toRem(18px);
    font-weight: 700;
    line-height: 1.2;
  }

  &__desc {
    margin-top: toRem(12px);
    margin-bottom: 0;
    color: #dcdcdc;
    font-size: toRem(16px);
    line-height: 1.2;
  }

  &__refresh-btn {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    padding: 0;
    color: #dcdcdc;
    background-color: transparent;
    border: 0;
    outline: 0;
    font-size: toRem(16px);
    font-weight: 500;
    line-height: normal;
    white-space: nowrap;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      color: var(--primary);

      & > svg {
        fill: var(--primary);
      }
    }

    & > svg {
      margin-right: toRem(8px);
      width: toRem(14px);
      height: toRem(14px);
      fill: #dcdcdc;
      transition: var(--default-transition);
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: toRem(18px);
    border-top: 1px solid #3a3d45;
  }

  &__btn {
    & > .base-btn {
      min-width: toRem(164px);
    }
  }
}

.security-api {
  display: flex;
  justify-content: center;
  padding-top: toRem(30px);

  &__field {
    flex-grow: 1;
    margin-right: toRem(10px);

    &:deep(.base-field__input) {
      background-color: hsl(225, 7%, 22%);
      border-color: hsl(225, 7%, 22%);
    }
  }

  &__btn {
    flex-shrink: 0;
    width: 100%;
    max-width: toRem(140px);

    &:deep(.base-btn) {
      width: 100%;
    }
  }
}

.security-password {
  padding-top: toRem(30px);
  padding-bottom: toRem(30px);

  &__row {
    display: flex;
    margin-bottom: toRem(20px);

    &:last-child {
      margin-bottom: 0;
    }
  }

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
