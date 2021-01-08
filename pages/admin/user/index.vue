<template>
  <div>
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="用户名">
        <el-input
          v-model="searchForm.username"
          size="small"
          clearable
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input
          v-model="searchForm.nickname"
          size="small"
          clearable
          placeholder="昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="searchConfirm"
          >搜索</el-button
        >
        <el-button type="danger" size="small" @click="emptyConfirm"
          >清空</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe border v-loading="loading">
      <el-table-column prop="index" label="序号" align="center">
        <template slot-scope="scope">
          {{ count + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center">
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center">
        <template slot-scope="{ row }">
          {{ row.role.name }}
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" align="center">
      </el-table-column>
      <el-table-column prop="lastVoteTime" label="最后投票时间" align="center">
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" align="center">
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-view"
      @size-change="(val) => handleSizeChange(val, getList)"
      @current-change="(val) => handleCurrentChange(val, getList)"
      :current-page="page.current"
      :page-sizes="pageSizes"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { readAll, readCount } from '@/graphql/user/user.js'
import mixin from '@/utils/mixin'
export default {
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      tableData: [],
      loading: false,
      searchForm: {
        username: '',
        nickname: '',
      },
    }
  },
  beforeMount() {
    this.getList()
  },
  mixins: [mixin],
  methods: {
    searchConfirm() {
      this.page.current = 1
      this.getList()
    },
    emptyConfirm() {
      this.searchForm = {
        username: '',
        nickname: '',
      }
      this.searchConfirm()
    },
    getList() {
      this.loading = true
      Promise.all([
        this.$query(readAll, {
          page: {
            limit: this.page.size,
            offset: this.count,
          },
          filter: {
            username: JSON.stringify({
              cond: 'like',
              value: this.searchForm.username,
            }),
            nickname: JSON.stringify({
              cond: 'like',
              value: this.searchForm.nickname,
            }),
          },
        }),
        this.$query(readCount, {}),
      ])
        .then((res) => {
          if (!res[0].errors && !res[1].errors) {
            this.tableData = res[0].data.userList
            this.page.total = res[1].data.userCount.total
          } else {
            this.$message.error('加载失败')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
