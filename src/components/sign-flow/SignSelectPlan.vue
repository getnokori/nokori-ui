<template>
  <div class="sign-select-plan">
    <div class="header">
      <div class="header__label">Your plan:</div>

      <label class="toggle">
        Monthly
        <input v-model="state.checked" class="toggle__input" type="checkbox" />
        Annually
      </label>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  isAnually: boolean
}>()

const emit = defineEmits(['planPeriodChanged'])

const state = reactive({
  checked: props.isAnually
})

watch(
  () => state.checked,
  (checked) => {
    emit('planPeriodChanged', checked)
  }
)
</script>

<style scoped lang="scss">
.sign-select-plan {
  --toggle-padding-x: #{toEm(3px)};
  --toggle-width: #{toEm(27px)};
  --toggle-height: #{toEm(17px)};
  --toggle-circle-size: #{toEm(11px)};
}

.sign-select-plan {
  // margin-bottom: toRem(26px);
  padding-bottom: toRem(16px);
  border-bottom: 1px solid #444c56;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: toRem(16px);

  &__label {
    color: #dadada;
    font-size: toRem(16px);
    font-weight: 500;
    line-height: 1.2;
  }
}

.toggle {
  display: flex;
  align-items: center;
  color: #dadada;
  font-size: toRem(16px);
  font-weight: 500;
  line-height: 1.2;
  cursor: pointer;

  &__input {
    display: grid;
    place-items: center start;
    margin: 0 toEm(7px);
    padding: 0 var(--toggle-padding-x);
    width: var(--toggle-width);
    height: var(--toggle-height);
    background-color: #3a3c3d;
    border: 0;
    border-radius: toRem(100px);
    outline: 0;
    font: inherit;
    transition: var(--default-transition);
    appearance: none;
    cursor: pointer;

    &::before {
      content: '';
      width: var(--toggle-circle-size);
      height: var(--toggle-circle-size);
      background-color: #fff;
      border-radius: 50%;
      transition: var(--default-transition);
    }

    &:checked {
      background-color: #00cf65;

      &::before {
        transform: translateX(
          calc(
            var(--toggle-width) - var(--toggle-circle-size) -
              var(--toggle-padding-x) * 2
          )
        );
      }
    }

    &:focus {
      box-shadow: 0 0 0 toRem(2px) var(--primary-focus);
    }
  }
}
</style>
