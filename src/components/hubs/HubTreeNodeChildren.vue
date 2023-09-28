<template>
  <ul class="node-children">
    <slot></slot>
  </ul>
</template>

<style scoped lang="scss">
.node-children {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0.8em;
  list-style-type: none;

  // Vertical lines
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: calc(0.64em + 0.6em / 2);
    bottom: 0;
    width: 1px;
    height: 100%;
    background-color: #2b2c2e;
  }
}
</style>
