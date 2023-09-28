enum HeadersContentTypes {
  JSON = 'application/json',
  XML = 'application/xml',
  HTML = 'text/html',
  TEXT = 'text/plain',
  JAVASCRIPT = 'application/javascript',
  FORM = 'application/x-www-form-urlencoded',
  NONE = 'none'
}

export const invertedHeadersContentTypes: { [key: string]: string } = {
  'application/json': 'json',
  'application/xml': 'xml',
  'text/html': 'html',
  'text/plain': 'text',
  'application/javascript': 'javascript',
  'application/x-www-form-urlencoded': 'form',
  none: 'none'
}

export default HeadersContentTypes
