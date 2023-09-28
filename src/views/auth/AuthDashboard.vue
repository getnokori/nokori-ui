<template>
  <section class="h-full flex relative bg-[#202125]">
    <FullScreenLoader v-if="state.isLoading" />
    <AuthSidebar />
    <div class="flex col w-full">
      <!-- div area -->
      <div class="pt-6 px-7 w-full">
        <div class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-5 ml-0">
          <h2 class="text-2xl font-normal tracking-normal">Users Overview</h2>
        </div>
        <div
          class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-5 -ml-4"
        >
          <div class="date">
            <PeriodSelector
              v-model="state.dateRange"
              @updated-dates="handleCalendarUpdate"
            />
          </div>
          <div class="hidden md:flex items-center ml-auto">
            <div class="flex items-center ml-auto">
              <span
                class="flex-shrink-0 w-[10px] h-[10px] rounded-full mr-1.5 border-2 border-wtf-majorelle"
              >
              </span>
              <span
                class="text-15 whitespace-nowrap text-grey dark:text-dark-grey"
              >
                New Users
              </span>
            </div>
            <div class="flex items-center ml-2">
              <span
                class="flex-shrink-0 w-[10px] h-[10px] rounded-full mr-1.5 border-2 border-[#bb3a5c]"
              ></span>
              <span
                class="text-13 whitespace-nowrap text-grey dark:text-dark-grey"
                data-v-54ccee02=""
              >
                Lost Users
              </span>
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="mb-2 pb-5 w-full">
            <div class="mb-2">
              <div class="pl-1 flex items-center overflow-visible mb-3">
                <!-- <div class="menu">
                  <span class="text-15 font-medium text-zinc-400"
                    >New vs Lost</span
                  >
                </div> -->
              </div>
              <div class="flex items-center">
                <h3 class="text-4xl pl-1 leading-5 mb-2 mt-2">
                  {{
                    state.totalUsers.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })
                  }}
                </h3>
                <!---->
              </div>
              <p class="text-zinc-400 text-sm mb-2 pl-1">Net New Users</p>
            </div>
            <div class="w-full grid relative h-[16rem] mt-4 -ml-0">
              <ChartsLineSplitBar
                :users-created="state.chart.data.createdUsers"
                :users-deactivated="state.chart.data.deactivatedUsers"
                :x-axis="state.chart.data.xAxis"
              />
              <!-- <ChartsLineChartBigMulti
                :series="state.chart.data"
                series-label="Total API Requests"
              /> -->
              <!-- <ChartsMailDashboardLineChartBig
                :delivered="state.chart.data.delivered"
                :failed="state.chart.data.failed"
                series-label="Total Mail Sends"
              /> -->
            </div>
            <div class="flex items-center">
              <div class="mt-0 pl-1 text-sm text-grey text-zinc-500">
                {{ state.chartDates.fromDate }}
              </div>
              <div class="ml-auto mt-0 pl-1 text-sm text-grey text-zinc-500">
                {{ state.chartDates.toDate }}
              </div>
            </div>
          </div>
        </div>

        <div class="mb-10">
          <StatsWChangeIndicators :stats="state.summaryStats" />
        </div>

        <div class="border-zinc-100 border-1 rounded-md mt-2">
          <div
            class="sm:flex sm:items-center space-y-0.5 sm:space-y-0 mb-2 ml-0"
          >
            <h2 class="text-2xl font-normal tracking-normal">Newest Users</h2>
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
                class="block w-full rounded-md text-base tracking-normal bg-[#202125] border-0 py-1.5 pl-10 text-zinc-100 ring-0 placeholder:text-zinc-500 focus:bg-white/5 focus:ring-0 focus:ring-offset-0"
                placeholder="Search users by name, email, or id"
              />
            </div>
            <div
              class="flex ml-auto mr-2 bg-zinc-700/80 px-4 py-1 rounded-full"
            >
              <a href="/auth/users" class="flex text-sm font-medium">
                View all users
                <ArrowLongRightIcon class="ml-2 w-5 leading-none" />
              </a>
            </div>
          </div>
          <div class="mb-5">
            <TableUsersWithStatusIndicators
              :users="state.users"
              @row-clicked="handleUsersRowClicked"
            />
          </div>
        </div>
      </div>
      <Teleport to="body">
        <UserProfileFlyout
          v-if="state.modal.userId"
          :user-id="state.modal.userId"
          @close="handleUserProfileModalClose"
        />
      </Teleport>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { format, sub } from 'date-fns'
import { debounce } from 'lodash'
import { ArrowLongRightIcon } from '@heroicons/vue/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import AuthStatsService from '@/services/auth/stats.service'
import AuthEvents from '../../enums/auth/events.enum'
import UserService from '@/services/auth/users.service'

