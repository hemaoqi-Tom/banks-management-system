import { findIndex } from 'lodash'

import accessPath from '@/utils/accessPath'

import BanksState from '@/interfaces/BanksState'
import Question from '@/interfaces/Question'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

const quesMutations = {

  mutateQues (
    state: BanksState,
    { name, path, title, newQues }: { name: string; path: Array<string>; title: string; newQues: Question }
  ) {
    // 访问路径下的文件夹
    const curFolder: Array<File | Folder> = accessPath(state.banks, path)

    // 定位题目
    const bankIndex: number = findIndex(curFolder, (o: File | Folder): boolean => o.name === name)
    const bank: File = curFolder[bankIndex] as File
    const quesIndex: number = findIndex(
      bank.contents,
      (o: Question): boolean => o.title === title
    )

    // 执行修改
    bank.contents.splice(quesIndex, 1, newQues)
  },

  deleteQues (
    state: BanksState,
    { name, path, title }: { name: string; path: Array<string>; title: string }
  ): void {
    // 访问路径下的文件夹
    const curFolder: Array<File | Folder> = accessPath(state.banks, path)

    // 定位题目
    const bankIndex: number = findIndex(curFolder, (o: File | Folder): boolean => o.name === name)
    const bank: File = curFolder[bankIndex] as File
    const quesIndex: number = findIndex(
      bank.contents,
      (o: Question): boolean => o.title === title
    )

    // 执行删除
    bank.contents.splice(quesIndex, 1)
  }
}

export default quesMutations
