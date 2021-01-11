<template>
  <div>
    <div>当前类型名称: {{ row.name }}</div>
    <div class="my10">
      <el-button type="primary" size="small" @click="createDic" v-if="row.id"
        >新增</el-button
      >
    </div>
    <el-table :data="tableData" stripe border v-loading="loading">
      <el-table-column prop="index" label="序号" align="center" width="50">
        <template slot-scope="scope">
          {{ count + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="字典名称" align="center">
      </el-table-column>
      <el-table-column prop="value" label="字典编码" align="center">
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="updateDic(row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteDic(row)"
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
        <el-form-item label="字典名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="字典名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="字典编码" prop="value">
          <el-input
            v-model="form.value"
            placeholder="字典编码"
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
  createDic,
  updateDic,
  deleteDic,
} from '@/graphql/dic/dic.js'
import mixin from '@/utils/mixin'
export default {
  name: 'Dic',
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
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
  mixins: [mixin],
  watch: {
    row: {
      handler(val) {
        if (val.id) {
          this.page.current = 1
          this.getList()
        } else {
          this.tableData = []
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    updateDic(row) {
      this.title = '编辑字典'
      this.form = {
        name: row.name,
        value: row.value,
        remark: row.remark,
      }
      this.current = row.id
      this.dialogVisible = true
    },
    createDic() {
      this.title = '创建字典'
      this.current = ''
      this.form = {
        name: '',
        value: '',
        remark: '',
      }
      this.dialogVisible = true
    },
    deleteDic(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$mutate(deleteDic, {
          id: row.id,
        }).then((res) => {
          if (!res.errors) {
            this.getList()
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
          if (this.title === '创建字典') {
            this.$mutate(createDic, {
              input: Object.assign({}, this.form, { typeId: this.row.id }),
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
            this.$mutate(updateDic, {
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
    getList() {
      this.loading = true
      let filter = {
        typeId: JSON.stringify({
          cond: 'eq',
          value: this.row.id,
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
