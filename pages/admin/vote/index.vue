<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-row :gutter="20">
        <el-col :span="21">
          <el-form-item label="比赛名称">
            <el-input
              v-model="searchForm.voteName"
              size="small"
              clearable
              placeholder="比赛名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="比赛状态">
            <el-input
              v-model="searchForm.status"
              size="small"
              clearable
              placeholder="昵称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3" class="text-right">
          <el-form-item>
            <el-button type="primary" size="small" @click="searchConfirm"
              >搜索</el-button
            >
            <el-button type="danger" size="small" @click="emptyConfirm"
              >清空</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="my10">
      <!-- <el-button
        type="primary"
        v-permission="'user_add'"
        size="small"
        @click="createUser"
        >创建比赛</el-button
      > -->
    </div>
    <el-table :data="tableData" stripe border v-loading="loading">
      <el-table-column prop="index" label="序号" align="center" width="50">
        <template slot-scope="scope">
          {{ count + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" align="center" width="65">
        <template slot-scope="{ row }">
          <img
            :src="row.file ? imgUrl + row.file.fileFullPath : ''"
            width="40"
            height="40"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center">
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center">
        <template slot-scope="{ row }">
          <!-- {{ row.role.name }} -->
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
      <el-table-column fixed="right" label="操作" align="center" width="60">
        <template slot-scope="{ row }">
          <!-- <el-button type="text" size="small" @click="editUser(row)"
            >编辑</el-button
          > -->
        </template>
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
import { readAll, readCount } from '@/graphql/vote/vote.js'
import mixin from '@/utils/mixin'
export default {
  layout: 'admin',
  middleware: 'auth',
  mixins: [mixin],
  data() {
    return {
      tableData: [],
      loading: false,
      searchForm: {
        voteName: '',
        status: '0',
      },
      url:''
    }
  },
  beforeMount() {
    this.getList()
    this.url = this.$baseURL
  },
  methods: {
    searchConfirm() {
      this.page.current = 1
      this.getList()
    },
    emptyConfirm() {
      this.searchForm = {
        voteName: '',
        status: '0',
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
            voteName: JSON.stringify({
              cond: 'like',
              value: this.searchForm.voteName,
            }),
            status: JSON.stringify({
              cond: 'eq',
              value: this.searchForm.status,
            }),
          },
        }),
        this.$query(readCount),
      ])
        .then((res) => {
          if (!res[0].errors && !res[1].errors) {
            this.tableData = res[0].data.data
            this.page.total = res[1].data.page.total
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
