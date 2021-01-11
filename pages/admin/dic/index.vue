<template>
  <el-row :gutter="24">
    <el-col :span="12"><DicType @change="changeRow" /></el-col>
    <el-col :span="12"><Dic :row="row" /></el-col>
  </el-row>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      row: {},
    }
  },
  methods: {
    changeRow(val) {
      this.row = val
    },
  },
}
</script>
