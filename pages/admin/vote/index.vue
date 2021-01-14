<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="比赛名称">
            <el-input
              v-model="searchForm.voteName"
              size="small"
              clearable
              placeholder="比赛名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="比赛状态">
            <el-select
              v-model="searchForm.status"
              size="small"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dicList['vote_status']"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="text-right">
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
      <el-button type="primary" size="small" @click="createVote"
        >创建比赛</el-button
      >
    </div>
    <el-table :data="tableData" ref="table" stripe border v-loading="loading">
      <el-table-column prop="index" label="序号" align="center" width="50">
        <template slot-scope="scope">
          {{ count + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="voteName" label="比赛名称" align="center">
      </el-table-column>
      <el-table-column prop="voteType" label="比赛类型" align="center">
        <template slot-scope="{ row }">
          {{
            optionalChaining(
              dicList['vote_type'].find((v) => v.value === row.voteType),
              'name'
            )
          }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" align="center">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" align="center">
      </el-table-column>
      <el-table-column prop="createBy" label="发起人" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="{ row }">
          {{
            optionalChaining(
              dicList['vote_status'].find((v) => v.value === row.status),
              'name'
            )
          }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="60">
        <template slot-scope="{ row }">
          <el-dropdown>
            <span class="el-dropdown-link"> 操作 </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                ><el-button type="text" size="small" @click="viewVote(row)"
                  >查看比赛</el-button
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><el-button type="text" size="small" @click="viewRole(row)"
                  >查看角色</el-button
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><el-button
                  type="text"
                  v-if="row.status === '0' || row.status === '3'"
                  size="small"
                  @click="editVote(row)"
                  >编辑比赛</el-button
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><el-button
                  type="text"
                  v-if="row.status === '0' || row.status === '3'"
                  size="small"
                  @click="editRole(row)"
                  >编辑角色</el-button
                ></el-dropdown-item
              >
              <el-dropdown-item
                ><el-button
                  type="text"
                  v-if="row.status === '0'"
                  size="small"
                  @click="voteReady(row)"
                  >准备就绪</el-button
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
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

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      class="leftDialog"
      append-to-body
      width="calc( 100% - 200px)"
      top="0"
    >
      <VoteConfigDialog
        ref="voteConfig"
        :mode="mode"
        :inData="inData"
        @close="closeDialog"
      />
    </el-dialog>
    <el-dialog
      :title="roleTitle"
      :visible.sync="roleDialogVisible"
      class="leftDialog"
      append-to-body
      width="calc( 100% - 200px)"
      top="0"
    >
      <VoteRoleDialog
        ref="voteRole"
        :inData="inData"
        @close="closeRoleDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import { readAll, readCount, readyVote } from '@/graphql/vote/vote.js'
import { mapGetters } from 'vuex'
import mixin from '@/utils/mixin'
import { optionalChaining } from '@/utils/util'
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
        status: '',
      },
      url: '',
      dialogVisible: false,
      roleDialogVisible: false,
      optionalChaining,
      mode: '',
      inData: {},
      title: '',
      roleTitle: '',
    }
  },
  beforeMount() {
    this.getList()
    this.url = this.$baseURL
  },
  computed: {
    ...mapGetters(['dicList']),
  },
  methods: {
    voteReady(row) {
      this.$confirm('此操作将更新状态就绪，之后无法再编辑, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$mutate(readyVote, {
          id: row.id,
        }).then((res) => {
          if (!res.errors) {
            this.getList()
            this.$message[res.data.readyVote.code === '0' ? 'success' : 'error'](
              res.data.readyVote.message
            )
          } else {
            this.$message.error('请求失败')
          }
        })
      })
    },
    closeRoleDialog() {
      this.roleDialogVisible = false
      this.searchConfirm()
    },
    closeDialog() {
      this.dialogVisible = false
      this.searchConfirm()
    },
    editRole(row) {
      this.roleTitle = '编辑角色'
      this.roleDialogVisible = true
      this.$nextTick(() => {
        this.$refs.voteRole.getDetail(row, true)
      })
    },
    viewRole(row) {
      this.roleTitle = '查看角色'
      this.roleDialogVisible = true
      this.$nextTick(() => {
        this.$refs.voteRole.getDetail(row, false)
      })
    },
    createVote() {
      this.title = '创建比赛'
      this.mode = 'add'
      this.inData = {}
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.voteConfig.formEdit=true
      })
    },
    viewVote(row) {
      this.title = '查看比赛'
      this.mode = 'view'
      this.inData = row
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.voteConfig.getDetail(row, false)
      })
    },
    editVote(row) {
      this.title = '编辑比赛'
      this.mode = row.status === '0' ? 'edit' : 'change'
      this.inData = row
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.voteConfig.getDetail(row, true)
      })
    },
    searchConfirm() {
      this.page.current = 1
      this.getList()
    },
    emptyConfirm() {
      this.searchForm = {
        voteName: '',
        status: '',
      }
      this.searchConfirm()
    },
    getList() {
      this.loading = true
      let filter = {
        voteName: JSON.stringify({
          cond: 'like',
          value: this.searchForm.voteName,
        }),
        status: JSON.stringify({
          cond: 'eq',
          value: this.searchForm.status,
        }),
      }
      Promise.all([
        this.$query(readAll, {
          page: {
            limit: this.page.size,
            offset: this.count,
          },
          filter,
        }),
        this.$query(readCount, { filter }),
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
