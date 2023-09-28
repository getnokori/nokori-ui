import nokori from '@nokori/js-sdk'
const url = import.meta.env.VITE_API_URL
const nk = new nokori(import.meta.env.VITE_NOKORI_API_KEY, {
  apiURL: url
})

export default nk
