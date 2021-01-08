<template>
  <el-aside
    :width="width"
    :style="{
      height: '100vh',
      backgroundColor: 'rgb(48, 65, 86)',
      overflowX: 'hidden',
      '--width': width,
      transition: 'all 0.15s linear',
    }"
  >
    <el-scrollbar class="scrollbar-wrapper">
      <h2 class="aside-title">投票管理系统</h2>
      <el-menu
        router
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :default-active="$route.path"
        :active-text-color="variables.menuActiveText"
      >
        <menu-item :menus="menus"/>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/assets/css/variable.scss'
import MenuItem from './MenuItem.vue'
export default {
  data() {
    return {
      variables,
    }
  },
  components:{
    MenuItem
  },
  computed: {
    ...mapGetters(['menu','menus']),
    width() {
      return this.menu === 'show' ? '200px' : '0px'
    },
  },
}
</script>
<style lang="scss" scoped>
.el-aside {
  color: #333;
}
.aside-title {
  color: #fff;
  text-align: center;
}
.el-menu::v-deep {
  width: var(--width);
}
</style>
