import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'index',
    redirect: '/home',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/Home.vue')
      },
      {
        path: 'batch-import',
        name: 'batch-import',
        component: () => import('@/views/BankImport/BatchImport/BatchImport.vue')
      },
      {
        path: 'single-import',
        name: 'single-import',
        component: () => import('@/views/BankImport/SingleImport/SingleImport.vue')
      },
      {
        path: 'management',
        name: 'management',
        component: () => import('@/views/Management/Management.vue')
      },
      {
        path: 'exercise',
        name: 'exercise',
        component: () => import('@/views/Exam/Exercise.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
