<template>
  <div class="w-full flex overflow-auto relative">
    <MailSidebar />
    <div class="span-6 w-full">
      <!-- div area -->
      <div class="pt-6 px-7 w-full">
        <div class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 ml-0">
          <h1 class="text-2xl font-normal tracking-normal">Mail Logs</h1>
        </div>
      </div>
      <div class="px-2">
        <TableLogsWithStatusIndicators />
      </div>
      <div class="px-8">
        <PaginationSimple />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
<style>
body {
  background-color: #202125;
}
</style>