const state = reactive({
  isLoading: false,
  dateRange: [sub(new Date(), { days: 30 }), new Date()] as Date[],
  users: [] as any[],
  modal: {
    userId: null as string | null
  },
  chartDates: {
    fromDate: '' as string,
    toDate: '' as string
  },
  chart: {
    data: {
      createdUsers: [] as number[] as number[],
      deactivatedUsers: [] as number[] as number[],
      xAxis: [] as string[]
    },
    isLoading: false,
    isError: false
  },
  totalUsers: 0 as number | string,
  searchQuery: '',
  summaryStats: [
    {
      name: 'Total Active Users',
      figure: 'tau',
      stat: 0,
      change: '0%',
      changeType: 'increase',
      description: 'All Time'
    },
    {
      name: 'Daily Active Users',
      stat: 0,
      figure: 'dau',
      change: '0%',
      changeType: 'increase',
      description: 'Last 30 Days'
    },
    {
      name: 'Monthly Active Users',
      stat: 0,
      figure: 'mau',
      change: '0',
      changeType: 'increase',
      description: 'Last 30 Days'
    }
  ]
})

watch(() => state.dateRange, formatChartDates)
watch(() => state.dateRange, fetchChartData)

watch(
  () => state.searchQuery,
  debounce(async (newVal) => {
    if (newVal !== '') {
      fetchRecentUsers(newVal)
    } else {
      fetchRecentUsers()
    }
  }, 500)
)

function handleCalendarUpdate(calendar: any) {
  state.dateRange = calendar
}

function formatChartDates() {
  state.chartDates.fromDate = format(state.dateRange[0], 'MMM d')
  state.chartDates.toDate = format(state.dateRange[1], 'MMM d')
}

async function fetchChartData(): Promise<void> {
  state.chart.isLoading = true
  state.totalUsers = 0

  try {
    const createdUsers = await AuthStatsService.getAuthStatsTrend(
      format(state.dateRange[0], 'yyyy-MM-dd'),
      format(state.dateRange[1], 'yyyy-MM-dd'),
      AuthEvents.USER_CREATED
    )

    const deactivatedUsers = await AuthStatsService.getAuthStatsTrend(
      format(state.dateRange[0], 'yyyy-MM-dd'),
      format(state.dateRange[1], 'yyyy-MM-dd'),
      AuthEvents.USER_DEACTIVATED
    )

    state.chart.data.createdUsers = createdUsers.data.map(
      ([date, value]: [string, number]) => value
    )
    state.chart.data.deactivatedUsers = deactivatedUsers.data.map(
      ([date, value]: [string, number]) => (value > 0 ? value * -1 : value)
    )

    state.totalUsers += createdUsers.data.reduce(
      (acc: number, [_, value]: [string, number]) => acc + value,
      0
    )

    state.totalUsers += deactivatedUsers.data.reduce(
      (acc: number, [_, value]: [string, number]) => acc + value,
      0
    )

    state.chart.data.xAxis = createdUsers.data.map(
      ([date]: [string, number]) => date
    )
  } catch {
    state.chart.isError = true
  } finally {
    state.chart.isLoading = false
  }
}

async function fetchRecentUsers(searchString: string | null = null) {
  state.isLoading = true // need to do a local search indicator instead
  state.users = []

  try {
    const users = await UserService.getUsers(0, 10, searchString)
    if (users.data) {
      state.users = users.data.users
    }
  } catch (error: any) {
    state.isLoading = false
  } finally {
    state.isLoading = false
  }
}

async function fetchSummaryStats(): Promise<void> {
  const [tau, dau, mau] = await Promise.all([
    AuthStatsService.getAuthStatsCount('tau'),
    AuthStatsService.getAuthStatsCount('dau'),
    AuthStatsService.getAuthStatsCount('mau')
  ])

  state.summaryStats[0].stat = tau.figure.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  state.summaryStats[1].stat = dau.figure.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  state.summaryStats[2].stat = mau.figure.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

function handleUsersRowClicked(user: any) {
  if (user.userId) {
    state.modal.userId = user.userId
  }
}

function handleUserProfileModalClose() {
  state.modal.userId = null
}

fetchRecentUsers()
formatChartDates()
fetchChartData()
fetchSummaryStats()
</script>

<style scoped lang="scss">
.border-wtf-majorelle {
  --tw-border-opacity: 1;
  border-color: rgba(66, 137, 247, 1);
}

.border-wtf-red {
  --tw-border-opacity: 1;
  border-color: #bb3a5c;
}
</style>
