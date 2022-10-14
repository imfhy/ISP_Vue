<template>
  <body>
    <el-card class="login-box">
      <div class="img-box">
        <img src="../../assets/img/login.jpg">
      </div>
      <div class="form-box">
        <div class="login-container">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

            <div class="title-container">
              <h3 class="title">SMT排程系统</h3>
            </div>

            <el-form-item prop="username">
              <!-- <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="请输入用户名"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              /> -->
              <el-input
                ref="username"
                v-model="loginForm.username"
                class="login-input"
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
                autocomplete="on"
                size="big"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                ref="password"
                v-model="loginForm.password"
                class="login-input"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                autocomplete="on"
                show-password
                size="big"
              />
            </el-form-item>
            <!-- <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip> -->

            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-top:10px;"
              round
              size="big"
              @click.native.prevent="handleLogin"
            >
              登录
            </el-button>
          </el-form>

          <!-- <el-dialog title="Or connect with" :visible.sync="showDialog">
            Can not be simulated on local, so please combine you own business simulation! ! !
            <br>
            <br>
            <br>
            <social-sign />
          </el-dialog> -->
        </div>
      </div>
    </el-card>
  </body>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>

  .login-form {
    text-align: center;
    position: relative;
    max-width: 100%;
    padding: 70px 55px 30px;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: rgb(122, 122, 122);
      text-align: center;
      margin-bottom: 20%;
      // font-family: 'SimHei';
      // font-weight: bold;
    }
  }
</style>

<style>
.login-box .el-card__body{
  padding: 0px;
}
.login-box {
  width: 900px;
  height: 520px;
  position: absolute;
  top: 0;
  left: 0;
  right:0;
  bottom: 0;
  margin: auto
}
.form-box{
  width: 50%;
  height: 520px;
  float: right;
}
.img-box{
  width: 50%;
  height: 100%;
  float: left;
}
img{width:100%;}
.login-input .el-input__inner {
  border: 0;
  background-color: rgba(209, 202, 202, 0.247) !important;
}
</style>
