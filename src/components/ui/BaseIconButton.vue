<template>
  <button class="base-icon-button" type="button">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.base-icon-button {
  display: inline-flex;
  margin-right: 0.15em;
  padding: 0.275em;
  background-color: transparent;
  border: 0;
  border-radius: 0.3em;
  transition: var(--default-transition);
  cursor: pointer;

  &:hover {
    background-color: hsla(222 5% 42% / 0.15);

    &:deep(svg) {
      fill: hsl(0 0% 78%);
    }
  }

  &:active {
    background-color: hsla(222 5% 42% / 0.075);
  }

  &:last-child {
    margin-right: 0;
  }

  &:deep(svg) {
    width: 1em;
    height: 1em;
    fill: hsl(222 5% 42%);
  }
}
</style>
