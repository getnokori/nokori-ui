interface MailDomainsModelDTO {
  accountId: string
  domain: string
  verificationKey: string
  status: 'verifying' | 'verified'
  createdAt: string
  updatedAt?: string | null
  lastVerified?: string | null
}

export default MailDomainsModelDTO
