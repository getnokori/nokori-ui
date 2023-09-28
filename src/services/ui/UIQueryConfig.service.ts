import type IUIQueryConfig from '@/types/hubs/UIQueryConfig.interface'
import SourceEngineTypes from '@/enums/sources/SourceEngines.enum'

const UIQueryConfig: IUIQueryConfig = {
  mysql: {
    commands: {
      shouldShow: true,
      type: SourceEngineTypes.MYSQL
    },
    tabs: {
      body: {
        shouldShow: false
      },
      queryParams: {
        shouldShow: false
      },
      headers: {
        shouldShow: false
      },
      constraints: {
        shouldShow: false
      },
      context: {
        shouldShow: true
      },
      editor: {
        shouldShow: false,
        syntax: 'sql',
        fields: {
          mergeTypeSelect: {
            shouldShow: true
          }
        }
      },
      filters: {
        shouldShow: false
      },
      flows: {
        shouldShow: false
      },
      functions: {
        shouldShow: false
      },
      history: {
        shouldShow: false
      },
      logs: {
        shouldShow: true
      },
      query: {
        shouldShow: true
      },
      triggers: {
        shouldShow: false
      }
    },
    fields: {
      http: {
        url: {
          shouldShow: false
        }
      }
    }
  },
  mariadb: {
    commands: {
      shouldShow: true,
      type: SourceEngineTypes.MARIADB
    },
    tabs: {
      body: {
        shouldShow: false
      },
      queryParams: {
        shouldShow: false
      },
      headers: {
        shouldShow: false
      },
      constraints: {
        shouldShow: false
      },
      context: {
        shouldShow: true
      },
      editor: {
        shouldShow: false,
        syntax: 'sql',
        fields: {
          mergeTypeSelect: {
            shouldShow: true
          }
        }
      },
      filters: {
        shouldShow: false
      },
      flows: {
        shouldShow: false
      },
      functions: {
        shouldShow: false
      },
      history: {
        shouldShow: false
      },
      logs: {
        shouldShow: true
      },
      query: {
        shouldShow: true
      },
      triggers: {
        shouldShow: false
      }
    },
    fields: {
      http: {
        url: {
          shouldShow: false
        }
      }
    }
  },
  postgres: {
    commands: {
      shouldShow: true,
      type: SourceEngineTypes.POSTGRES
    },
    tabs: {
      body: {
        shouldShow: false
      },
      queryParams: {
        shouldShow: false
      },
      headers: {
        shouldShow: false
      },
      constraints: {
        shouldShow: false
      },
      context: {
        shouldShow: true
      },
      editor: {
        shouldShow: false,
        syntax: 'sql',
        fields: {
          mergeTypeSelect: {
            shouldShow: true
          }
        }
      },
      filters: {
        shouldShow: false
      },
      flows: {
        shouldShow: false
      },
      functions: {
        shouldShow: false
      },
      history: {
        shouldShow: false
      },
      logs: {
        shouldShow: true
      },
      query: {
        shouldShow: true
      },
      triggers: {
        shouldShow: false
      }
    },
    fields: {
      http: {
        url: {
          shouldShow: false
        }
      }
    }
  },
  http: {
    commands: {
      shouldShow: true,
      type: SourceEngineTypes.HTTP
    },
    tabs: {
      body: {
        shouldShow: true
      },
      queryParams: {
        shouldShow: true
      },
      constraints: {
        shouldShow: false
      },
      context: {
        shouldShow: true
      },
      headers: {
        shouldShow: true
      },
      editor: {
        shouldShow: false,
        syntax: 'sql',
        fields: {
          mergeTypeSelect: {
            shouldShow: true
          }
        }
      },
      filters: {
        shouldShow: false
      },
      flows: {
        shouldShow: false
      },
      functions: {
        shouldShow: false
      },
      history: {
        shouldShow: false
      },
      logs: {
        shouldShow: true
      },
      query: {
        shouldShow: false
      },
      triggers: {
        shouldShow: false
      }
    },
    fields: {
      http: {
        url: {
          shouldShow: true
        }
      }
    }
  }
}

export default UIQueryConfig
