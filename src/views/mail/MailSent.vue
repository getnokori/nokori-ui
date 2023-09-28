<template>
  <div class="w-full flex overflow-auto relative">
    <FullScreenLoader v-if="state.isLoading" />
    <MailSidebar />
    <div class="span-6 w-full">
      <!-- div area -->
      <div class="pt-6 px-7 w-full">
        <div class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 ml-0">
          <h1 class="text-2xl font-normal tracking-normal">Sent Mail</h1>
        </div>
      </div>
      <div class="px-8 py-4">
        <TableMailWithStatusIndicators
          :emails="state.emails"
          @row-clicked="handleRowClick"
        />
      </div>
      <div class="px-8">
        <PaginationSimple
          :total-count="state.resultsCount"
          :current-page-index="currentPageIndex"
          @update:current-page-index="handlePageIndexUpdate"
        />
      </div>
    </div>
    <Teleport to="body">
      <FlyoutMailPreview
        v-if="state.emailId"
        :email-id="state.emailId"
        @close="handleModalClose"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import RouteNames from '@/enums/RouteNames.enum'
import type SentMail from '@/types/mail/SentMail.type'
import { ref, watch, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MailService from '@/services/mail/mail.service'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  emailId: {
    type: String,
    required: false
  }
})

const currentPageIndex = ref(parseInt(route.query.page as string) || 1)

// watch for changes in currentPageIndex
watch(currentPageIndex, (newPage) => {
  // update URL with new page number
  router.push({ query: { ...router.currentRoute.value.query, page: newPage } })
  fetchTableData()
})

defineExpose({ currentPageIndex })

onMounted(() => {
  if (props.emailId) {
    state.emailId = props.emailId
    return
  }
})

const state = reactive({
  emails: [] as SentMail[],
  emailId: null as string | null,
  resultsCount: 0,
  currentPage: 1,
  isLoading: true
})

function handleRowClick(email: SentMail) {
  state.emailId = email.emailId
  router.replace({
    name: RouteNames.MAIL_SENT,
    params: { emailId: email.emailId }
  })
}

function handleModalClose() {
  state.emailId = null
  router.replace({ name: RouteNames.MAIL_SENT, params: {} })
}

function handlePageIndexUpdate(event: any) {
  currentPageIndex.value = event
}

async function fetchTableData() {
  const emails = await MailService.getSentMailAll({
    page: currentPageIndex.value
  })
  if (emails?.data?.rows?.length) {
    state.emails = emails.data.rows
    state.resultsCount = emails.data.count
  } else {
    state.emails = []
  }

  state.isLoading = false
}

fetchTableData()
</script>
