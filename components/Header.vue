<template>
  <el-header
    class="header-view"
    :style="{ '--width': width, transition: 'all 0.15s linear' }"
  >
    <i
      class="cursor-p fs20"
      :class="menu === 'show' ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
      @click="changeMenu"
    ></i>
    <el-dropdown @command="handleCommand">
      <span class="cursor-p">{{ info.nickname }}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="password">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['menu', 'info']),
    width() {
      return this.menu === 'show' ? '200px' : '0px'
    },
  },
  methods: {
    changeMenu() {
      this.$store.commit('setMenu', this.menu === 'show' ? 'hide' : 'show')
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.$axios.get('/auth/logout').then((res) => {
          if (res.data.code === '0') {
            this.$cookies.remove('token')
            this.$store.commit('setToken', '')
            this.$message.success('退出成功')
            this.$router.push('/login')
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.header-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
  font-size: 12px;
}
.el-header {
  width: calc(100vw - var(--width));
  background-color: #fff;
  color: #333;
  line-height: 60px;
  height: 60px;
  position: absolute;
  top: 0;
  left: var(--width);
}
</style>
