<template>
  <div class="dropdown">
    <div class="dropdown__header">
      <div class="dropdown__name">
        {{ `${user?.firstName} ${user?.lastName}` }}
      </div>
      <div class="dropdown__email">{{ user?.email }}</div>
    </div>

    <ul class="dropdown__list">
      <li class="dropdown__item">
        <button
          class="dropdown__link"
          type="button"
          @click="handleBtnClick(SettingsTabNames.PROFILE)"
        >
          <div class="dropdown__icon dropdown__icon--settings">
            <IconGear />
          </div>
          Account Settings
        </button>
      </li>

      <li class="dropdown__item">
        <button
          class="dropdown__link"
          type="button"
          @click="handleBtnClick(SettingsTabNames.BILLING)"
        >
          <div class="dropdown__icon dropdown__icon--billing">
            <IconCreditCardSolid />
          </div>
          Billing
        </button>
      </li>

      <li class="dropdown__item">
        <a :href="helpDocsLink" class="dropdown__link" target="_blank">
          <div class="dropdown__icon dropdown__icon--help">
            <IconSquareQuestionSolid />
          </div>
          Help
        </a>
      </li>
    </ul>

    <div class="dropdown__list">
      <RouterLink class="dropdown__link" :to="{ name: RouteNames.LOGOUT }">
        <div class="dropdown__icon dropdown__icon--logout">
          <IconSquareArrowDownLeftSolid />
        </div>
        Logout
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/user.store'
import useSettingsStore from '@/stores/settings.store'
import RouteNames from '@/enums/RouteNames.enum'
import SettingsTabNames from '@/enums/components/modals/SettingsTabNames.enum'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const userStore = useUserStore()
const settingsStore = useSettingsStore()

const { user } = storeToRefs(userStore)
const { activeTab } = storeToRefs(settingsStore)
const { toggleSettingsModal } = settingsStore

const helpDocsLink = import.meta.env.VITE_HELP_DOCS_URL

function handleBtnClick(defaultTab: SettingsTabNames) {
  if (defaultTab) {
    activeTab.value = defaultTab
  }

  emit('close')
  toggleSettingsModal()
}
</script>

<style scoped lang="scss">
.dropdown {
  position: absolute;
  top: calc(100% + toRem(6px));
  right: 0;
  z-index: var(--z-index-dropdown);
  width: toRem(228px);
  background-color: #27282c;
  border: 1px solid #393a40;
  border-radius: toRem(6px);
  box-shadow: 0 toRem(7px) toRem(20px) hsla(0 0% 0% / 0.28);
  transition: var(--default-transition);

  &.v-enter-from,
  &.v-leave-to {
    transform: translateY(toRem(-10px));
    opacity: 0;
  }

  &.v-enter-to,
  &.v-leave-from {
    transform: translateY(0);
    opacity: 1;
  }

  &__header {
    padding: toRem(20px) toRem(18px);
    color: #e8e8e8;
    border-bottom: 1px solid #3a3d45;
    line-height: 1.2;
    white-space: nowrap;
  }

  &__name,
  &__email {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__name {
    margin-bottom: toRem(2px);
    font-size: toRem(15px);
    font-weight: 500;
  }

  &__email {
    font-size: toRem(13px);
  }

  &__list {
    margin-top: 0;
    margin-bottom: 0;
    padding: toRem(8px) toRem(9px);
    border-bottom: 1px solid #3a3d45;
    list-style-type: none;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    padding: 0 toRem(9px);
    width: 100%;
    height: toRem(38px);
    color: #e8e8e8;
    background-color: transparent;
    border: 0;
    border-radius: toRem(4px);
    font-size: toRem(15px);
    font-weight: 500;
    line-height: toRem(38px);
    text-decoration: none;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #35373d;
    }
  }

  &__icon {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: toRem(10px);

    &--settings,
    &--help,
    &--logout,
    &--billing {
      svg {
        width: toRem(15px);
        height: toRem(15px);
      }
    }

    svg {
      fill: #e8e8e8;
    }
  }
}
</style>
