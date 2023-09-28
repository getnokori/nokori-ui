<template>
  <section class="h-full flex relative bg-[#202125]">
    <FullScreenLoader v-if="state.isLoading" />
    <AuthSidebar />
    <div class="flex col w-full">
      <!-- div area -->
      <div class="pt-6 px-7 w-full">
        <div class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 ml-0">
          <h1 class="text-2xl font-normal tracking-normal">Users</h1>
        </div>
        <div class="flex items-center">
          <div
            class="max-w-md w-80 flex relative mt-2 rounded-md shadow-sm mb-2"
          >
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center bg-none pl-2"
            >
              <MagnifyingGlassIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id="email"
              v-model="state.searchQuery"
              type="text"
              name="email"
              :class="[
                state.searchQuery !== '' ? 'bg-white/5' : '',
                'block w-full rounded-md text-base tracking-normal bg-[#202125] border-0 py-1.5 pl-10 text-zinc-100 ring-0 placeholder:text-zinc-500 focus:bg-white/5 focus:ring-0 focus:ring-offset-0'
              ]"
              placeholder="Search users by name, email, or id"
            />
            <div
              v-if="state.searchQuery !== ''"
              class="flex items-center ml-2 cursor-pointer text-gray-400/50 hover:text-gray-400/80"
              @click="handleClearSearch"
            >
              <XCircleIcon class="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div class="mb-5">
          <TableUsersWithStatusIndicators
            :users="state.users"
            @row-clicked="handleRowClicked"
          />
        </div>
        <div class="mb-10">
          <PaginationSimple
            :total-count="state.resultsCount"
            :current-page-index="currentPageIndex"
            @update:current-page-index="handlePageIndexUpdate"
          />
        </div>
        <Teleport to="body">
          <UserProfileFlyout
            v-if="state.userId"
            :user-id="state.userId"
            @close="handleModalClose"
          />
        </Teleport>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserService from '@/services/auth/users.service'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { debounce } from 'lodash'
import type { UsersAllDTO } from '@/types/auth/users.type'
import RouteNames from '@/enums/RouteNames.enum'

const router = useRouter()
const route = useRoute()

const state = reactive({
  isLoading: false,
  users: [] as UsersAllDTO[],
  searchQuery: (route.query.q as string) || '',
  resultsCount: 0,
  userId: null as string | null
})

const props = defineProps({
  userId: {
    type: String,
    required: false
  }
})

onMounted(() => {
  if (props.userId) {
    state.userId = props.userId
    return
  }
})

const currentPageIndex = ref(parseInt(route.query.page as string) || 1)

function handlePageIndexUpdate(event: any) {
  currentPageIndex.value = event
}

function handleClearSearch() {
  state.searchQuery = ''
}

// watch for changes in currentPageIndex
watch(currentPageIndex, (newPage) => {
  // update URL with new page number
  router.push({ query: { ...router.currentRoute.value.query, page: newPage } })
  fetchUsers()
})

watch(
  () => state.searchQuery,
  debounce(async (newVal: string) => {
    currentPageIndex.value = 1
    router.push({
      query: { ...router.currentRoute.value.query, q: state.searchQuery }
    })
    fetchUsers()
  }, 500)
)

async function fetchUsers() {
  state.isLoading = true // need to do a local search indicator instead
  state.users = []

  try {
    const searchString =
      state.searchQuery && state.searchQuery !== '' ? state.searchQuery : null
    const offset =
      currentPageIndex.value - 1 > 0 ? currentPageIndex.value - 1 : 0
    const users = await UserService.getUsers(offset, 15, searchString)
    if (users.data) {
      state.users = users.data.users
      state.resultsCount = users.data.count
    }
  } catch (error: any) {
    state.isLoading = false
  } finally {
    state.isLoading = false
  }
}

function handleRowClicked(user: UsersAllDTO) {
  state.userId = user.userId
  router.replace({
    name: RouteNames.AUTH_USERS,
    params: { userId: state.userId }
  })
}

function handleModalClose() {
  state.userId = null
  state.isLoading = true
  router.replace({ name: RouteNames.AUTH_USERS, params: {} })
  fetchUsers()
}

fetchUsers()
</script>
<style>
body {
  background-color: #202125;
}
</style>
