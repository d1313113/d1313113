<template>
  <div class="goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入搜索内容" v-model="searchVal" class="add-input" @keydown.enter.native="initList">
    <el-button slot="append" icon="el-icon-search" ></el-button>
    </el-input>
    <el-button type="primary" plain @click="jumpToAdd">添加商品</el-button>

      <el-table
        :data="goodList"
        border
        class="mt-15 mb-15"
        style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="email"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="商品状态">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" class="el-icon-edit" plain ></el-button>
          <el-button size="mini" type="danger" class="el-icon-delete" plain ></el-button>
          <el-button size="mini" type="warning" class="el-icon-check" plain ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getGoodsList } from '@/api'
export default {
  data () {
    return {
      goodList: [],
      searchVal: ''
    }
  },
  created () {
    this.initList()
  },
  methods: {
    initList () {
      getGoodsList()
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            console.log(res.data)
            this.goodList = res.data
          }
        })
    },
    jumpToAdd () {
      this.$router.push({name: 'Addgoods'})
    }
  }
}
</script>
<style lang="scss" scoped>
.add-input {
    width: 300px;
  }
</style>
