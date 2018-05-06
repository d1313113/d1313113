<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="roleList"
        border
        class="mt-15 mb-15"
        style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          {{scope.row.level | fLevel}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRoleList } from '@/api'
export default {
  data () {
    return {
      roleList: [],
      loading: true
    }
  },
  created () {
    this.initList()
  },
  methods: {
    initList () {
      getRoleList('list')
        .then(res => {
          if (res.meta.status === 200) {
            this.roleList = res.data
            this.loading = false
            console.log(res)
          }
        })
    }
  },
  filters: {
    fLevel (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>
