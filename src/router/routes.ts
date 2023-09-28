import RouteNames from '@/enums/RouteNames.enum'

export default [
  {
    path: '/login',
    name: RouteNames.LOGIN,
    component: () => import('@/views/sign-flow/SignIn.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/logout',
    name: RouteNames.LOGOUT,
    component: () => import('@/views/sign-flow/LogoutView.vue')
  },
  // {
  //   path: '/sign-up',
  //   name: RouteNames.SIGN_UP,
  //   component: () => import('@/views/sign-flow/SignUp.vue'),
  //   meta: {
  //     public: true
  //   }
  // },
  {
    path: '/sign-up/please-verify',
    name: RouteNames.SIGN_UP_PLEASE_VERIFY,
    component: () => import('@/views/sign-flow/SignUpPleaseVerify.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/sign-up/verify',
    name: RouteNames.SIGN_UP_VERIFICATION,
    component: () => import('@/views/sign-flow/SignUpVerification.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/password-reset-request',
    name: RouteNames.PASSWORD_RESET_REQUEST,
    component: () => import('@/views/sign-flow/PasswordResetRequest.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/password-reset',
    name: RouteNames.PASSWORD_RESET,
    component: () => import('@/views/sign-flow/PasswordReset.vue'),
    meta: {
      public: true
    }
  },
  {
    path: '/sign-up/payment',
    name: RouteNames.SIGN_UP_PAYMENT,
    component: () => import('@/views/sign-flow/SignUpPayment.vue')
  },
  {
    path: '/sign-up/plan',
    name: RouteNames.SIGN_UP_PLAN,
    component: () => import('@/views/sign-flow/SignUpPlan.vue')
  },
  {
    path: '/sign-up/welcome',
    name: RouteNames.SIGN_UP_WELCOME,
    component: () => import('@/views/sign-flow/SignUpWelcome.vue')
  },
  {
    path: '/two-step-authentication',
    name: RouteNames.TWO_STEP_AUTHENTICATION,
    component: () => import('@/views/sign-flow/TwoStepAuthentication.vue')
  },
  {
    path: '/two-step-authentication/confirm',
    name: RouteNames.TWO_STEP_AUTHENTICATION_CONFIRMATION,
    component: () =>
      import('@/views/sign-flow/TwoStepAuthenticationConfirm.vue')
  },
  {
    path: '/auth',
    name: RouteNames.AUTH,
    component: () => import('@/views/auth/AuthDashboard.vue')
  },
  {
    path: '/auth/users/:userId?',
    name: RouteNames.AUTH_USERS,
    component: () => import('@/views/auth/AuthUsers.vue'),
    props: true
  },
  {
    path: '/hubs',
    name: RouteNames.HUBS,
    component: () => import('@/views/hubs/HubsView.vue')
  },
  {
    path: '/mail',
    name: RouteNames.MAIL,
    component: () => import('@/views/mail/MailDashboard.vue')
  },
  {
    path: '/mail/sent/:emailId?',
    name: RouteNames.MAIL_SENT,
    component: () => import('@/views/mail/MailSent.vue'),
    props: true
  },
  {
    path: '/mail/templates/:templateId?',
    name: RouteNames.MAIL_TEMPLATES,
    component: () => import('@/views/mail/MailTemplates.vue'),
    props: true
  },
  {
    path: '/mail/logs',
    name: RouteNames.MAIL_LOGS,
    component: () => import('@/views/mail/MailLogs.vue')
  },
  {
    path: '/mail/settings',
    name: RouteNames.MAIL_SETTINGS,
    component: () => import('@/views/mail/MailSettings.vue')
  },
  {
    path: '/',
    name: RouteNames.ROOT,
    component: () => import('@/views/dashboard/DashboardView.vue')
  }
]
