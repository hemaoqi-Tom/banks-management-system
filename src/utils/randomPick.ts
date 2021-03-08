import randInt from './randInt'
import { cloneDeep } from 'lodash'

export default function randomPick<T> (arr: Array<T>, n: number): Array<T> {
  const copyArr = cloneDeep(arr)

  if (n > arr.length) {
    return copyArr
  }

  for (let i = 0; i < n; i++) {
    const r = randInt(0, arr.length - i)
    const temp = copyArr[r]
    copyArr[r] = copyArr[arr.length - i - 1]
    copyArr[arr.length - i - 1] = temp
  }

  return copyArr.slice(arr.length - n)
}
