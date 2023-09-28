interface IQueryResponseMetrics {
  value: string
  unit: string
}

const convertBytesToHumanReadable = (bytes: number): IQueryResponseMetrics => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return { value: '-', unit: 'n/a' }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
  if (i === 0) return { value: `${bytes}`, unit: sizes[i] }

  return {
    value: `${(bytes / 1024 ** i).toFixed(1)}`,
    unit: sizes[i]
  }
}

export const convertToBytesFormatted = <T>(input: T): IQueryResponseMetrics => {
  const blob = new Blob([input as unknown as BlobPart])
  const blobSize = blob.size || 0
  return convertBytesToHumanReadable(blobSize)
}

export const convertMillisecondsToHumanReadable = (
  milliseconds: number
): IQueryResponseMetrics => {
  const sizes = ['ms', 's', 'min', 'h']
  if (milliseconds === 0) return { value: '-', unit: 'n/a' }

  const i = parseInt(
    Math.floor(Math.log(milliseconds) / Math.log(1000)).toString()
  )
  if (i === 0) return { value: `${milliseconds}`, unit: sizes[i] }

  return {
    value: `${(milliseconds / 1000 ** i).toFixed(1)}`,
    unit: sizes[i]
  }
}
