<template>
  <div>
    <div class="operation">
      <el-button size="mini" type="danger" @click="goBack">关闭</el-button>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        v-for="item in current.voteRoleType"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      ></el-tab-pane>
    </el-tabs>
    <h2 v-if="current.voteType === '1' && current.specialType">
      总数：{{ current.specialType }} 当前:{{ page.total }}
    </h2>
    <el-form
      :inline="true"
      ref="searchForm"
      :model="searchForm"
      class="search-form"
    >
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="角色名称">
            <el-input
              v-model="searchForm.roleName"
              size="small"
              clearable
              placeholder="角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色别名">
            <el-input
              v-model="searchForm.alias"
              size="small"
              clearable
              placeholder="角色别名"
            ></el-input>
          </el-form-item>
          <el-form-item label="补充描述">
            <el-input
              v-model="searchForm.description"
              size="small"
              clearable
              placeholder="补充描述"
            ></el-input>
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
      <el-button type="primary" size="small" @click="creatRole"
        >创建角色</el-button
      >
    </div>
    <el-table :data="tableData" ref="table" stripe border v-loading="loading">
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
      <el-table-column prop="roleName" label="角色名称" align="center">
      </el-table-column>
      <el-table-column prop="alias" label="角色别名" align="center">
      </el-table-column>
      <el-table-column prop="description" label="补充描述" align="center">
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="60">
        <template slot-scope="{ row }">
          <el-dropdown>
            <span class="el-dropdown-link"> 操作 </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                ><el-button type="text" size="small" @click="editRole(row)"
                  >编辑角色</el-button
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
      width="600px"
      append-to-body
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="form.roleName"
            placeholder="角色名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="角色别名" prop="alias">
          <el-input
            v-model="form.alias"
            placeholder="角色别名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="补充描述" prop="description">
          <el-input
            v-model="form.description"
            placeholder="补充描述"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="fileList">
          <el-upload
            class="avatar-uploader"
            :action="url + '/file/simpleUpload'"
            :headers="{
              Authorization: `Bearer ${$cookies.get('token')}`,
            }"
            :data="{
              fileDic: 'avatar',
            }"
            :show-file-list="false"
            :limit="1"
            :file-list="form.fileList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  readAll,
  readCount,
  createVoteRole,
  updateVoteRole,
} from '@/graphql/vote/voteRole.js'
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
        roleName: '',
        alias: '',
        description: '',
      },
      url: '',
      dialogVisible: false,
      optionalChaining,
      mode: '',
      form: {
        roleName: '',
        alias: '',
        fileList: [],
        description: '',
        remark: '',
      },
      title: '',
      imageUrl: '',
      activeName: '',
      current: '',
      currentId: '',
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      total: '',
    }
  },
  beforeMount() {
    this.url = this.$baseURL
  },
  computed: {
    ...mapGetters(['dicList']),
  },
  watch: {
    activeName(val) {
      this.searchForm = {
        roleName: '',
        alias: '',
        fileList: [],
        description: '',
        remark: '',
      }
      this.imageUrl = ''
      this.currentId = ''
      this.total = ''
    },
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.imageUrl = ''
      this.dialogVisible = false
    },
    handleAvatarSuccess(res, file) {
      if (res.code == '0') {
        this.form.fileList = [Object.assign({}, res.data, { recordId: '' })]
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$message.success('添加成功')
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    goBack() {
      this.$refs.searchForm.resetFields()
      this.$emit('close')
    },
    closeDialog() {
      this.dialogVisible = false
      this.searchConfirm()
    },
    editRole(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.voteRole.getDetail(row)
      })
    },
    getDetail(row) {
      this.current = row
      this.activeName = row.voteRoleType[0].id
      this.searchConfirm()
    },
    creatRole() {
      if (
        this.current.voteType === '1' &&
        this.current.specialType &&
        Number(this.current.specialType) === Number(this.page.total)
      ) {
        this.$message.error('角色已满，不能创建新角色')
        return
      }
      this.title = '创建角色'
      this.imageUrl = ''
      this.currentId = ''
      this.form = {
        roleName: '',
        alias: '',
        fileList: [],
        description: '',
        remark: '',
      }
      this.dialogVisible = true
    },
    submitForm() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      const params = {
        roleName: this.form.roleName,
        alias: this.form.alias,
        description: this.form.description,
        remark: this.form.remark,
      }
      if (this.form.fileList.length) {
        const file = this.form.fileList[0]
        params.file = {
          recordId: file.recordId,
          fileExt: file.fileExt,
          fileFullPath: file.fileFullPath,
          fileName: file.fileName,
          filePath: file.filePath,
        }
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.title === '创建角色') {
            this.$mutate(createVoteRole, {
              input: Object.assign({}, params, {
                voteId: this.current.id,
                roleTypeId: this.activeName,
              }),
            })
              .then((res) => {
                if (!res.errors) {
                  this.getList()
                  this.$message.success('提交成功')
                  this.dialogVisible = false
                } else {
                  this.$message.error('提交失败')
                }
              })
              .finally(() => {
                loading.close()
              })
          } else {
            let params = {
              roleName: this.form.roleName,
              alias: this.form.alias,
              description: this.form.description,
              remark: this.form.remark,
              voteRoleId: this.currentId,
            }
            if (this.form.fileList.length) {
              const file = this.form.fileList[0]
              params.file = {
                recordId: file.recordId,
                fileExt: file.fileExt,
                fileFullPath: file.fileFullPath,
                fileName: file.fileName,
                filePath: file.filePath,
              }
            }
            this.$mutate(updateVoteRole, {
              input: Object.assign({}, params, {
                roleTypeId: this.activeName,
              }),
              id: this.currentId,
            })
              .then((res) => {
                if (!res.errors) {
                  this.getList()
                  this.$message.success('修改成功')
                  this.dialogVisible = false
                } else {
                  this.$message.error('修改失败')
                }
              })
              .finally(() => {
                loading.close()
              })
          }
        }
      })
    },
    editRole(row) {
      this.title = '编辑角色'
      this.title = '编辑用户'
      this.form = {
        roleName: row.roleName,
        alias: row.alias,
        fileList: [],
        description: row.description,
        remark: row.remark,
      }
      row.file &&
        (this.form.fileList = [
          {
            recordId: row.file.recordId,
            fileName: row.file.fileName,
            filePath: row.file.filePath,
            fileExt: row.file.fileExt,
            fileFullPath: row.file.fileFullPath,
          },
        ])
      this.currentId = row.id
      this.imageUrl = row.file ? this.imgUrl + row.file.fileFullPath : ''
      this.dialogVisible = true
    },
    searchConfirm() {
      this.page.current = 1
      this.getList()
    },
    emptyConfirm() {
      this.searchForm = {
        roleName: '',
        alias: '',
        description: '',
      }
      this.searchConfirm()
    },
    getList() {
      this.loading = true
      let filter = {
        roleTypeId: JSON.stringify({
          cond: 'eq',
          value: this.activeName,
        }),
        roleName: JSON.stringify({
          cond: 'like',
          value: this.searchForm.roleName,
        }),
        alias: JSON.stringify({
          cond: 'like',
          value: this.searchForm.alias,
        }),
        description: JSON.stringify({
          cond: 'like',
          value: this.searchForm.description,
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
            if (this.total === '') {
              this.total = this.page.total
            }
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
