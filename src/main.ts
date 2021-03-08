import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Message from '@/components/Message/Message'
import vuetify from './plugins/vuetify'
import db from './plugins/lowdb'
import './plugins/ckeditor'

Vue.config.productionTip = false
Vue.prototype.$db = db
Vue.prototype.$msg = Message

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
