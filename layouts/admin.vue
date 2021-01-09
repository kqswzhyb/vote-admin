<template>
  <el-container style="min-height: 100vh">
    <Aside />
    <el-container>
      <Header />
      <el-main class="main">
        <transition name="fade-transform" mode="out-in">
          <Nuxt />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { readAll } from '@/graphql/dic/dic'
export default {
  beforeMount() {
    this.$query(readAll, { page: { limit: 9999 } }).then((res) => {
      if (!res.errors) {
        this.$store.commit('setDicList', res.data.data)
      }
    })
  },
}
</script>
<style>
.main {
  margin-top: 60px;
  height: calc(100vh - 60px);
  padding: 32px;
  background-color: #f0f2f5;
}
</style>
