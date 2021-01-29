<template>
  <div>
    <div class="operation">
      <el-button
        size="mini"
        type="primary"
        v-if="mode === 'add' && formEdit"
        @click="submitForm('0')"
        >创建比赛</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="mode === 'change' && formEdit"
        @click="draftCreateVote"
        >创建比赛</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="mode === 'edit' && formEdit"
        @click="updateForm"
        >更新比赛</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="mode === 'add' && formEdit"
        @click="submitForm('3')"
        >保存草稿</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="mode === 'change' && formEdit"
        @click="updateForm"
        >保存草稿</el-button
      >
      <el-button size="mini" type="danger" @click="goBack">关闭</el-button>
    </div>
    <el-form
      :inline="true"
      :model="form"
      :rules="rules"
      ref="form"
      class="mt20"
      label-width="110px"
    >
      <el-row :gutter="24">
        <el-col :span="18">
          <el-row :gutter="24" type="flex" style="flex-wrap: wrap">
            <el-col :span="6">
              <el-form-item
                label="比赛名称"
                prop="voteName"
                style="width: 100%"
              >
                <el-input
                  v-model="form.voteName"
                  :disabled="mode === 'edit' || !formEdit"
                  size="small"
                  style="width: 100%"
                  placeholder="比赛名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="比赛类型"
                prop="voteType"
                style="width: 100%"
              >
                <el-select
                  v-model="form.voteType"
                  :disabled="mode === 'edit' || !formEdit"
                  size="small"
                  style="width: 100%"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in dicList['vote_type']"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="form.voteType === '1'">
              <el-form-item
                label="评选类型"
                prop="specialType"
                style="width: 100%"
              >
                <el-select
                  v-model="form.specialType"
                  @change="changeEndTime"
                  :disabled="mode === 'edit' || !formEdit"
                  size="small"
                  style="width: 100%"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in dicList['special_type']"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="规则文本"
                prop="ruleContent"
                style="width: 100%"
              >
                <el-input
                  type="textarea"
                  autosize
                  style="width: 100%"
                  placeholder="请输入内容"
                  :disabled="!formEdit"
                  v-model="form.ruleContent"
                  maxlength="500"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否有奖励"
                prop="hasReward"
                style="width: 100%"
              >
                <el-radio-group
                  v-model="form.hasReward"
                  :disabled="mode === 'edit' || !formEdit"
                >
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.hasReward === '0'">
              <el-form-item
                label="奖励文本"
                prop="rewardContent"
                style="width: 100%"
              >
                <el-input
                  type="textarea"
                  autosize
                  style="width: 100%"
                  placeholder="请输入内容"
                  v-model="form.rewardContent"
                  :disabled="!formEdit"
                  maxlength="500"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              v-show="
                form.voteType === '0' ||
                (form.voteType === '1' && form.specialType)
              "
            >
              <el-form-item
                label="开始时间"
                prop="startTime"
                style="width: 100%"
              >
                <el-date-picker
                  v-model="form.startTime"
                  :disabled="mode === 'edit' || !formEdit"
                  @change="changeEndTime"
                  size="small"
                  type="datetime"
                  style="width: 100%"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              v-show="
                form.voteType === '0' ||
                (form.voteType === '1' && form.specialType)
              "
            >
              <el-form-item label="结束时间" prop="endTime" style="width: 100%">
                <el-date-picker
                  v-model="form.endTime"
                  :disabled="
                    mode === 'edit' || !formEdit || form.voteType === '1'
                  "
                  size="small"
                  type="datetime"
                  style="width: 100%"
                  placeholder="选择结束时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否有特殊票"
                prop="hasSpecialVote"
                style="width: 100%"
              >
                <el-radio-group
                  v-model="form.hasSpecialVote"
                  :disabled="mode === 'edit' || !formEdit"
                >
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="票数公开类型"
                prop="voteShowType"
                style="width: 100%"
              >
                <el-select
                  v-model="form.voteShowType"
                  size="small"
                  style="width: 100%"
                  :disabled="!formEdit"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in dicList['vote_show_type']"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="票数更新频率"
                prop="voteUpdateType"
                style="width: 100%"
              >
                <el-select
                  v-model="form.voteUpdateType"
                  size="small"
                  style="width: 100%"
                  :disabled="!formEdit"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in dicList['vote_update_type']"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否展示地图"
                prop="showMap"
                style="width: 100%"
              >
                <el-radio-group v-model="form.showMap" :disabled="!formEdit">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否展示图表"
                prop="showChart"
                style="width: 100%"
              >
                <el-radio-group v-model="form.showChart" :disabled="!formEdit">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否限制会员"
                prop="voteQqVip"
                style="width: 100%"
              >
                <el-radio-group v-model="form.voteQqVip" :disabled="!formEdit">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="限制等级"
                prop="voteLevel"
                style="width: 100%"
              >
                <el-input-number
                  v-model="form.voteLevel"
                  :disabled="!formEdit"
                  :controls="false"
                  :min="0"
                  :max="300"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否显示定制"
                prop="diyBg"
                style="width: 100%"
              >
                <el-radio-group v-model="form.diyBg" :disabled="!formEdit">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="数据分析"
                prop="dataAnalysis"
                style="width: 100%"
              >
                <el-select
                  v-model="form.dataAnalysis"
                  size="small"
                  style="width: 100%"
                  :disabled="!formEdit"
                  placeholder="请选择"
                  multiple
                  clearable
                >
                  <el-option
                    v-for="item in dataAnalysisList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="分类" style="width: 100%">
                <el-tag
                  :key="tag"
                  v-for="tag in categoryList"
                  :closable="formEdit"
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <template v-if="formEdit">
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    :disabled="!formEdit"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    :disabled="!formEdit"
                    size="small"
                    @click="showInput"
                    >新增</el-button
                  >
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" style="width: 100%">
                <el-input
                  type="textarea"
                  autosize
                  v-model="form.remark"
                  :disabled="!formEdit"
                  placeholder="请输入内容"
                  maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-upload
            class="avatar-uploader"
            :action="url + '/file/simpleUpload'"
            :disabled="!formEdit"
            :headers="{
              Authorization: `Bearer ${$cookies.get('token')}`,
            }"
            :data="{
              fileDic: 'vote-bg',
            }"
            :show-file-list="false"
            :limit="1"
            :file-list="fileList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  createVote,
  readOne,
  updateVote,
  draftUpdateVote,
} from '@/graphql/vote/vote'
import { readAll } from '@/graphql/data/analysis.js'
export default {
  name: 'VoteConfigDialog',
  props: {
    mode: {
      type: String,
      default: 'add',
    },
    inData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      url: '',
      imageUrl: '',
      formEdit: false,
      form: {
        voteName: '',
        voteType: '',
        specialType: '',
        ruleContent: '',
        hasReward: '',
        rewardContent: '',
        startTime: '',
        endTime: '',
        hasSpecialVote: '',
        voteShowType: '',
        voteUpdateType: '',
        showMap: '',
        showChart: '',
        voteQqVip: '',
        voteLevel: 0,
        diyBg: '',
        remark: '',
        dataAnalysis: [],
      },
      rules: {
        voteName: [
          { required: true, message: '请输入比赛名称', trigger: 'blur' },
        ],
        ruleContent: [
          { required: true, message: '请输入规则文本', trigger: 'blur' },
        ],
        voteType: [
          { required: true, message: '请选择比赛类型', trigger: 'change' },
        ],
        hasReward: [
          { required: true, message: '请选择', trigger: ['change', 'blur'] },
        ],
        hasSpecialVote: [
          { required: true, message: '请选择', trigger: ['change', 'blur'] },
        ],
        showMap: [
          { required: true, message: '请选择', trigger: ['change', 'blur'] },
        ],
        showChart: [
          { required: true, message: '请选择', trigger: ['change', 'blur'] },
        ],
        voteQqVip: [
          { required: true, message: '请选择', trigger: ['change', 'blur'] },
        ],
        diyBg: [
          { required: true, message: '请选择', trigger: ['change', 'blur'] },
        ],
        startTime: [{ required: true, message: '请选择', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择', trigger: 'change' }],
        voteShowType: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        voteUpdateType: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
      },
      fileList: [],
      categoryList: [],
      inputVisible: false,
      inputValue: '',
      dataAnalysisList: [],
    }
  },
  beforeMount() {
    this.url = this.$baseURL
    this.getDataAnalysisList()
  },
  computed: {
    ...mapGetters(['dicList']),
  },
  methods: {
    getDataAnalysisList() {
      this.$query(readAll, {
        page: {
          limit: 999,
          offset: 0,
        },
      }).then((res) => {
        if (!res.errors) {
          this.dataAnalysisList = res.data.data
        } else {
          this.$message.error('加载失败')
        }
      })
    },
    changeEndTime(val) {
      //   128 64 32 16 8 4 2
      //   8  8  4  4 2 1 1
      if (this.form.voteType === '1' && this.form.startTime) {
        this.form.endTime = this.$moment(this.form.startTime).add(
          this.form.specialType === '128' ? 28 : 20,
          'd'
        )
      }
    },
    submitForm(status) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.categoryList.length) {
            this.$message.error('分类不能为空')
            return
          }
          if (this.form.voteType === '0' && this.categoryList.length > 1) {
            this.$message.error('普通类型下分类不能大于1个')
            return
          }
          const form = {
            voteName: this.form.voteName,
            voteType: this.form.voteType,
            specialType: this.form.specialType,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            ruleContent: this.form.ruleContent,
            hasReward: this.form.hasReward,
            rewardContent: this.form.rewardContent,
            remark: this.form.remark,
            roleInput: this.categoryList.map((v) => ({ name: v })),
            configInput: {
              hasSpecialVote: this.form.hasSpecialVote,
              voteShowType: this.form.voteShowType,
              voteUpdateType: this.form.voteUpdateType,
              showMap: this.form.showMap,
              showChart: this.form.showChart,
              voteLevel: this.form.voteLevel,
              voteQqVip: this.form.voteQqVip,
              diyBg: this.form.diyBg,
              dataAnalysis: this.form.dataAnalysis.join(','),
            },
            status,
          }
          if (this.fileList.length) {
            form.configInput.file = {
              recordId: '',
              fileExt: this.fileList[0].fileExt,
              fileFullPath: this.fileList[0].fileFullPath,
              fileName: this.fileList[0].fileName,
              filePath: this.fileList[0].filePath,
            }
          }
          this.$mutate(createVote, {
            input: form,
          }).then((res) => {
            if (!res.errors) {
              this.$message.success('创建成功')
              this.goBack()
            } else {
              this.$message.error('创建失败')
            }
          })
        }
      })
    },
    draftCreateVote() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.categoryList.length) {
            this.$message.error('分类不能为空')
            return
          }
          if (this.form.voteType === '0' && this.categoryList.length > 1) {
            this.$message.error('普通类型下分类不能大于1个')
            return
          }
          const form = {
            voteName: this.form.voteName,
            voteType: this.form.voteType,
            specialType: this.form.specialType,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            ruleContent: this.form.ruleContent,
            rewardContent: this.form.rewardContent,
            remark: this.form.remark,
            roleInput: this.categoryList.map((v) => ({ name: v })),
            configInput: {
              voteConfigId: this.form.voteConfigId,
              voteShowType: this.form.voteShowType,
              voteUpdateType: this.form.voteUpdateType,
              showMap: this.form.showMap,
              showChart: this.form.showChart,
              voteLevel: this.form.voteLevel,
              voteQqVip: this.form.voteQqVip,
              diyBg: this.form.diyBg,
              dataAnalysis: this.form.dataAnalysis.join(','),
            },
            status: '0',
          }
          if (this.fileList.length) {
            form.configInput.file = {
              recordId: this.form.voteConfigId,
              fileExt: this.fileList[0].fileExt,
              fileFullPath: this.fileList[0].fileFullPath,
              fileName: this.fileList[0].fileName,
              filePath: this.fileList[0].filePath,
            }
          }
          this.$mutate(draftUpdateVote, {
            input: form,
            id: this.inData.id,
          }).then((res) => {
            if (!res.errors) {
              this.$message.success('创建成功')
              this.goBack()
            } else {
              this.$message.error('创建失败')
            }
          })
        }
      })
    },
    updateForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.categoryList.length) {
            this.$message.error('分类不能为空')
            return
          }
          if (this.form.voteType === '0' && this.categoryList.length > 1) {
            this.$message.error('普通类型下分类不能大于1个')
            return
          }
          let extra =
            this.mode === 'edit'
              ? {}
              : {
                  voteName: this.form.voteName,
                  voteType: this.form.voteType,
                  startTime: this.form.startTime,
                  endTime: this.form.endTime,
                  specialType: this.form.specialType,
                }
          const form = {
            ...extra,
            ruleContent: this.form.ruleContent,
            rewardContent: this.form.rewardContent,
            remark: this.form.remark,
            roleInput: this.categoryList.map((v) => ({ name: v })),
            configInput: {
              voteConfigId: this.form.voteConfigId,
              voteShowType: this.form.voteShowType,
              voteUpdateType: this.form.voteUpdateType,
              showMap: this.form.showMap,
              showChart: this.form.showChart,
              voteLevel: this.form.voteLevel,
              voteQqVip: this.form.voteQqVip,
              diyBg: this.form.diyBg,
              dataAnalysis: this.form.dataAnalysis.join(','),
            },
          }
          if (this.fileList.length) {
            form.configInput.file = {
              recordId: this.form.voteConfigId,
              fileExt: this.fileList[0].fileExt,
              fileFullPath: this.fileList[0].fileFullPath,
              fileName: this.fileList[0].fileName,
              filePath: this.fileList[0].filePath,
            }
          }
          this.$mutate(this.mode === 'edit' ? updateVote : draftUpdateVote, {
            input: form,
            id: this.inData.id,
          }).then((res) => {
            if (!res.errors) {
              this.$message.success('更新成功')
              this.goBack()
            } else {
              this.$message.error('更新失败')
            }
          })
        }
      })
    },
    handleClose(tag) {
      this.categoryList.splice(this.categoryList.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    getDetail(row, mode = true) {
      this.formEdit = mode
      this.$query(readOne, { id: row.id }).then((res) => {
        if (!res.data.errors) {
          const data = res.data.data
          this.form = {
            voteName: data.voteName,
            voteType: data.voteType,
            specialType: data.specialType,
            ruleContent: data.ruleContent,
            hasReward: data.hasReward,
            rewardContent: data.rewardContent,
            startTime: data.startTime,
            endTime: data.endTime,
            hasSpecialVote: data.voteConfig.hasSpecialVote,
            voteShowType: data.voteConfig.voteShowType,
            voteUpdateType: data.voteConfig.voteUpdateType,
            showMap: data.voteConfig.showMap,
            showChart: data.voteConfig.showChart,
            voteQqVip: data.voteConfig.voteQqVip,
            voteLevel: data.voteConfig.voteLevel,
            diyBg: data.voteConfig.diyBg,
            remark: data.remark,
            voteConfigId: data.voteConfig.id,
            dataAnalysis: (data.voteConfig.dataAnalysis || '').split(','),
          }
          if (data.voteConfig.file) {
            data.voteConfig.file &&
              (this.fileList = [
                {
                  recordId: data.voteConfig.file.recordId,
                  fileName: data.voteConfig.file.fileName,
                  filePath: data.voteConfig.file.filePath,
                  fileExt: data.voteConfig.file.fileExt,
                  fileFullPath: data.voteConfig.file.fileFullPath,
                },
              ])
            this.imageUrl = data.voteConfig.file
              ? this.imgUrl + data.voteConfig.file.fileFullPath
              : ''
          }
          this.categoryList = data.voteRoleType.map((v) => v.name)
        } else {
          this.$message.error('加载失败')
        }
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.categoryList.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    goBack() {
      this.$refs.form.resetFields()
      this.imageUrl = ''
      this.fileList = []
      this.categoryList = []
      this.$emit('close')
    },
    handleAvatarSuccess(res, file) {
      if (res.code == '0') {
        this.fileList = [Object.assign({}, res.data, { recordId: '' })]
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
  },
}
</script>

<style lang="scss" scoped>
.el-form--inline::v-deep .el-form-item__content {
  width: calc(100% - 110px);
}
</style>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
