<template>
  <div class="sign-info-accordion-item">
    <h2 class="heading">
      <button
        :id="`sign-info-accordion-item-btn-${idPrefix}`"
        class="heading__btn"
        :class="isVisible && 'heading__btn--active'"
        type="button"
        :aria-expanded="isVisible"
        :aria-controls="`sign-info-accordion-item-content-${idPrefix}`"
        @click="handleClick"
      >
        <slot name="question"></slot>
      </button>
    </h2>

    <p
      v-show="isVisible"
      :id="`sign-info-accordion-item-content-${idPrefix}`"
      class="content"
      role="region"
      :aria-labelledby="`sign-info-accordion-item-btn-${idPrefix}`"
    >
      <slot name="answer"></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'

defineProps({
  idPrefix: {
    type: String,
    required: true
  }
})

const index = ref(0)

const incrementCount = inject('incrementCount') as () => number

const { activeIndex, updateActiveIndex } = inject('activeIndex') as {
  activeIndex: Ref<number>
  updateActiveIndex: (value: number) => void
}

const isVisible = computed(() => index.value === activeIndex.value)

function handleClick() {
  updateActiveIndex(index.value)
}

index.value = incrementCount()
</script>

<style scoped lang="scss">
.sign-info-accordion-item {
  margin-bottom: toRem(6px);

  &:last-child {
    margin-bottom: 0;
  }
}

.heading {
  margin-top: 0;
  margin-bottom: 0;

  &__btn {
    position: relative;
    padding: toRem(8px) toRem(26px) toRem(8px) 0;
    width: 100%;
    color: #fff;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    font-size: toRem(18px);
    font-weight: 700;
    line-height: 1.4;
    text-align: left;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: var(--primary);
      border-radius: toRem(2px);
    }

    &::before {
      right: 0;
      width: toRem(13px);
      height: toRem(3px);
    }

    &::after {
      right: toRem(5px);
      width: toRem(3px);
      height: toRem(13px);
      transition: var(--default-transition);
    }

    &--active {
      &::after {
        transform: translateY(-50%) rotate(90deg);
      }
    }

    @include mq($from: 1024px) {
      font-size: toRem(17px);
    }
  }
}

.content {
  margin-top: 0;
  margin-bottom: 0;
  font-size: toRem(16px);
  line-height: 1.5;

  &:deep(a) {
    @include link;
  }

  @include mq($from: 1024px) {
    font-size: toRem(15px);
  }
}
</style>
