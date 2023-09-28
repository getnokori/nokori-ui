interface SendMailRequestDTO {
  scenario?: 'verify-email' | 'reset-password'
  templateId: string
  settings: {
    to: string
    from?: string
    bcc?: string
    cc?: string
    replyTo?: string
    subject?: string
    text?: string
    html?: string
  }
  context?: {
    [key: string]: string
  }
  headers?: {
    [key: string]: string
  }
  test?: boolean
}

export default SendMailRequestDTO
