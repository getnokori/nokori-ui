import { createRouter, createWebHistory } from 'vue-router'
import nk from '@/services/nokori.service'
import RouteNames from '@/enums/RouteNames.enum'
import useUserStore from '@/stores/user.store'
import routes from './routes'
// import { storeToRefs } from 'pinia'

// const userStore = useUserStore()

// const { isSignUpCompleted, user } = storeToRefs(userStore)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0
    }
  }
})

router.beforeEach(async (to, from, next) => {
  // 404 Not Found
  if (to.matched.length === 0) {
    return '/'
  }
  const isPublicRoute = to.matched.some((record) => record.meta.public)
  if (isPublicRoute) return next()

  const { data, error } = await nk.auth.isAuthenticated()

  if (!data?.isAuthenticated && !isPublicRoute) {
    if (error?.redirectTo) {
      return next({ path: error.redirectTo, replace: true })
    } else {
      return next({ name: RouteNames.LOGIN, replace: true })
    }
  }

  if (to.name === RouteNames.SIGN_UP_VERIFICATION) return next()

  return next()

  // if (data) {
  //   // if (to.name === RouteNames.SIGN_UP_VERIFICATION) return
  //   // Public routes are sign flow only redirect them to root
  //   if (isPublicRoute) return { name: RouteNames.ROOT, replace: true }

  //   // Pass by if authenticated and not public
  //   return
  // } else {
  //   // Pass by if public and not authenticated
  //   if (isPublicRoute) return

  //   // Redirect to login everything else
  //   return { path: error.redirectTo, replace: true }
  // }
})

export default router
