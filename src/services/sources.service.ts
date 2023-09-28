import BaseService from '@/services/base.service'
import type { AxiosPromise } from 'axios'
import type Source from '@/types/hubs/Source.interface'
import type SourceType from '@/types/hubs/SourceType.interface'
import type SourceEngines from '@/enums/sources/SourceEngines.enum'
import type HubContentsNode from '@/types/hubs/HubContentsNode.interface'

const resource = '/sources'

export default {
  createSource(
    hubId: string,
    parentNodeId: string | null,
    label: string,
    engine: SourceEngines,
    host: string,
    port: number,
    database: string,
    user: string,
    password: string
  ) {
    const options = {
      hubId,
      parentNodeId,
      label,
      engine,
      connectionSettings: {
        host,
        port,
        database,
        user,
        password
      }
    }

    return BaseService.post(`${resource}`, options)
  },
  getSource(sourceId: string): AxiosPromise<Source> {
    return BaseService.get(`${resource}/${sourceId}`)
  },
  getSources(hubId: string): AxiosPromise<Source[]> {
    return BaseService.get(`${resource}?hubId=${hubId}`)
  },
  updateSource(
    sourceId: string,
    label: string,
    host: string,
    port: number,
    database: string,
    user: string,
    password: string
  ): AxiosPromise<HubContentsNode> {
    const options = {
      label,
      connectionSettings: {
        host,
        port,
        database,
        user,
        password
      }
    }

    return BaseService.put(`${resource}/${sourceId}`, options)
  },
  getSourcesCatalog(): AxiosPromise<SourceType[]> {
    return BaseService.get(`${resource}/catalog`)
  },
  validateSource(
    engine: SourceEngines,
    host: string,
    port: number,
    user: string,
    password: string
  ): AxiosPromise<boolean> {
    const options = {
      engine,
      connectionSettings: {
        host,
        port,
        user,
        password
      }
    }

    return BaseService.post(`${resource}/validate`, options)
  },
  deleteSource(sourceId: string) {
    return BaseService.delete(`${resource}/${sourceId}`)
  }
}
