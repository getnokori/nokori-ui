<template>
  <div class="selector" :class="disabled && 'selector--disabled'">
    <div
      class="selector__control"
      :class="state.isDropdownOpen && 'selector__control--open'"
    >
      <button
        class="selector__action-btn"
        type="button"
        :disabled="disabled"
        @click="handleClick('run')"
      >
        Run
        <template v-if="macos">
          <span class="selector__key">⌘+Enter</span>
        </template>

        <template v-else>
          <span class="selector__key">Ctrl+Enter</span>
        </template>
      </button>

      <button
        ref="selectorBtnRef"
        class="selector__dropdown-btn"
        type="button"
        :disabled="disabled"
        @click="() => (state.isDropdownOpen = !state.isDropdownOpen)"
        @keydown="handleButtonKeydown"
      >
        <IconCaretDown class="selector__arrow-icon" />
      </button>
    </div>

    <Transition>
      <ul
        v-if="state.isDropdownOpen"
        ref="dropdownRef"
        class="dropdown"
        @keydown="handleDropdownKeydown"
      >
        <li class="dropdown__item">
          <button
            class="dropdown__btn"
            type="button"
            @click="handleClick('save')"
          >
            Save
            <template v-if="macos">
              <span class="selector__key">⌘+S</span>
            </template>

            <template v-else>
              <span class="selector__key">Ctrl+S</span>
            </template>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { macos } from '@/utils/platform'
import KeyCodes from '@/enums/user-inputs/KeyCodes.enum'

defineProps<{
  disabled: boolean
}>()

const emit = defineEmits(['run', 'save', 'publish'])

const dropdownRef = ref(null)
const selectorBtnRef = ref(null)

const state = reactive({
  isDropdownOpen: false
})

onClickOutside(dropdownRef, () => (state.isDropdownOpen = false), {
  ignore: [selectorBtnRef]
})

function handleButtonKeydown(event: KeyboardEvent) {
  switch (event.code) {
    case KeyCodes.ARROW_DOWN: {
      state.isDropdownOpen = true
      break
    }

    case KeyCodes.ARROW_UP: {
      state.isDropdownOpen = false
      break
    }

    case KeyCodes.ESCAPE: {
      state.isDropdownOpen = false
      break
    }
  }
}

function handleDropdownKeydown(event: KeyboardEvent) {
  switch (event.code) {
    case KeyCodes.ESCAPE: {
      state.isDropdownOpen = false
      break
    }
  }
}

function handleClick(action: 'run' | 'save' | 'publish') {
  emit(action)
  state.isDropdownOpen = false
}
</script>

<style scoped lang="scss">
.selector {
  position: relative;

  &--disabled {
    .selector__action-btn,
    .selector__dropdown-btn {
      background-color: hsl(228, 6%, 11%) !important;
      border-color: hsl(228, 6%, 11%) !important;
      cursor: not-allowed;
    }
  }

  &__control {
    display: flex;
    min-width: toRem(140px);

    &--open {
      .selector__action-btn {
        border-bottom-left-radius: 0;
      }

      .selector__dropdown-btn {
        border-bottom-right-radius: 0;
      }
    }
  }

  &__action-btn {
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    padding: 0 toRem(15px);
    height: toRem(42px);
    color: #fff;
    background-color: hsl(228, 6%, 16%);
    border: 1px solid #2b2c2e;
    border-right-color: #37383b;
    border-top-left-radius: toRem(6px);
    border-bottom-left-radius: toRem(6px);
    font-size: toRem(15px);
    font-weight: 700;
    line-height: normal;
    text-align: left;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #2b2c2e;
    }
  }

  &__key {
    margin-left: toRem(5px);
    color: #90939d;
    opacity: 0.7;
    font-size: toRem(15px);
    font-weight: 600;
    letter-spacing: toRem(0.2px);
  }

  &__dropdown-btn {
    padding: 0 toRem(15px);
    height: toRem(42px);
    color: #fff;
    background-color: hsl(228, 6%, 16%);
    border: 1px solid #2b2c2e;
    border-left-color: #37383b;
    border-top-right-radius: toRem(6px);
    border-bottom-right-radius: toRem(6px);
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #2b2c2e;
    }
  }

  &__arrow-icon {
    width: toRem(11px);
    height: toRem(7px);
    fill: #858892;
  }
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--z-index-dropdown);
  margin-top: 0;
  margin-bottom: 0;
  padding: toRem(8px);
  width: 100%;
  background-color: #222326;
  border-bottom-left-radius: toRem(6px);
  border-bottom-right-radius: toRem(6px);
  box-shadow: 0 toRem(7px) toRem(20px) hsla(0 0% 0% / 0.28);
  list-style-type: none;
  transition: var(--default-transition);

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
  }

  &.v-enter-to,
  &.v-leave-from {
    opacity: 1;
  }

  &__item {
    display: block;
    overflow: hidden;
    width: 100%;
    color: #e8e8e8;
    background-color: transparent;
    border: 0;
    border-radius: toRem(6px);
    text-align: left;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #27282c;
    }
  }

  &__btn {
    display: block;
    padding: toRem(8px) toRem(10px);
    width: 100%;
    color: #e8e8e8;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    font-size: toRem(15px);
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }
}
</style>
