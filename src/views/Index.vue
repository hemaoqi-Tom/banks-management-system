<template>
  <v-app class="index__wrapper">

    <!-- 左侧菜单栏 -->
    <v-navigation-drawer color="indigo darken-2" app dark permanent>

      <v-sheet height="86px" color="indigo darken-2">
        <v-card-title>题库管理系统</v-card-title>
        <v-card-subtitle>Banks Management System</v-card-subtitle>
      </v-sheet>

      <v-divider class="ml-2 mr-2"></v-divider>

      <v-list dark>
        <div v-for="menuItem in sideMenuItems" :key="menuItem.title">

          <!-- 如果有子菜单 -->
          <v-list-group
            v-if="menuItem.type === 'group'"
            :prepend-icon="menuItem.icon"
            color="white"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="subMenuItem in menuItem.subs"
              :key="subMenuItem.title"
              :to="subMenuItem.href"
              link
            >
              <v-list-item-title>{{ subMenuItem.title }}</v-list-item-title>
              <v-list-item-icon>
                <v-icon>{{ subMenuItem.icon }}</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <!-- 如果只是链接 -->
          <v-list-item :to="menuItem.href" v-else link>
            <v-list-item-icon>
              <v-icon>{{ menuItem.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>

      <!-- GitHub 链接 -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="viewSource" block>
            <v-icon class="inline-block mr-2">mdi-github</v-icon>
            GitHub
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { remote } from 'electron'

@Component
export default class Index extends Vue {
  sideMenuItems = [
    {
      title: '首页',
      icon: 'mdi-home',
      href: 'home',
      type: 'title'
    },
    {
      title: '导入题库',
      icon: 'mdi-import',
      type: 'group',
      subs: [
        {
          title: '批量导入',
          icon: 'mdi-database-import',
          type: 'title',
          href: 'batch-import'
        },
        {
          title: '单独导入',
          icon: 'mdi-arrow-right-thick',
          type: 'title',
          href: 'single-import'
        }
      ]
    },
    {
      title: '在线刷题',
      icon: 'mdi-lead-pencil',
      type: 'title',
      href: 'exercise'
    },
    {
      title: '题库管理',
      icon: 'mdi-monitor',
      type: 'title',
      href: 'management'
    }
  ]

  created () {
    this.$store.commit('initBanks')
  }

  viewSource () {
    const projLocation = 'https://www.baidu.com'
    remote.shell.openExternal(projLocation)
  }
}
</script>

<style lang="scss">
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

::-webkit-scrollbar {
  display: none;
}
</style>
