<template>
  <ul ref="dropdownRef" class="dropdown">
    <li class="dropdown__item">
      <button
        class="dropdown__btn"
        type="button"
        @click="handleClick(NodeTypes.QUERY)"
        @keydown="handleKeydown"
      >
        <IconMagnifyingGlass class="dropdown__icon dropdown__icon--query" />

        <div class="dropdown__content">
          <div class="dropdown__label">New Query</div>
          <div class="dropdown__description">Use queries to retrieve data</div>
        </div>
      </button>
    </li>

    <li class="dropdown__item">
      <button
        class="dropdown__btn"
        type="button"
        @click="handleClick(NodeTypes.FOLDER)"
        @keydown="handleKeydown"
      >
        <IconFolderClosed class="dropdown__icon" />

        <div class="dropdown__content">
          <div class="dropdown__label">New Folder</div>
          <div class="dropdown__description">Organize and group queries</div>
        </div>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import useHubsStore from '@/stores/hubs.store'
import NodeTypes from '@/enums/hubs/NodeTypes.enum'
import KeyCodes from '@/enums/user-inputs/KeyCodes.enum'
import { HubTreeNodeKey } from '@/utils/injection-keys'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const dropdownRef = ref<null | HTMLUListElement>(null)

const node = inject(HubTreeNodeKey) as HubContentsNode

const { createNode } = useHubsStore()

onClickOutside(dropdownRef, () => emit('close'))

function handleClick(nodeType: NodeTypes) {
  createNode(node, nodeType)
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  const buttonElement = event.target as HTMLButtonElement
  const dropdownElement = buttonElement.closest('.dropdown') as HTMLUListElement
  const buttonsNodeList = dropdownElement.querySelectorAll('.dropdown__btn')

  const currentButtonIndex = Array.from(buttonsNodeList).findIndex((nodeEl) =>
    nodeEl.isEqualNode(buttonElement)
  )

  switch (event.code) {
    case KeyCodes.ARROW_DOWN: {
      const nextItemElement = buttonsNodeList.item(
        currentButtonIndex + 1
      ) as HTMLButtonElement | null

      if (nextItemElement) {
        nextItemElement.focus()
      }

      break
    }

    case KeyCodes.ARROW_UP: {
      const previousItemElement = buttonsNodeList.item(
        currentButtonIndex - 1
      ) as HTMLButtonElement | null

      if (previousItemElement) {
        previousItemElement.focus()
      }

      break
    }

    case KeyCodes.ESCAPE: {
      emit('close')
      break
    }
  }
}
</script>

<style scoped lang="scss">
.dropdown {
  --border-radius: 0.4em;
}

.dropdown {
  position: absolute;
  top: 2.25em;
  right: 0;
  z-index: var(--z-index-dropdown);
  width: 16.4em;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  background-color: #222326;
  border: 1px solid #2b2c2e;
  border-radius: var(--border-radius);
  box-shadow: 0 0.5em 1.33em hsla(0 0% 0% / 0.28);
  list-style-type: none;

  &__item {
    &:first-child {
      .dropdown__btn {
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
      }
    }

    &:last-child {
      .dropdown__btn {
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }
  }

  &__btn {
    display: grid;
    grid-template-columns: 1.2em auto;
    gap: 0.5em;
    padding: 1.2em;
    width: 100%;
    background-color: transparent;
    border: 0;
    text-align: left;
    transition: var(--default-transition);
    cursor: pointer;

    &:hover {
      background-color: #27282c;
    }
  }

  &__icon {
    width: 1em;
    height: 1em;
    fill: #cacaca;

    &--query {
      transform: translateY(0.1em);
    }
  }

  &__label {
    margin-bottom: 0.2em;
    color: #dcdcdc;
    font-size: 1em;
    font-weight: 500;
  }

  &__description {
    color: #858585;
    font-size: 0.87em;
  }
}
</style>
