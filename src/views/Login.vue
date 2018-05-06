<template>
  <div class="login">
    <el-form ref="form" :model="form" class="container" :rules="rules">
      <el-form-item>
        <img src="../assets/avatar.jpg" alt="" class="avatar">
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="form.username" prefix-icon="myicon myicon-user" placeholder="请输入帐号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" prefix-icon="myicon myicon-key" placeholder="请输入密码" type="password" @keydown.enter.native="toLogin"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" round class="login-btn" @click="toLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { checkLogin } from '@/api'
// import { mapMutations } from '@/store/store.js'
// import store from '@/store/store.js'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '帐号在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '密码在 5 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    toLogin () {
      var patten = new RegExp(/^[a-zA-Z0-9]{5,10}$/)
      console.log(patten.test(this.form.username), patten.test(this.form.password))
      if (patten.test(this.form.username) && patten.test(this.form.password)) {
        checkLogin({username: this.form.username, password: this.form.password})
          .then(res => {
            if (res.meta.status === 200) {
              console.log(res)
              // 把token保存的本地
              localStorage.setItem('adminToken', res.data.token)
              // 跳转到首页
              this.$router.push({name: 'Home'})
              // this.$store.state.username = res.data.username
              this.$store.commit('setUser', res.data.username)
            } else {
              this.$message.error(res.meta.msg)
            }
          })
      } else {
        this.$message.error('请输入正确的帐号或密码')
      }
    }
    // ,
    // toLogin () {
    //   checkLogin({username: this.form.username, password: this.form.password})
    //     .then(res => {
    //       if (res.meta.status === 200) {
    //         this.$router.push({name: 'Home'})
    //       } else {
    //         this.$message.error(res.meta.msg)
    //       }
    //     })
    // }
  }
}
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    border-radius: 20px;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 10px;
      border: 2px solid #666;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
