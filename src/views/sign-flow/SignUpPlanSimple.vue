<template>
  <SignWrapper>
    <SignHeader />

    <BaseContainer :max-width="ContainerWidths.SIGN_CONTAINER">
      <SignBody>
        <SignInfo>
          <SignInfoHeader>
            <template #title>Finalize your subscription</template>

            <template #text>
              <p class="pb-4">
                Finalize your nokori subscription to gain instant access to the
                most exciting developer platform ever built exclusively for
                javascript developers.
              </p>

              <p>
                Cancel before {{ dateState.billingDate }} and you will not be
                billed.
              </p>
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
          <SignCard
            title="Confirm Subscription"
            :error="state.subscription.error"
          >
            <div class="-mt-3 mb-4 justify-center items-center max-auto flex">
              <span
                className="inline-flex items-center rounded-full bg-green-200 px-3 py-0.5 text-xs font-medium text-green-900"
              >
                30-Day Free Trial
              </span>
            </div>
            <template v-if="state.plans.isLoading">
              <LoadingIndicator />
            </template>

            <template v-else-if="state.plans.error">
              {{ state.plans.error.message }}
            </template>

            <template v-else>
              <SignForm @submit.prevent="handleSubscription">
                <!-- <SignSelectPlan
                  :is-anually="state.isAnually"
                  @plan-period-changed="
                    (checked) => (state.isAnually = checked)
                  "
                > -->
                <div class="price-wrapper">
                  <div class="price">
                    ${{ state!.plans!.data![0].amount }}
                    <div class="price__period">/monthly</div>
                    <div class="price__details">
                      Includes 1,000,000 requests per month.
                    </div>
                    <div class="price__details">
                      $0.049/100,000 requests thereafter
                    </div>
                  </div>
                </div>
                <!-- </SignSelectPlan> -->

                <!-- <BaseCheckbox id="agree" v-model="state.agree" required>
                  By clicking "Continue" you agree to the
                  <a target="_blank" href="https://loladb.com/terms"
                    >lolaDB Terms of Service</a
                  >.
                </BaseCheckbox> -->

                <BaseButton
                  type="submit"
                  :style="{ width: '100%', marginTop: '1.75rem' }"
                  :is-loading="state.subscription.isLoading"
                >
                  Subscribe to Plan
                </BaseButton>
              </SignForm>
            </template>
          </SignCard>

          <!-- <SignPlanComparisonLink /> -->
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

import { add } from 'date-fns'
import { formatWithOptions } from 'date-fns/fp'
import { enUS } from 'date-fns/locale'

const dateToString = formatWithOptions({ locale: enUS }, 'MMM do, yyyy')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const state: SignUpPlanState = reactive({
  agree: false,
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

const dateState = {
  billingDate: dateToString(add(new Date(), { days: 30 }))
}

// const monthlyPlans = computed(() => {
//   return state?.plans?.data
//     ?.filter((plan) => plan.frequency === 'monthly')
//     .sort((plan) => +plan.amount)
// })

// const anuallyPlans = computed(() => {
//   return state?.plans?.data
//     ?.filter((plan) => plan.frequency === 'annually')
//     .sort((plan) => +plan.amount)
// })

// const filteredPlans = computed(() =>
//   state.isAnually ? anuallyPlans.value : monthlyPlans.value
// )

// watch(() => state.isAnually, selectSmallestPlan)

// function selectSmallestPlan(isAnually: boolean) {
//   state.selectedPlan = isAnually
//     ? String(anuallyPlans.value?.[0].planId)
//     : String(monthlyPlans.value?.[0].planId)
// }

async function fetchPlans() {
  state.plans.error = null
  state.plans.isLoading = true

  try {
    const { data, error } = await nk.billing.getPlans({
      groupId: 'loladb.bgrp.3Jk0r6NF47EwOI8X9uF'
    })

    if (!error) {
      state.plans.data = data
      state.selectedPlan = String(data[0].planId)
    } else {
      state.plans.error = error
    }
  } catch (error: unknown) {
    state.plans.error = error as Error
  } finally {
    state.plans.isLoading = false
  }
}

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
      router.replace({ name: RouteNames.SIGN_UP_WELCOME })
    } else {
      state.subscription.error = error
    }
  } catch (error: unknown) {
    state.subscription.error = error as Error
  } finally {
    state.subscription.isLoading = false
  }
}

fetchPlans()
</script>

<style scoped lang="scss">
.price-wrapper {
  display: flex;
  justify-content: left;
  align-items: left;
  margin-bottom: toRem(20px);
  background-color: #1c1c21;
  padding: 20px;
  border-radius: 0.5rem;
  border: 1px solid #363636;
}

.price {
  font-size: toRem(24px);
  font-weight: 500;

  &__period {
    font-size: 14px;
    color: #9e9e9e;
    font-weight: normal;
    display: inline;
  }

  &__details {
    font-size: 14px;
    color: #9e9e9e;
    font-weight: normal;
    margin-top: toRem(5px);
  }
}
</style>
