<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" plain @click="addRoledialogFormVisible = true">添加角色</el-button>

    <el-table
      :data="roleList"
      border
      class="mt-15 mb-15"

      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
          v-for="(firstItem, index) in scope.row.children" :key="index">
            <el-col :span="3" :offset="1">
              <el-tag closable @close="delRight(scope.row, firstItem.id)">{{firstItem.authName}}</el-tag>
              <i class="el-icon-d-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row
              v-for="(secondItem, index) in firstItem.children" :key="index"
              v-if="firstItem.children.length !== 0">
                <el-col :span="4" :offset="1">
                  <el-tag type="success" closable @close="delRight(scope.row, secondItem.id)">{{secondItem.authName}}</el-tag>
                  <i class="el-icon-d-arrow-right"></i>
                </el-col>
                <el-col :span="18" :offset="1">
                  <el-tag
                type="warning"
                v-for="(thirdItem, index) in secondItem.children"
                :key="index" closable
                @close="delRight(scope.row, thirdItem.id)"
                v-if="secondItem.children.length !== 0"
                >{{thirdItem.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="scope.row.children.length === 0">
              该用户没有管理权限,请联系相关管理员
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        :resizable="false"
        width="40">
      </el-table-column>
      <el-table-column
        label="用户角色"
        prop="roleName"
        align="center"
        :resizable="false"
        min-width="13px">
      </el-table-column>
      <el-table-column
        label="角色描述"
        prop="roleDesc"
        align="center"
        :resizable="false"
        min-width="20px">
      </el-table-column>
      <el-table-column label="操作" :resizable="false" class="test">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" class="el-icon-edit" plain @click="showEdit(scope.row)"></el-button>
          <el-button size="mini" type="danger" class="el-icon-delete" plain  @click="showDel(scope.row)"></el-button>
          <el-button size="mini" type="warning" class="el-icon-check" plain @click="showCheck(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoledialogFormVisible">
      <el-form :model="addForm" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoledialogFormVisible">
      <el-form :model="editForm" :rules="rules">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEditRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 树状结构对话框 -->
    <el-dialog
      title="授权角色"
      :visible.sync="treeDialogVisible"
      width="50%">
      <!-- 树状权限 -->
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :default-checked-keys="checkedArray"
        :props="treeProps">
      </el-tree>
      <div class="buttons">
        <el-button @click="getCheckedKeys">通过 key 获取</el-button>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="treeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { RoleList, addRole, deleteRole, editRole, getRoleList, setRole, deleteRoleRight } from '@/api'
export default {
  data () {
    return {
      roleList: [],
      addRoledialogFormVisible: false,
      editRoledialogFormVisible: false,
      treeDialogVisible: false,
      formLabelWidth: '80px',
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 树桩结构
      treeData: [],
      checkedArray: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      setRoleData: {
        id: '',
        rids: ''
      }
    }
  },
  created () {
    this.initList()
  },
  methods: {
    initList () {
      RoleList()
        .then(res => {
          if (res.meta.status === 200) {
            this.roleList = res.data
          }
        })
    },
    doAddRole () {
      addRole(this.addForm)
        .then(res => {
          console.log(res)
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.addRoledialogFormVisible = false
            this.initList()
            this.addForm.roleName = ''
            this.addForm.roleDesc = ''
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    delRight (row, rid) {
      deleteRoleRight(row.id, rid)
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            this.initList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    showDel (row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id)
          .then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initList()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEdit (row) {
      this.editRoledialogFormVisible = true
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editForm.id = row.id
    },
    doEditRole () {
      editRole(this.editForm)
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success('修改成功')
            this.editRoledialogFormVisible = false
            this.initList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    showCheck (row) {
      this.treeDialogVisible = true
      this.checkedArray = []
      this.setRoleData.id = row.id
      getRoleList('tree')
        .then(res => {
          this.treeData = res.data
          console.log(res.data)
          this.data2 = res.data
        })
      for (var i = 0; i < row.children.length; i++) {
        for (var j = 0; j < row.children[i].children.length; j++) {
          for (var k = 0; k < row.children[i].children[j].children.length; k++) {
            this.checkedArray.push(row.children[i].children[j].children[k].id)
          }
        }
      }
    },
    getCheckedKeys () {
      this.treeDialogVisible = false
      let arr = []
      let str = ''
      this.$refs.tree.getCheckedNodes().forEach((v, i) => {
        arr.push(v.id)
        arr.push(v.pid)
      })
      arr = arr.join(',').split(',')
      let rids = [...new Set(arr)]
      str = rids.join(',')
      this.setRoleData.rids = str
      setRole(this.setRoleData)
        .then(res => {
          if (res.meta.status === 200) {
            this.treeDialogVisible = false
            this.initList()
          }
        })
    }
  }
}
</script>
<style lang="scss">
.el-tag{
  margin: 5px 5px 5px 0;
}
th.el-table_1_column_5 div{
  margin-left: 145px;
}
td.el-table_1_column_5 div{
  margin-left: 80px;
}
</style>
