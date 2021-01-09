<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-row :gutter="20">
        <el-col :span="21">
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
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="searchForm.createdAt"
              type="datetimerange"
              size="small"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="最后登录时间">
            <el-date-picker
              v-model="searchForm.lastLoginTime"
              type="datetimerange"
              size="small"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
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
      <el-button
        type="primary"
        v-permission="'user_add'"
        size="small"
        @click="createUser"
        >新增用户</el-button
      >
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
          {{ row.role && row.role.name }}
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
          <el-button type="text" size="small" @click="editUser(row)"
            >编辑</el-button
          >
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
      @open="openDialog"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            :disabled="title !== '创建用户'"
            placeholder="用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="form.nickname"
            placeholder="昵称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
            :file-list="searchForm.fileList"
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
  createUser,
  updateUser,
} from '@/graphql/user/user.js'
import { readAll as readRoleList } from '@/graphql/role/role.js'
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
        createdAt: [],
        lastLoginTime: [],
      },
      form: {
        username: '',
        nickname: '',
        fileList: [],
        roleId: '',
        remark: '',
      },
      roleList: [],
      title: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
      dialogVisible: false,
      imageUrl: '',
      url: '',
      current: '',
    }
  },
  beforeMount() {
    this.getList()
    this.url = this.$baseURL
  },
  mixins: [mixin],
  methods: {
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
    editUser(row) {
      this.title = '编辑用户'
      this.form = {
        username: row.username,
        nickname: row.nickname,
        fileList: [],
        roleId: row.roleId || (row.role && row.role.id),
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
      this.current = row.id
      this.imageUrl = row.file ? this.imgUrl + row.file.fileFullPath : ''
      this.dialogVisible = true
    },
    createUser() {
      this.title = '创建用户'
      this.current = ''
      this.imageUrl = ''
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    openDialog() {
      if (!this.roleList.length) {
        this.getRoleList()
      }
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.imageUrl = ''
      this.dialogVisible = false
    },
    searchConfirm() {
      this.page.current = 1
      this.getList()
    },
    submitForm() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.title === '创建用户') {
            this.$mutate(createUser, {
              input: this.form,
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
              nickname: this.form.nickname,
              fileList: this.form.fileList,
              roleId: this.form.roleId,
              remark: this.form.remark,
            }
            this.$mutate(updateUser, {
              input: params,
              id: this.current,
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
    emptyConfirm() {
      this.searchForm = {
        username: '',
        nickname: '',
        createdAt: [],
        lastLoginTime: [],
      }
      this.searchConfirm()
    },
    getRoleList() {
      this.$query(readRoleList, {
        page: {
          limit: 9999,
          offset: 0,
        },
      }).then((res) => {
        if (!res.errors) {
          this.roleList = res.data.roleList
        } else {
          this.$message.error('加载失败')
        }
      })
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
            createdAt: JSON.stringify({
              cond: 'rangeTime',
              value: this.searchForm.createdAt,
            }),
            lastLoginTime: JSON.stringify({
              cond: 'rangeTime',
              value: this.searchForm.lastLoginTime,
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
