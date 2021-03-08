import { findIndex } from 'lodash'

import accessPath from '@/utils/accessPath'
import db from '@/plugins/lowdb'

import BanksState from '@/interfaces/BanksState'
import Question from '@/interfaces/Question'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

const BanksMutations = {

  initBanks (
    state: BanksState
  ): void {
    state.banks = db.get('banks').value()
  },

  createIntoBanks (
    state: BanksState,
    { type, name, path }: { type: string; name: string; path: Array<string> }
  ): void {
    // 访问路径下的文件夹
    const curFolder: Array<File | Folder> = accessPath(state.banks, path)

    // 检查是否有重复名称
    if (curFolder.some(item => item.name === name)) {
      throw Error('名称不能重复')
    }

    // 创建新题库文件 or 文件夹
    if (type === 'folder') {
      const folderItem: Folder = {
        name,
        type: 'folder',
        path,
        children: []
      }
      curFolder.push(folderItem)
    } else {
      const fileItem: File = {
        name,
        type: 'file',
        path,
        contents: []
      }
      curFolder.push(fileItem)
    }
  },

  deleteFromBanks (
    state: BanksState,
    { name, path }: { name: string; path: Array<string> }
  ): void {
    // 访问路径下的文件夹
    const curFolder: Array<File | Folder> = accessPath(state.banks, path)

    // 找到待删除对象
    const index = findIndex(curFolder, (o: File | Folder): boolean => o.name === name)

    // 删除
    curFolder.splice(index, 1)
  },

  insertIntoBanks (
    state: BanksState,
    { name, path, extracted }: { name: string; path: Array<string>; extracted: Array<Question> }
  ): void {
    // 访问路径下的文件夹
    const curFolder: Array<File | Folder> = accessPath(state.banks, path)

    // 判断是否存在
    const index = findIndex(curFolder, (o: File | Folder): boolean => o.name === name)
    if (curFolder[index].type === 'folder') {
      throw Error('不能在文件夹中插入题目')
    }

    (curFolder[index] as File).contents.push(...extracted)
  },

  renameFromBanks (
    state: BanksState,
    { oldName, newName, path }: { oldName: string; newName: string; path: Array<string> }
  ): void {
    // 访问路径下的文件夹
    const curFolder: Array<File | Folder> = accessPath(state.banks, path)

    // 重命名
    const index = findIndex(curFolder, (o: File | Folder): boolean => o.name === oldName)
    curFolder[index].name = newName
  }
}

export default BanksMutations
