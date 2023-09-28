<template>
  <span class="node-query-type" :class="`node-query-type--${command}`">
    {{ command.toUpperCase() }}
  </span>
</template>

<script setup lang="ts">
import type MySQLCommands from '@/enums/queries/MySQLCommands.enum'
import type HTTPCommands from '@/enums/queries/HTTPCommands.enum'

defineProps<{
  command: MySQLCommands | HTTPCommands
}>()
</script>

<style scoped lang="scss">
.node-query-type {
  margin-right: 0.65em;
  min-width: 4em;
  opacity: 0.86;
  font-size: 0.8em;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: right;

  &--INSERT {
    color: #cfa100;
  }

  &--SELECT {
    color: #00cf65;
  }

  &--UPDATE {
    color: #0058d0;
  }

  &--DELETE {
    color: #cf0200;
  }

  &--GET {
    color: #00cf65;
  }

  &--HEAD {
    color: #00cf65;
  }

  &--OPTIONS {
    color: #00cf65;
  }

  &--PATCH {
    color: #cfa100;
  }

  &--PUT {
    color: #cfa100;
  }

  &--PURGE {
    color: #cf0200;
  }

  &--POST {
    color: #cfa100;
  }

  &--DELETE {
    color: #cf0200;
  }
}
</style>
