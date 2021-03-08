import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $msg: any,
    $db: any
  }
}
