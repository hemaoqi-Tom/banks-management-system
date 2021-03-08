import Vue from 'vue'

import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'
import 'vuetify/dist/vuetify.min.css'

// Vuetify 依赖的中文字体
// npm i typeface-roboto @mdi/font
import zhHans from 'vuetify/es5/locale/zh-Hans'
import 'typeface-roboto/index.css'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = new Vuetify({
  lang: {
    locales: { zhHans },
    current: 'zhHans'
  },
  icons: {
    iconfont: 'mdi'
  }
})

Vue.use(Vuetify)

export default vuetify
