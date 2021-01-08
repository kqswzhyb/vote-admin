<template>
  <div>
    <template v-for="item in menus">
      <el-submenu
        :index="item.path"
        v-if="item.children.length"
        :key="item.permission"
      >
        <template slot="title"
          ><i v-if="item.icon" :class="item.icon"></i>{{ item.name }}</template
        >
        <menu-item :menus="item.children" />
      </el-submenu>
      <el-menu-item v-else :key="item.permission" :route="item.path" :index="item.path"
        ><i v-if="item.icon" :class="item.icon"></i
        >{{ item.name }}</el-menu-item
      >
    </template>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    menus: {
      type: Array,
      default: [],
    },
  },
}
</script>
