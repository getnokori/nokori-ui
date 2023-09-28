<template>
  <div class="selector" :class="classObject">
    <button
      ref="selectorBtnRef"
      class="selector__btn"
      type="button"
      @click="() => (state.isDropdownOpen = !state.isDropdownOpen)"
      @keydown="handleButtonKeydown"
    >
      <template v-if="modelValue">
        {{ modelValue.label }}
      </template>
      <template v-else>{{ placeholder }}</template>
      <IconCaretDown class="selector__icon" />
    </button>

    <Transition>
      <ul
        v-if="state.isDropdownOpen"
        ref="dropdownRef"
        class="dropdown"
        @keydown="handleDropdownKeydown"
      >
        <li v-for="item in data" :key="item.value" class="dropdown__item">
          <button
            class="dropdown__btn"
            type="button"
            @click="handleSelect(item)"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import KeyCodes from '@/enums/user-inputs/KeyCodes.enum'

type SelectValue = { label: string; value: string }

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue): void
}>()

const props = defineProps<{
  data: SelectValue[]
  modelValue: SelectValue | null
  size: 'xs' | 'md'
  placeholder?: string
}>()

const dropdownRef = ref(null)
const selectorBtnRef = ref(null)

const state = reactive({
  isDropdownOpen: false
})

onClickOutside(dropdownRef, () => (state.isDropdownOpen = false), {
  ignore: [selectorBtnRef]
})

const classObject = computed(() => {
  return {
    [`selector--${props.size}`]: props.size
  }
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

function handleSelect(value: SelectValue) {
  emit('update:modelValue', value)
  state.isDropdownOpen = false
}
</script>

<style scoped lang="scss">
.selector {
  position: relative;

  &--xs {
    .selector__btn {
      padding: 0 toRem(10px);
      height: toRem(30px);
      font-size: toRem(13px);
    }

    .selector__icon {
      margin-left: toRem(10px);
    }
  }

  &--md {
    .selector__btn {
      padding: 0 toRem(15px);
      height: toRem(42px);
      font-size: toRem(14px);
    }

    .selector__icon {
      margin-left: toRem(15px);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    color: #90939d;
    background-color: #27282c;
    border: 1px solid #2b2c2e;
    border-radius: toRem(6px);
    font-family: var(--code-font-family);
    font-weight: 500;
    line-height: normal;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #2b2c2e;
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 0.72em;
    height: 0.4285em;
    fill: currentColor;
  }
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.25em);
  left: 0;
  z-index: var(--z-index-dropdown);
  overflow-y: auto;
  margin-top: 0;
  margin-bottom: 0;
  padding: toRem(8px);
  width: toRem(266px);
  max-height: toRem(200px);
  background-color: #222326;
  border-radius: toRem(6px);
  box-shadow: 0 toRem(7px) toRem(20px) hsla(0 0% 0% / 0.28);
  list-style-type: none;
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
    border-radius: toRem(6px);
    font-size: toRem(15px);
    font-weight: 500;
    text-align: left;
    cursor: pointer;
  }
}
</style>
