<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="数据分析类型名称">
        <el-input
          v-model="searchForm.name"
          size="small"
          clearable
          placeholder="数据分析类型名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据分析类型编码">
        <el-input
          v-model="searchForm.value"
          size="small"
          clearable
          placeholder="数据分析类型编码"
        ></el-input>
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" size="small" @click="searchConfirm"
          >搜索</el-button
        >
        <el-button type="danger" size="small" @click="emptyConfirm"
          >清空</el-button
        >
      </el-form-item>
    </el-form>
    <div class="my10">
      <el-button type="primary" size="small" @click="createDataAnalysisType"
        >新增类型</el-button
      >
    </div>
    <el-table
      :data="tableData"
      stripe
      border
      v-loading="loading"
      @row-click="changeRow"
    >
      <el-table-column prop="index" label="序号" align="center" width="50">
        <template slot-scope="scope">
          {{ count + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="数据分析类型名称" align="center">
      </el-table-column>
      <el-table-column prop="value" label="数据分析类型编码" align="center">
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="updateDataAnalysisType(row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteDataAnalysisType(row)"
            >删除</el-button
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
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="数据分析类型名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="数据分析类型名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="数据分析类型编码" prop="value">
          <el-input
            v-model="form.value"
            placeholder="数据分析类型编码"
            clearable
          ></el-input>
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
  createDataAnalysisType,
  updateDataAnalysisType,
  deleteDataAnalysisType,
} from '@/graphql/data/analysis.js'
import mixin from '@/utils/mixin'
export default {
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      tableData: [],
      loading: false,
      searchForm: {
        name: '',
        value: '',
      },
      form: {
        name: '',
        value: '',
        remark: '',
      },
      title: '',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        value: [{ required: true, message: '请输入编码', trigger: 'blur' }],
      },
      dialogVisible: false,
      current: '',
    }
  },
  beforeMount() {
    this.getList()
  },
  mixins: [mixin],
  methods: {
    updateDataAnalysisType(row) {
      this.title = '编辑数据分析类型'
      this.form = {
        name: row.name,
        value: row.value,
        remark: row.remark,
      }
      this.current = row.id
      this.dialogVisible = true
    },
    createDataAnalysisType() {
      this.title = '创建数据分析类型'
      this.current = ''
      this.form = {
        name: '',
        value: '',
        remark: '',
      }
      this.dialogVisible = true
    },
    changeRow(row) {
      this.$emit('change', row)
    },
    deleteDataAnalysisType(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$mutate(deleteDataAnalysisType, {
          id: row.id,
        }).then((res) => {
          if (!res.errors) {
            this.getList()
            this.$emit('change', {})
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    handleClose() {
      this.$refs.form.resetFields()
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
          if (this.title === '创建数据分析类型') {
            this.$mutate(createDataAnalysisType, {
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
            this.$mutate(updateDataAnalysisType, {
              input: this.form,
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
        name: '',
        value: '',
      }
      this.searchConfirm()
    },
    getList() {
      this.loading = true
      let filter = {
        name: JSON.stringify({
          cond: 'like',
          value: this.searchForm.name,
        }),
        value: JSON.stringify({
          cond: 'eq',
          value: this.searchForm.value,
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
        this.$query(readCount, {
          filter,
        }),
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
