<template>
  <header class="header">
    <BaseContainer class="header__container" fluid>
      <RouterLink class="header__logo" :to="{ name: RouteNames.ROOT }">
        <img :src="logoUrl" alt="nokori" />
      </RouterLink>

      <nav class="header-nav">
        <ul class="header-nav__list">
          <li class="header-nav__item">
            <a
              class="header-nav__link header-nav__link--featured"
              href="https://docs.nokori.com"
              target="_blank"
            >
              Developer Docs
            </a>
          </li>
        </ul>
      </nav>

      <div class="header__profile">
        <button
          ref="profileBtnRef"
          class="header__avatar-btn"
          type="button"
          @click="
            () => (state.isProfileDropdownOpen = !state.isProfileDropdownOpen)
          "
          @keydown="handleProfileButtonKeydown"
        >
          <template v-if="user?.avatarURI">
            <img
              :src="avatarUrl"
              :alt="`${user?.firstName} ${user?.lastName}`"
            />
          </template>

          <template v-else>
            <IconUserSolid />
          </template>
        </button>

        <Transition>
          <TheProfileDropdown
            v-if="state.isProfileDropdownOpen"
            ref="profileDropdownRef"
            @keydown="handleProfileDropdownKeydown"
            @close="() => (state.isProfileDropdownOpen = false)"
          />
        </Transition>
      </div>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'
import useUserStore from '@/stores/user.store'
import useUserAvatar from '@/composables/useUserAvatar'
import KeyCodes from '@/enums/user-inputs/KeyCodes.enum'
import RouteNames from '@/enums/RouteNames.enum'
import logoUrl from '@/assets/images/logo-icon.png'

const profileBtnRef = ref(null)
const profileDropdownRef = ref(null)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { avatarUrl } = useUserAvatar()

onClickOutside(
  profileDropdownRef,
  () => (state.isProfileDropdownOpen = false),
  {
    ignore: [profileBtnRef]
  }
)

const state = reactive({
  isProfileDropdownOpen: false
})

function handleProfileButtonKeydown(event: KeyboardEvent) {
  switch (event.code) {
    case KeyCodes.ARROW_DOWN: {
      state.isProfileDropdownOpen = true
      event.preventDefault()
      break
    }

    case KeyCodes.ARROW_UP: {
      state.isProfileDropdownOpen = false
      event.preventDefault()
      break
    }

    case KeyCodes.ESCAPE: {
      state.isProfileDropdownOpen = false
      break
    }
  }
}

function handleProfileDropdownKeydown(event: KeyboardEvent) {
  switch (event.code) {
    case KeyCodes.ESCAPE: {
      state.isProfileDropdownOpen = false
      break
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  height: var(--header-height);
  background-color: #1b1c1f;
  border-bottom: 1px solid var(--section-border-color);

  &__container {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__logo {
    flex-shrink: 0;
    max-width: toRem(106px);
    margin-left: 3px;

    img {
      display: block;
      width: toRem(34px);
    }
  }

  &__profile {
    position: relative;
  }

  &__avatar-btn {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: toRem(34px);
    height: toRem(34px);
    background-color: #555;
    border: 0;
    border-radius: 50%;
    outline: 0;
    transition: var(--default-transition);
    cursor: pointer;

    svg {
      width: toRem(16px);
      height: toRem(19px);
      fill: #222;
    }

    img {
      display: block;
      width: 100%;
    }

    &:focus {
      box-shadow: 0 0 0 1px #14cae1;
    }

    &.js-active {
      box-shadow: 0 0 0 1px #14cae1;
    }
  }
}

.header-nav {
  margin-left: auto;
  margin-right: toRem(20px);

  &__list {
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style-type: none;
  }

  &__link {
    display: inline-block;
    color: #fff;
    font-size: toRem(15px);
    font-weight: 600;
    letter-spacing: toRem(0.2px);
    line-height: 1.2;
    text-decoration: none;

    &--featured {
      @include text-gradient;
    }
  }
}
</style>
