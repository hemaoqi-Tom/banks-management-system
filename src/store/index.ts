import Vue from 'vue'
import Vuex from 'vuex'

import BatchImportModule from './modules/batchImportModule'
import BanksModule from './modules/banksModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    BatchImportModule,
    BanksModule
  }
})
