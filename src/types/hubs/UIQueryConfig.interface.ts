import type SourceEngineTypes from '@/enums/sources/SourceEngines.enum'

export default interface IUIQueryConfig {
  [key: string]: {
    commands: {
      shouldShow: boolean
      type: SourceEngineTypes
    }
    tabs: {
      body: {
        shouldShow: boolean
      }
      queryParams: {
        shouldShow: boolean
      }
      constraints: {
        shouldShow: boolean
      }
      context: {
        shouldShow: boolean
      }
      headers?: {
        shouldShow: boolean
      }
      editor: {
        shouldShow: boolean
        syntax: 'sql' | 'json'
        fields: {
          [key: string]: {
            shouldShow: boolean
          }
        }
      }
      filters: {
        shouldShow: boolean
      }
      flows: {
        shouldShow: boolean
      }
      functions: {
        shouldShow: boolean
      }
      history: {
        shouldShow: boolean
      }
      logs: {
        shouldShow: boolean
      }
      query: {
        shouldShow: boolean
      }
      triggers: {
        shouldShow: boolean
      }
    }
    fields: {
      http: {
        url: {
          shouldShow: boolean
        }
      }
    }
  }
}
