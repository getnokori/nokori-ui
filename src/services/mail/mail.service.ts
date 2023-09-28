import BaseService from '@/services/base.service'
import type SendMailRequestDTO from '@/types/mail/SendMail.type'
import type SentMail from '@/types/mail/SentMail.type'
import type { SentMailAll, SentMailSingle } from '@/types/mail/SentMail.type'
import type { EmailTemplatesAllDTO } from '@/types/mail/Templates.type'
import type { AxiosPromise } from 'axios'

const resource = '/mail'

export default {
  getSentMailAll({
    page = 1,
    limit = 25,
    from = null,
    to = null
  }: {
    page?: number
    limit?: number
    from?: null | string
    to?: null | string
  }): AxiosPromise<{ rows: SentMail[]; count: number } | null> {
    const offset = page < 0 ? 0 : page - 1
    const url =
      from && to
        ? `${resource}/sent?offset=${offset}&limit=${limit}&from=${from}&to=${to}`
        : `${resource}/sent?offset=${offset}&limit=${limit}`
    return BaseService.get(url)
  },
  getSentMail(emailId: string): AxiosPromise<SentMailSingle | null> {
    return BaseService.get(`${resource}/sent/${emailId}`)
  },
  getTemplates({
    page = 1,
    limit = 25
  }): AxiosPromise<EmailTemplatesAllDTO[] | null> {
    const offset = page < 0 ? 0 : page - 1
    return BaseService.get(
      `${resource}/templates?offset=${offset}&limit=${limit}`
    )
  },
  getTemplate(templateId: string): AxiosPromise<any | null> {
    return BaseService.get(`${resource}/templates/${templateId}`)
  },
  createTemplate({
    templateId,
    templateName,
    subject,
    template,
    context
  }: {
    templateId: string
    templateName: string
    subject: string
    template: string
    context?: string | null
  }): AxiosPromise<any | null> {
    return BaseService.post(`${resource}/templates`, {
      templateId,
      templateName,
      subject,
      template,
      context
    })
  },
  updateTemplate(templateId: string, update: object): AxiosPromise<any | null> {
    return BaseService.put(`${resource}/templates/${templateId}`, update)
  },
  deleteTemplate(templateId: string): AxiosPromise<any | null> {
    return BaseService.delete(`${resource}/templates/${templateId}`)
  },
  getDomains(): AxiosPromise<any | null> {
    return BaseService.get(`${resource}/domains`)
  },
  createDomain(domain: string): AxiosPromise<any | null> {
    return BaseService.post(`${resource}/domains`, { domain })
  },
  deleteDomain(domain: string): AxiosPromise<any | null> {
    return BaseService.delete(`${resource}/domains/${domain}`)
  },
  getSetting(settingKey: string): AxiosPromise<any | null> {
    return BaseService.get(`${resource}/settings/${settingKey}`)
  },
  saveSettings(settings: object): AxiosPromise<any | null> {
    return BaseService.put(`${resource}/settings`, settings)
  },
  sendTestMail(sendRequest: SendMailRequestDTO): AxiosPromise<any | null> {
    return BaseService.post(`${resource}/send`, sendRequest)
  },
  sendMail(sendRequest: SendMailRequestDTO): Promise<any | null> {
    return BaseService.post(`${resource}/send`, sendRequest, {
      headers: {
        'x-should-upgrade': 'false'
      }
    })
  }
}
