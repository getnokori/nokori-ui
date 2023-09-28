/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_NOKORI_API_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_STATIC_CONTENT_BASE_URL: string
  readonly VITE_HELP_DOCS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
