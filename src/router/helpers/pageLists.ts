import RouteNames from '@/enums/RouteNames.enum'

export const fullscreenRoutes = [
  RouteNames.LOGIN,
  RouteNames.LOGOUT,
  RouteNames.SIGN_UP,
  RouteNames.SIGN_UP_PLEASE_VERIFY,
  RouteNames.SIGN_UP_VERIFICATION,
  RouteNames.SIGN_UP_PAYMENT,
  RouteNames.SIGN_UP_PLAN,
  RouteNames.SIGN_UP_WELCOME,
  RouteNames.PASSWORD_RESET_REQUEST,
  RouteNames.PASSWORD_RESET,
  RouteNames.TWO_STEP_AUTHENTICATION,
  RouteNames.TWO_STEP_AUTHENTICATION_CONFIRMATION
]

export const protectedSignUpRoutes = [
  RouteNames.SIGN_UP_PAYMENT,
  RouteNames.SIGN_UP_PLAN,
  RouteNames.SIGN_UP_WELCOME
]
