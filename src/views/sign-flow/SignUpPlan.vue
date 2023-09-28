<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody>
        <SignInfo>
          <SignInfoHeader>
            <template #title>Top Up Your Account</template>

            <template #text>
              Let's add some funds to your account and then you'll be ready to
              go. All nokori services are usage based.
            </template>
          </SignInfoHeader>

          <SignInfoList>
            <!-- <SignInfoListItem>
              <template #title>
                Query your database directly from the browser
              </template>

              <template #description>
                lolaDB empowers app developers to bypass building a data API,
                and execute queries against their favorite databases without
                learning new languages or query concepts.
              </template>
            </SignInfoListItem>

            <SignInfoListItem>
              <template #title>
                Connect your database directly from your app
              </template>

              <template #description>
                Whether from the browser, Node, Laravel, Django, .NET, or native
                code, lolaDB makes it possible to reach all of your data through
                a single, consistent code interface that’s reachable across your
                entire tech stack.
              </template>
            </SignInfoListItem> -->
          </SignInfoList>
        </SignInfo>

        <SignCardWrapper>
          <SignCard title="Choose Your Plan" :error="state.subscription.error">
            <template v-if="state.plans.isLoading">
              <LoadingIndicator />
            </template>

            <template v-else-if="state.plans.error">
              {{ state.plans.error.message }}
            </template>

            <template v-else>
              <SignForm @submit.prevent="handleSubscription">
                <SignSelectPlan
                  :is-anually="state.isAnually"
                  @plan-period-changed="
                    (checked) => (state.isAnually = checked)
                  "
                >
                  <SignRadioField
                    v-for="plan in filteredPlans"
                    :id="plan.planId"
                    :key="plan.planId"
                    v-model="state.selectedPlan"
                    :value="plan.planId"
                  >
                    {{ plan.name }}: ${{ plan.amount }} / Month
                  </SignRadioField>
                </SignSelectPlan>

                <BaseButton
                  type="submit"
                  :style="{ width: '100%', marginTop: '1.75rem' }"
                  :is-loading="state.subscription.isLoading"
                >
                  Select Plan
                </BaseButton>
              </SignForm>
            </template>
          </SignCard>

          <SignPlanComparisonLink />
        </SignCardWrapper>
      </SignBody>
    </BaseContainer>

    <SignFooter />
  </SignWrapper>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user.store'
import nk from '@/services/nokori.service'
import ContainerWidths from '@/enums/ContainerWidths.enum'
import RouteNames from '@/enums/RouteNames.enum'
import type { SignUpPlanState } from '@/types/views/SignUpPlanState.interface'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const state: SignUpPlanState = reactive({
  isAnually: true,
  plans: {
    data: null,
    isLoading: false,
    error: null
  },
  subscription: {
    data: null,
    isLoading: false,
    error: null
  },
  selectedPlan: ''
})

const monthlyPlans = computed(() => {
  return state?.plans?.data
    ?.filter((plan) => plan.frequency === 'monthly')
    .sort((plan) => +plan.amount)
})

const anuallyPlans = computed(() => {
  return state?.plans?.data
    ?.filter((plan) => plan.frequency === 'annually')
    .sort((plan) => +plan.amount)
})

const filteredPlans = computed(() =>
  state.isAnually ? anuallyPlans.value : monthlyPlans.value
)

watch(() => state.isAnually, selectDefaultPlan)

// Attempts to fetch the 'middle' plan as default
function selectDefaultPlan(isAnnually: boolean) {
  const items = state.plans.data
  if (items?.length === 0 || !items) {
    return null
  }

  let minPrice = +items[0].amount || 0
  let maxPrice = +items[0].amount || 0

  // Find the minimum and maximum price values
  for (const item of items) {
    if (isAnnually && item.frequency === 'monthly') {
      continue
    } else if (!isAnnually && item.frequency === 'annually') {
      continue
    }
    minPrice = Math.min(minPrice, +item.amount)
    maxPrice = Math.max(maxPrice, +item.amount)
  }

  // Calculate the middle price value
  const middlePrice = (minPrice + maxPrice) / 2

  // Initialize the item with the price closest to the middle value
  let middleItem = items[0]
  let closestDifference = Math.abs(middlePrice - +middleItem.amount)

  // Iterate through the array to find the object with the price closest to the middle value
  for (const item of items) {
    if (isAnnually && item.frequency === 'monthly') {
      continue
    } else if (!isAnnually && item.frequency === 'annually') {
      continue
    }

    const difference = Math.abs(middlePrice - +item.amount)
    if (difference < closestDifference) {
      closestDifference = difference
      middleItem = item
    }
  }

  state.selectedPlan = String(middleItem.planId)
  return middleItem.planId
}

async function fetchPlans() {
  state.plans.error = null
  state.plans.isLoading = true

  try {
    const { data, error } = await nk.billing.getPlans({
      groupId: 'loladb.bgrp.KifiX1hf9hCq0tIFXuP'
    })

    if (!error) {
      state.plans.data = data
      state?.plans?.data?.sort((a, b) => +a.amount - +b.amount)
      selectDefaultPlan(state.isAnually)
    } else {
      state.plans.error = error
    }
  } catch (error: unknown) {
    state.plans.error = error as Error
  } finally {
    state.plans.isLoading = false
  }
}

const freePlans = [
  'loladb.bpln.jnSl9waW8ZtwL4T2Uh9',
  'loladb.bpln.tcYnOKUrDROAYqKof_Z'
]

async function handleSubscription() {
  state.subscription.error = null
  state.subscription.isLoading = true
  try {
    const { data, error } = await nk.billing.subscribe({
      accountId: user.value!.accountId,
      planId: state.selectedPlan
    })

    if (!error) {
      state.subscription.data = data
      user.value!.subscriptions.planId = state.selectedPlan
    } else {
      state.subscription.error = error
    }
  } catch (error: unknown) {
    state.subscription.error = error as Error
  } finally {
    state.subscription.isLoading = false
  }

  if (freePlans.includes(state.selectedPlan) && !state.subscription.error) {
    user.value!.subscriptions.planId = state.selectedPlan
    router.replace({ name: RouteNames.SIGN_UP_WELCOME })
  } else if (!state.subscription.error) {
    user.value!.subscriptions.planId = state.selectedPlan
    router.replace({ name: RouteNames.SIGN_UP_PAYMENT })
  }
}

fetchPlans()
</script>
