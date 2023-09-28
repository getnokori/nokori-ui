enum RequestBodyTypes {
  'none' = 'none',
  'raw' = 'raw'
  // 'x-www-form-urlencoded' = 'x-www-form-urlencoded'
}

export enum RequestBodySubTypes {
  'Text' = 'plain',
  'JavasScript' = 'javascript',
  'JSON' = 'json',
  'HTML' = 'html',
  'XML' = 'xml'
}

export const InvertedRequestBodySubTypes: { [key: string]: string } = {
  'application/json': 'JSON',
  'application/xml': 'XML',
  'text/html': 'HTML',
  'text/plain': 'Text',
  'application/javascript': 'JavaScript'
}
export default RequestBodyTypes
