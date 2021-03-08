import db from '@/plugins/lowdb'

import BanksMutations from './banksMutations'
import quesMutations from './quesMutations'

import BanksState from '@/interfaces/BanksState'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

const BanksModule = {
  state: (): BanksState => ({
    banks: []
  }),
  getters: {

    banksCount: (
      state: BanksState
    ): number => {
      /* 题库文件数量 */
      const queue: Array<File | Folder> = Array.from(state.banks)
      let c = 0

      while (queue.length !== 0) {
        const e = queue.shift()
        if (
          (e as File | Folder).type === 'file'
        ) { c++ } else {
          queue.push(...(e as Folder).children)
        }
      }
      return c
    },

    quesCount: (
      state: BanksState
    ): number => {
      /* 题目数量 */
      const queue: Array<File | Folder> = Array.from(state.banks)
      let c = 0

      while (queue.length !== 0) {
        const e = queue.shift()
        if (
          (e as File | Folder).type === 'file'
        ) {
          c += (e as File).contents.length
        } else {
          queue.push(...(e as Folder).children)
        }
      }
      return c
    }

  },
  mutations: {
    ...BanksMutations,
    ...quesMutations,
    writeBackBanks (
      state: BanksState
    ): void {
      /* 将内存中对 banks 的修改写回磁盘 */
      db.set('banks', state.banks).write()
    }
  }
}

export default BanksModule
