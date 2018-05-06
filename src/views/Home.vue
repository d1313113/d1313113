<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <div class="logo"></div>
        <el-menu
            default-active="2"
            class="el-menu-admin"
            background-color="#F9F9F9"
            @open="handleOpen"
            @close="handleClose"
            :router="true"
            :collapse="isCollapse"
            :unique-opened="true">
          <el-submenu :index="firstItem.order.toString()" v-for="(firstItem, index) in menusData" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{firstItem.authName}}</span>
            </template>
            <el-menu-item :index="secondItem.path"
            v-for="(secondItem, index) in firstItem.children" :key="index">
              <i class="el-icon-menu"></i>
              <span slot="title">{{secondItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <i class="myicon myicon-menu toggle-btn" @click="toggle"></i>
          <div class="system-title">电商后台管理系统
          </div>
          <div class="welcome">
            <span>您好,{{$store.state.username}}</span>
            <el-button type="warning" round @click="loginOut">退出</el-button>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { menus } from '@/api'
export default {
  data () {
    return {
      isCollapse: false,
      menusData: []
    }
  },
  created () {
    this.initMenus()
  },
  methods: {
    initMenus () {
      menus()
        .then(res => {
          if (res.meta.status === 200) {
            this.menusData = res.data
          }
        })
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    loginOut () {
      localStorage.removeItem('adminToken')
      this.$router.push({name: 'Login'})
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #F9F9F9;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #409EFF;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: white;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome, {
    color: white;
  }
}
</style>
