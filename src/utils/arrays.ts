type KeyValue = {
  key: string
  value: any
  checked?: boolean
}

export function findRemovedElementIndex(
  arr1: KeyValue[],
  arr2: KeyValue[]
): number {
  const arr2Map = new Map<string, any>()

  arr2.forEach(({ key, value }, index) => {
    const keyValuePair = `${key}_${value}`
    if (arr2Map.has(keyValuePair)) {
      arr2Map.set(keyValuePair, arr2Map.get(keyValuePair)! + 1)
    } else {
      arr2Map.set(keyValuePair, 1)
    }
  })

  return arr1.findIndex(({ key, value }, index) => {
    const keyValuePair = `${key}_${value}`
    if (arr2Map.has(keyValuePair) && arr2Map.get(keyValuePair)! > 0) {
      arr2Map.set(keyValuePair, arr2Map.get(keyValuePair)! - 1)
      return false
    }
    return true
  })
}

export function findRemovedElementIndexes(
  arr1: KeyValue[],
  arr2: KeyValue[]
): number[] {
  const arr2Map = new Map<string, number>()

  arr2.forEach(({ key, value }, index) => {
    const keyValuePair = `${key}_${value}`
    if (arr2Map.has(keyValuePair)) {
      arr2Map.set(keyValuePair, arr2Map.get(keyValuePair)! + 1)
    } else {
      arr2Map.set(keyValuePair, 1)
    }
  })

  const removedIndexes: number[] = []

  arr1.forEach(({ key, value }, index) => {
    const keyValuePair = `${key}_${value}`
    if (arr2Map.has(keyValuePair) && arr2Map.get(keyValuePair)! > 0) {
      arr2Map.set(keyValuePair, arr2Map.get(keyValuePair)! - 1)
    } else {
      removedIndexes.push(index)
    }
  })

  return removedIndexes
}

export function removeElementsAtIndexesChecked<T>(
  arr: any[],
  indexesToRemove: number[]
): T[] {
  const indexSet = new Set(indexesToRemove)
  return arr.filter(
    (element, index) => !indexSet.has(index) || element.checked === false
  )
}

export function removeElementsAtIndexes<T>(
  arr: T[],
  indexesToRemove: number[]
): T[] {
  const indexSet = new Set(indexesToRemove)
  return arr.filter((_, index) => !indexSet.has(index))
}

export function findChangedElementIndex(
  arr1: KeyValue[],
  arr2: KeyValue[]
): number {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length')
  }

  return arr1.findIndex(({ key, value }, index) => {
    const otherElement = arr2[index]
    return key !== otherElement.key || value !== otherElement.value
  })
}
