<template>
  <v-app class="home__wrapper">
    <v-breadcrumbs :items="[{ text: '题库管理系统' }, { text: '首页' }]">
      <template v-slot:divider>
        <v-icon>mdi-forward</v-icon>
      </template>
    </v-breadcrumbs>

    <div class="mx-6">
      <p>欢迎使用 Slime！希望你喜欢它的功能</p>
      <p>Slime 功能介绍，之后再写</p>
    </div>
  </v-app>
</template>
