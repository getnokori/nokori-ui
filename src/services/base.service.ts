import axios from 'axios'
import router from '@/router/index'
import HTTPHeaders from '@/enums/http/headers.enum'
import RouteNames from '@/enums/RouteNames.enum'
import StorageEnums from '@/enums/storage/Storage.enum'

const baseURL = import.meta.env.VITE_API_URL

const Repository = axios.create({
  baseURL,
  headers: {
    'Cache-Control': 'no-store'
  }
})

Repository.interceptors.request.use(
  (config) => {
    const rawValue = window.localStorage.getItem(StorageEnums.AUTH_KEY)
    const data = JSON.parse(rawValue as string)

    if (config && config.headers) {
      config.headers[HTTPHeaders.NOKORI_API_KEY] =
        import.meta.env.VITE_NOKORI_API_KEY

      if (data?.session?.accessToken) {
        config.headers.Authorization = `Bearer ${data.session.accessToken}`
      }
    }

    return config
  },

  (error) => Promise.reject(error)
)

Repository.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    if (error.response && error.response.status === 401) {
      await router.replace(RouteNames.LOGOUT)
    }

    return error.response
      ? Promise.reject(error.response.data)
      : Promise.reject(error)
  }
)

export default Repository
