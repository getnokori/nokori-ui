;(async () => {
  type KeyValue = {
    key: string
    value: any
  }

  function findRemovedElementIndex(arr1: KeyValue[], arr2: KeyValue[]): number {
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

  const array1: KeyValue[] = [
    { key: 'apples', value: '5' },
    { key: 'apples', value: '5' },
    { key: 'bananas', value: '10' },
    { key: 'cherries', value: '15' }
  ]

  const array2: KeyValue[] = [
    { key: 'apples', value: '5' },
    { key: 'bananas', value: '10' },
    { key: 'cherries', value: '15' }
  ]

  const result = findRemovedElementIndex(array1, array2)
})()
