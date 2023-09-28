export type PlanPaymentPeriod = 'annually' | 'monthly'
export type PlanName = 'Startup' | 'Disruptor' | 'Mega'

export interface Plan {
  amount: string
  createdAt: string
  frequency: PlanPaymentPeriod
  name: PlanName
  parentAccountId: string
  planGroupId: string
  planId: string
  updatedAt: string
}

export interface SignUpPlanState {
  isAnually: boolean
  plans: {
    data: Plan[] | null
    isLoading: boolean
    error: Error | null
  }
  subscription: {
    data: {
      subscribed: boolean
    } | null
    isLoading: boolean
    error: Error | null
  }
  selectedPlan: string
}

export interface SignUpPaymentState {
  agree: boolean
  plans: {
    data: Plan[] | null
    isLoading: boolean
    error: Error | null
  }
  subscription: {
    data: {
      subscribed: boolean
    } | null
    isLoading: boolean
    error: Error | null
  }
  selectedPlan: string
}
