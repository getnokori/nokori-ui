<template>
  <div
    ref="modalRef"
    class="settings"
    tabindex="0"
    @keydown.esc="$emit('close')"
    @click="handleOutsideClick"
  >
    <div class="settings__container">
      <ul class="settings-sidebar">
        <li class="settings-sidebar__item">
          <button
            class="settings-sidebar__btn"
            :class="
              activeTab === SettingsTabNames.PROFILE &&
              'settings-sidebar__btn--active'
            "
            type="button"
            @click="changeTab(SettingsTabNames.PROFILE)"
          >
            <div class="settings-sidebar__icon settings-sidebar__icon--profile">
              <template v-if="user?.avatarURI">
                <img :src="avatarUrl" alt="" />
              </template>

              <template v-else>
                <IconUserSolid />
              </template>
            </div>
            My Profile
          </button>
        </li>

        <li class="settings-sidebar__item">
          <button
            class="settings-sidebar__btn"
            :class="
              activeTab === SettingsTabNames.BILLING &&
              'settings-sidebar__btn--active'
            "
            type="button"
            @click="changeTab(SettingsTabNames.BILLING)"
          >
            <div class="settings-sidebar__icon settings-sidebar__icon--billing">
              <IconCreditCardSolid />
            </div>
            Billing
          </button>
        </li>

        <!-- <li class="settings-sidebar__item">
          <button
            class="settings-sidebar__btn"
            :class="
              activeTab === SettingsTabNames.MEMBERS &&
              'settings-sidebar__btn--active'
            "
            type="button"
            @click="changeTab(SettingsTabNames.MEMBERS)"
          >
            <div class="settings-sidebar__icon settings-sidebar__icon--members">
              <IconUsersRegular />
            </div>
            Members
          </button>
        </li> -->

        <li class="settings-sidebar__item">
          <button
            class="settings-sidebar__btn"
            :class="
              activeTab === SettingsTabNames.SECURITY &&
              'settings-sidebar__btn--active'
            "
            type="button"
            @click="changeTab(SettingsTabNames.SECURITY)"
          >
            <div
              class="settings-sidebar__icon settings-sidebar__icon--security"
            >
              <IconLockRegular />
            </div>
            Security & Access
          </button>
        </li>
      </ul>

      <div class="settings__content">
        <div class="settings-header">
          <div class="settings-header__title">{{ title }}</div>

          <button
            class="settings-header__close-btn"
            type="button"
            @click="toggleSettingsModal"
          >
            <IconXmarkRegular />
          </button>
        </div>

        <AccountSettingsModalProfile
          v-if="activeTab === SettingsTabNames.PROFILE"
          @close="toggleSettingsModal"
        />

        <AccountSettingsModalBilling
          v-else-if="activeTab === SettingsTabNames.BILLING"
        />

        <AccountSettingsModalMembers
          v-else-if="activeTab === SettingsTabNames.MEMBERS"
          @close="toggleSettingsModal"
        />

        <AccountSettingsModalSecurity
          v-else-if="activeTab === SettingsTabNames.SECURITY"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user.store'
import useSettingsStore from '@/stores/settings.store'
import useBodyScrollLock from '@/composables/useBodyScrollLock'
import useUserAvatar from '@/composables/useUserAvatar'
import SettingsTabNames from '@/enums/components/modals/SettingsTabNames.enum'
import AccountSettingsModalSecurity from './AccountSettingsModalSecurity.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLDivElement | null>(null)

useBodyScrollLock(modalRef)

const userStore = useUserStore()
const settingsStore = useSettingsStore()

const { user } = storeToRefs(userStore)
const { activeTab } = storeToRefs(settingsStore)
const { changeTab, resetTab, toggleSettingsModal } = settingsStore

const { avatarUrl } = useUserAvatar()

// eslint-disable-next-line vue/return-in-computed-property
const title = computed(() => {
  switch (activeTab.value) {
    case SettingsTabNames.PROFILE: {
      return 'Profile'
    }

    case SettingsTabNames.BILLING: {
      return 'Billing'
    }

    case SettingsTabNames.MEMBERS: {
      return 'Members'
    }

    case SettingsTabNames.SECURITY: {
      return 'Security & Access'
    }
  }
})

onMounted(() => (modalRef.value as HTMLDivElement).focus())

onUnmounted(() => resetTab())

function handleOutsideClick(event: MouseEvent) {
  if (modalRef.value === event.target) {
    emit('close')
  }
}
</script>

<style scoped lang="scss">
.settings {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-modal);
  padding: toRem(50px);
  background-color: hsla(228 7% 18% / 0.6);
  outline: 0;
  transition: var(--default-transition);

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
  }

  &.v-enter-to,
  &.v-leave-from {
    opacity: 1;
  }

  &__container {
    overflow: hidden;
    display: grid;
    grid-template-columns: toRem(234px) calc(100% - toRem(234px));
    margin-left: auto;
    margin-right: auto;
    max-width: toRem(1200px);
    height: 100%;
    border: 1px solid #393a40;
    border-radius: toRem(10px);
  }

  &__content {
    overflow: auto;
    padding-top: toRem(28px);
    padding-bottom: toRem(28px);
    padding-left: toRem(45px);
    padding-right: toRem(45px);
    height: 100%;
    background-color: #222326;
  }
}

.settings-sidebar {
  margin-top: 0;
  margin-bottom: 0;
  padding: toRem(28px) toRem(10px);
  background-color: #33353c;
  list-style-type: none;

  &__item {
    margin-bottom: toRem(5px);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    padding: toRem(10px) toRem(12px);
    width: 100%;
    color: #e8e8e8;
    background-color: transparent;
    border: 0;
    border-radius: toRem(4px);
    font-size: toRem(16px);
    font-weight: 500;
    line-height: 1.2;
    text-align: left;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: rgba(#45474f, 0.93);
    }

    &--active {
      background-color: rgba(#45474f, 0.93);
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: toRem(15px);
    width: toRem(20px);
    height: toRem(20px);

    & > img {
      display: block;
      width: 100%;
      border-radius: 50%;
    }

    & > svg {
      fill: currentColor;
    }

    &--profile {
      & > svg {
        width: toRem(13px);
        height: toRem(16px);
      }
    }

    &--billing {
      & > svg {
        width: toRem(17px);
        height: toRem(14px);
      }
    }

    &--members {
      & > svg {
        width: toRem(19px);
        height: toRem(15px);
      }
    }

    &--security {
      & > svg {
        width: toRem(14px);
        height: toRem(15px);
      }
    }
  }
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: toRem(12px);
  border-bottom: 1px solid #3a3d45;

  &__title {
    color: #e8e8e8;
    font-size: toRem(24px);
    font-weight: 600;
    line-height: 1.2;
  }

  &__close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: toRem(34px);
    height: toRem(34px);
    background-color: hsl(225, 7%, 22%);
    border: 0;
    border-radius: 50%;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: hsl(225, 7%, 25%);
    }

    &:active {
      background-color: hsl(225, 7%, 32%);
    }

    & > svg {
      display: block;
      width: toRem(12px);
      height: toRem(12px);
      fill: #dcdcdc;
    }
  }
}
</style>
