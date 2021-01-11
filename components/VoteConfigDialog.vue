<template>
  <div>
    <div class="operation">
      <el-button size="mini" type="primary" @click="submitForm('0')"
        >创建比赛</el-button
      >
      <el-button size="mini" type="primary" @click="submitForm('3')"
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
                  v-model="form.ruleContent"
                  maxlength="10"
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
                <el-radio-group v-model="form.hasReward">
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
                  maxlength="10"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="开始时间"
                prop="startTime"
                style="width: 100%"
              >
                <el-date-picker
                  v-model="form.startTime"
                  size="small"
                  type="datetime"
                  style="width: 100%"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间" prop="endTime" style="width: 100%">
                <el-date-picker
                  v-model="form.endTime"
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
                <el-radio-group v-model="form.hasSpecialVote">
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
                <el-radio-group v-model="form.showMap">
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
                <el-radio-group v-model="form.showChart">
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
                <el-radio-group v-model="form.voteQqVip">
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
                <el-radio-group v-model="form.diyBg">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="分类" style="width: 100%">
                <el-tag
                  :key="tag"
                  v-for="tag in categoryList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >新增</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" style="width: 100%">
                <el-input
                  type="textarea"
                  autosize
                  v-model="form.remark"
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
export default {
  name: 'VoteConfigDialog',
  data() {
    return {
      url: '',
      imageUrl: '',
      form: {
        voteName: '',
        voteType: '',
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
      },
      submitForm(status) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.categoryList.length) {
              this.$message.error('分类不能为空')
              return
            }
          }
        })
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
    }
  },
  beforeMount() {
    this.url = this.$baseURL
  },
  computed: {
    ...mapGetters(['dicList']),
  },
  methods: {
    handleClose(tag) {
      this.categoryList.splice(this.categoryList.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
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
