<template>
  <div id="main-box">
    <el-card>
      <el-row>
        <el-col :span="16">
          <div>
            <el-button type="primary" @click="createUserDialog">
              <i class="el-icon-plus" />创建用户
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="float: right;">
            <el-tooltip class="item" effect="dark" content="刷新表格" placement="top">
              <el-button
                size="small"
                icon="el-icon-refresh"
                circle
                @click="refreshTableData"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看说明" placement="top">
              <el-button
                size="small"
                icon="el-icon-warning-outline"
                circle
                @click="helpTips"
              />
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table
          id="mytable"
          v-loading="loading"
          :data="table_data"
          :header-cell-style="{background:'#eef1f6',color:'#606266', padding: '3px'}"
          :cell-style="{padding: '3px'}"

          stripe
        >
          <el-table-column prop="username" label="用户名" width="160" />
          <el-table-column prop="remark" label="备注" width="160" />
          <el-table-column prop="roles" label="用户权限" width="160">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.roles === 'admin'" size="small">超级管理员</el-tag>
              <el-tag v-else-if="scope.row.roles === 'common'" size="small">普通管理员</el-tag>
              <el-tag v-else-if="scope.row.roles === 'program'" size="small">程序员</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="电子邮件地址" width="200" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="enable" label="是否启用" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.enable === true" size="small" type="success">已启用</el-tag>
              <el-tag v-else-if="scope.row.enable === false" size="small" type="danger">未启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="150" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改密码" placement="top">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-edit"
                  circle
                  @click="handleModifyPassword(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看或修改信息" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit-outline"
                  circle
                  @click="handleModifyUserInfo(scope.$index, scope.row)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  @click="handleDeleteUser(scope.$index, scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      v-el-drag-dialog
      :title="dialogTitle"
      :visible.sync="dataDialogVisible"
      width="60%"
      :before-close="handleFormClose"
      @dragDialog="handleDrag"
    >
      <el-form ref="$form" :model="model" label-position="left" size="small">
        <div v-if="dialogBtnType === true">
          <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" tag="div">
              <el-form-item :rules="rules.username" prop="username" label="用户名">
                <el-input v-model="model.username" placeholder="请输入用户名" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" tag="div">
              <el-form-item :rules="rules.password" prop="password" label="密码">
                <el-input v-model="model.password" placeholder="请输入密码" clearable show-password />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="dialogBtnType === false">
          <el-form-item :rules="rules.username" prop="username" label="用户名">
            <el-input v-model="model.username" placeholder="请输入用户名" clearable />
          </el-form-item>
        </div>
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.roles" prop="roles" label="用户权限">
              <el-select v-model="model.roles" placeholder="请选择用户权限" :style="{width: '100%'}">
                <el-option v-for="(item) in permissionOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="!!item.disabled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.remark" prop="remark" label="备注">
              <el-input v-model="model.remark" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.enable" prop="enable" label="是否启用">
              <el-switch v-model="model.enable" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.email" prop="email" label="电子邮件地址">
              <el-input v-model="model.email" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :rules="rules.description" prop="description" label="描述">
          <el-input v-model="model.description" placeholder="请输入" :rows="2" type="textarea" clearable />
        </el-form-item>
        <el-row :gutter="20" type="flex" justify="start" align="top" tag="div">
          <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.create_time" prop="create_time" label="创建时间">
              <el-input v-model="model.create_time" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0" :push="0" :pull="0" tag="div">
            <el-form-item :rules="rules.last_login_time" prop="last_login_time" label="最后一次登录时间">
              <el-input v-model="model.last_login_time" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleFormClose">关闭</el-button>
        <el-button v-if="dialogBtnType === true" type="primary" @click="createUser">创建</el-button>
        <el-button v-else-if="dialogBtnType === false" type="primary" @click="modifyUserInfo">确认修改</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="用户权限管理说明"
      :visible.sync="helpDialogVisible"
      width="60%"
      @dragDialog="handleDrag"
    >
      <p>超级管理员：拥有最高权限，支持管理所有表格和用户</p>
      <p>普通管理员：支持管理所有表格，但无法管理用户</p>
      <p>程序员：仅支持对程序表进行操作</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="helpDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="修改用户密码"
      :visible.sync="passwordDialogVisible"
      width="30%"
      :before-close="handlePasswordClose"
      @dragDialog="handleDrag"
    >
      <el-form ref="$pwdForm" :model="pwdModel" label-position="left" label-width="100px" size="small">
        <el-form-item :rules="pwdRules.password" prop="password" label="新的密码">
          <el-input v-model="pwdModel.password" placeholder="请输入新的密码" :rows="2" show-password clearable />
        </el-form-item>
        <el-form-item :rules="pwdRules.password_twice" prop="password_twice" label="确认密码">
          <el-input v-model="pwdModel.password_twice" placeholder="请再次输入密码" :rows="2" show-password clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePasswordClose">关闭</el-button>
        <el-button type="primary" @click="modifyUserPassword">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import { Loading } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog'
import { GetAllUserInfo, CreateUser, ModifyUserPassword, ModifyUserInfo, DeleteUser } from '@/api/Permission/RolePermission'
import { PermissionOptions } from '@/utils/items'
export default {
  name: 'RolePermission',
  directives: { elDragDialog },
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.checkPass(value) < 4) {
        callback(new Error('密码应由字母、数字、符号三种组成，且必须包含大小写'))
      } else {
        callback()
      }
    }
    return {
      loading: true, // 表格加载动画
      loadingInstance: null,
      table_data: [], // 表格数据
      dialogTitle: '', // 表单dialog标题
      dataDialogVisible: false, // 表单dialog显示
      dialogBtnType: true, // 表单dialog按钮 true为添加按钮 false为保存按钮
      helpDialogVisible: false, // 帮助提示dialog
      passwordDialogVisible: false, // 修改密码dialog
      isClick: false, // 是否点击了保存或者提交
      // 表单相关数据
      forms: ['$form'],
      pwdForms: ['$pwdForm'],
      model: {
        id: '',
        username: '',
        password: '',
        roles: '',
        remark: '',
        enable: '',
        email: '',
        description: '',
        create_time: '',
        last_login_time: ''
      },
      // 修改前的表单内容，用于对比表单前后的变化（应用：关闭前提示修改未保存）
      modelOriginal: {
        id: '',
        username: '',
        password: '',
        roles: '',
        remark: '',
        enable: '',
        email: '',
        description: '',
        create_time: '',
        last_login_time: ''
      },
      pwdModel: {
        password: '',
        password_twice: ''
      },
      rules: {
        username: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 5,
          max: 20,
          message: '用户名长度必须为 5 到 20 个字符',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 8,
          max: 20,
          message: '密码长度必须为 8 到 20 个字符',
          trigger: 'blur'
        }, {
          validator: validatePass,
          trigger: 'blur'
        }],
        roles: [{
          required: true,
          message: '用户权限不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '备注不能为空',
          trigger: 'blur'
        }],
        enable: [{
          required: true,
          message: '是否启用不能为空',
          trigger: 'change'
        }],
        email: [{
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        description: [],
        create_time: [],
        last_login_time: []
      },
      pwdRules: {
        password: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 8,
          max: 20,
          message: '密码长度必须为 8 到 20 个字符',
          trigger: 'blur'
        }, {
          validator: validatePass,
          trigger: 'blur'
        }],
        password_twice: [{
          required: true,
          message: '请再次输入密码',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 8,
          max: 20,
          message: '密码长度必须为 8 到 20 个字符',
          trigger: 'blur'
        }, {
          validator: validatePass,
          trigger: 'blur'
        }]
      },
      permissionOptions: PermissionOptions, // 维护线别
      dataTableSelections: [], // 表格选中的数据
      userName: '' // 要修改密码的用户名
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getAllUserInfo()
  },
  mounted() {

  },
  methods: {
    // dialog可拖拽
    handleDrag() {
      // this.$refs.select.blur()
    },
    // 获取所有用户信息
    getAllUserInfo() {
      this.loading = true
      GetAllUserInfo().then(res => {
        if (res.code === 20000) {
          this.table_data = res.table_data
          this.loading = false
        }
      })
    },
    // 刷新表格数据
    refreshTableData() {
      this.getAllUserInfo()
    },
    checkPass(pass) {
      // 密码长度大于6开始判断密码强度
      if (pass.length < 6) {
        return 0
      }
      //  判断密码中是否有数字、大小写字母、特殊符号
      var ls = 0 // 默认等级是0
      // 判断有没有小写字母
      if (pass.match(/([a-z])+/)) {
        ls++
      }
      // 判断有没有大写字母
      if (pass.match(/([A-Z])+/)) {
        ls++
      }
      // 判断数字
      if (pass.match(/([0-9])+/)) {
        ls++
      }
      // 判断有没有特殊符号
      if (pass.match(/[^a-zA-Z0-9]+/)) {
        ls++
      }
      return ls // 默认传出是1
    },
    // 创建用户dialog
    createUserDialog() {
      this.dialogTitle = '创建用户'
      this.dialogBtnType = true
      this.dataDialogVisible = true
      this.isClick = false
    },
    // 创建用户
    createUser() {
      this.isClick = true
      const data = this.model
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          CreateUser(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: '创建成功',
                message: res.message,
                type: 'success'
              })
              setTimeout(() => {
                this.closeFormDialog()
              }, 1000)
              this.refreshTableData()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写信息！'
          })
        }
      })
    },
    // 修改密码dialog
    handleModifyPassword(index, row) {
      this.passwordDialogVisible = true
      this.userName = row.username
    },
    // 关闭修改密码dialog
    handlePasswordClose() {
      this.pwdModel['password'] = ''
      this.pwdModel['password_twice'] = ''
      this.passwordDialogVisible = false
      this.$refs['$pwdForm'].clearValidate()
    },
    modifyUserPassword() {
      if (this.pwdModel['password'] !== this.pwdModel['password_twice']) {
        this.$message({
          type: 'error',
          message: '两次输入密码不一致，请重新输入！'
        })
        return
      }
      const data = this.pwdModel
      data['username'] = this.userName
      this.$refs['$pwdForm'].validate((valid) => {
        if (valid) {
          ModifyUserPassword(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: '修改成功',
                message: res.message,
                type: 'success'
              })
              setTimeout(() => {
                this.handlePasswordClose()
              }, 1000)
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写密码！'
          })
        }
      })
    },
    // 修改用户信息dialog
    handleModifyUserInfo(index, row) {
      // 修改dialog
      this.dialogTitle = '修改用户信息'
      this.dialogBtnType = false
      this.scopeIndex = index
      this.scopeRow = row
      // 显示表单数据
      for (const key in this.model) {
        this.model[key] = row[key]
      }
      // 保存原来的表单数据，用于对比变化
      for (const key in this.modelOriginal) {
        this.modelOriginal[key] = this.model[key]
      }
      // 显示dialog
      this.dataDialogVisible = true
      this.isClick = false
    },
    // 修改用户信息
    modifyUserInfo() {
      if (!this.checkFormChange()) {
        this.$message({
          type: 'info',
          message: '数据未修改，无需提交'
        })
        return
      }
      this.isClick = true
      const data = this.model
      this.$refs['$form'].validate((valid) => {
        if (valid) {
          ModifyUserInfo(data).then(res => {
            if (res.code === 20000) {
              this.$notify({
                title: '修改成功',
                message: res.message,
                type: 'success'
              })
              this.refreshTableData()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '提交失败，请按照要求填写信息！'
          })
        }
      })
    },
    handleDeleteUser(index, row) {
      this.$confirm('确定要删除该用户？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'btnDanger',
        type: 'warning'
      }).then(() => {
        const data = {}
        data['id'] = row.id
        console.log('删除的id', row.id)
        DeleteUser(data).then(res => {
          if (res.code === 20000) {
            this.$notify({
              title: '删除成功',
              message: res.message,
              type: 'success'
            })
            this.refreshTableData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 检测表单数据是否发生变化，用于提示
    checkFormChange() {
      let isChange = false
      for (const key in this.model) {
        if (this.model[key] !== this.modelOriginal[key]) {
          isChange = true
          break
        }
      }
      return isChange
    },
    // 表单dialog关闭前提示
    handleFormClose() {
      if (this.checkFormChange() && !this.isClick) {
        this.$confirm('数据未提交，确定要关闭窗口？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.closeFormDialog()
        }).catch(() => {

        })
      } else {
        this.closeFormDialog()
      }
    },
    // 关闭表单dialog的一些操作
    closeFormDialog() {
      this.dataDialogVisible = false
      for (const key in this.model) {
        this.model[key] = ''
        this.modelOriginal[key] = ''
      }
      this.$refs['$form'].clearValidate() // 清除表单验证的文字提示信息
    },
    // 帮助提示按钮
    helpTips() {
      this.helpDialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/Permission/RolePermission.scss';
</style>
<style>
.btnDanger{
  background-color: #F56C6C !important;
  border-color: #F56C6C !important;
}
.btnDanger:hover{
  background-color: #f04747 !important;
  border-color: #f04747 !important;
}
.el-pagination {
    text-align: center;
}
.el-table .warning-row {
  color: #E6A23C;
}

</style>
