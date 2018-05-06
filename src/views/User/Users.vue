<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/User' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="请输入内容" v-model="searchVal" class="search-input" @keydown.enter.native="initList">
      <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
    </el-input>
    <el-button type="primary" plain @click="addDialogFormVisible = true">添加用户</el-button>
      <el-table
        :data="userList"
        border
        class="mt-15 mb-15"
        style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" class="el-icon-edit" plain @click="showEditUserDialog(scope.row)"></el-button>
          <el-button size="mini" type="danger" class="el-icon-delete" plain @click="delUser(scope.row)"></el-button>
          <el-button size="mini" type="warning" class="el-icon-check" plain @click="getRoleList(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 这是添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm"
      :label-width="formLabelWidth"
      :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 这是编辑用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm"
      :label-width="formLabelWidth"
      :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEditUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 这是修改用户角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="roleDialogFormVisible">
      <el-form :model="roleForm"
      :label-width="formLabelWidth">
        <el-form-item label="用户名">
          <el-tag type="info">{{roleForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="roleForm.rid" placeholder="请选择角色">
            <el-option :label="item.roleName" :value="item.id" v-for="(item,index) in roleList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, changeState, addUser, deleteUser, editUser, RoleList, changeRole } from '@/api'
export default {
  data () {
    return {
      searchVal: '',
      userList: [],
      currentPage: 1,
      pagenum: 1,
      pagesize: 5,
      total: 0,
      formLabelWidth: '120px',
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      roleDialogFormVisible: false,

      // 添加用户的单表数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 编辑用户的单表数据
      editForm: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },

      // 修改角色
      roleForm: {
        id: '',
        rid: '',
        username: ''
      },
      // 角色列表数据
      roleList: [],
      // 添加用户的表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '电话不能为空' }
        ]
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.initList()
    },
    // 初始化用户列表
    initList () {
      /** @augments
       * query 查询参数 可以为空
       * pagenum 当前页码 不能为空
       * pagesize 每页显示条数 不能为空
       */
      getUserList({query: this.searchVal, pagenum: this.pagenum, pagesize: this.pagesize})
        .then(res => {
          if (res.meta.status === 200) {
            this.searchVal = ''
            this.userList = res.data.users
            this.total = res.data.total
          }
        })
    },
    // 更改用户状态
    changeUserState (row) {
      changeState({uId: row.id, type: row.mg_state}).then(
        res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
          } else {
            this.$message.error(res.meta.msg)
          }
        }
      )
    },
    // 添加用户
    doAddUser () {
      addUser(this.addForm)
        .then(res => {
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.addDialogFormVisible = false
            this.initList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    // 删除用户
    delUser (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id)
          .then(res => {
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg)
              this.initList()
            } else {
              this.$message.error(res.meta.msg)
            }
          })
      }
      ).catch(() => {
        this.$message.info('取消删除')
      })
    },
    // 显示编辑用户对话框
    showEditUserDialog (row) {
      this.editDialogFormVisible = true
      // 填充数据到编辑对话框中
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 编辑用户
    doEditUser () {
      editUser(this.editForm)
        .then(res => {
          if (res.meta.status === 200) {
            this.editDialogFormVisible = false
            this.$message.success(res.meta.msg)
            this.initList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    // 获取用户角色列表
    getRoleList (row) {
      this.roleDialogFormVisible = true
      this.roleForm.username = row.username
      this.roleForm.id = row.id
      RoleList().then(res => {
        if (res.meta.status === 200) {
          this.roleList = res.data
        }
      })
    },
    // 修改用户角色
    grantRole () {
      // 创建正则,判断是否选择了角色
      var patten = new RegExp(/^[0-9]{1,3}$/)
      if (patten.test(this.roleForm.rid)) {
        changeRole(this.roleForm)
          .then(res => {
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg)
              this.roleDialogFormVisible = false
            } else {
              this.$message.error(res.meta.msg)
            }
          })
      } else {
        this.$message.error('请选择用户角色')
      }
    }
  },
  created () {
    // 调用初始化用户列表数据
    this.initList()
  }
}
</script>
<style lang="scss" scoped>
.user {
  .search-input {
    width: 300px;
  }
  .el-pagination{
    background: #f5f5f5;
  }
}
</style>
