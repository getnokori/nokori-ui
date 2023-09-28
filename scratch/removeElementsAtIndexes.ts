;(async () => {
  function removeElementsAtIndexes<T>(
    arr: T[],
    indexesToRemove: number[]
  ): T[] {
    const indexSet = new Set(indexesToRemove)
    return arr.filter((_, index) => !indexSet.has(index))
  }

  const originalArray = [1, 2, 3, 4, 5, 6, 7]
  const indexesToRemove = [1, 3, 5]

  const newArray = removeElementsAtIndexes(originalArray, indexesToRemove)
})()
