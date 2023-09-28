import type {
  SentMailStatusLabels,
  SentMailStatuses
} from '@/enums/mail/SentMailStatus.enum'

interface SentMail {
  emailId: string
  recipientEmail: string
  status: keyof typeof SentMailStatusLabels
  subject: string
  date: string
  createdAt: string
}

export interface SentMailAll {
  [key: string]: SentMail[]
}

export interface SentMailSingle {
  emailId: string
  to: string
  from: string
  subject: string
  templateId?: string
  status: keyof typeof SentMailStatuses
  html: string
}

export default SentMail
