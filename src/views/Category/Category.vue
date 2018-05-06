<template>
  <div class="category">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" plain class="mb-15" @click="showAdd">添加分类</el-button>
    <tree-grid
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory">
    </tree-grid>

    <el-pagination
      class="mt-15"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" :label-width="formLabelWidth">
          <el-cascader
            :options="addOptions"
            :show-all-levels="false"
            :props="props"
            @change="selectCate"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddCategory">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEditCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid'
import { getCategory, addCategory, deleteCategory, checkCategory, editCategory } from '@/api'
export default {
  components: {
    TreeGrid
  },
  data () {
    return {
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      addForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      editForm: {
        id: '',
        cat_name: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      dataSource: [],
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }],
      addOptions: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      pagesize: 5,
      pagenum: 1,
      total: 0,
      currentPage: 0
    }
  },
  created () {
    this.initList()
  },
  methods: {
    deleteCategory (cid) {
      deleteCategory(cid)
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            this.initList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    editCategory (cid) {
      this.editDialogFormVisible = true
      this.editForm.id = cid
      checkCategory(cid)
        .then(res => {
          if (res.meta.status === 200) {
            this.editForm.cat_name = res.data.cat_name
          }
        })
    },
    initList () {
      getCategory({type: 3, pagenum: this.pagenum, pagesize: this.pagesize})
        .then(res => {
          if (res.meta.status === 200) {
            this.dataSource = res.data.result
            this.total = res.data.total
          }
        })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.initList()
    },
    showAdd () {
      this.addDialogFormVisible = true
      getCategory({type: 2})
        .then(res => {
          if (res.meta.status === 200) {
            this.addOptions = res.data
          }
        })
    },
    selectCate (val) {
      // 添加的分类在val的第二项中
      if (val.length === 2) {
        this.addForm.cat_pid = val[1]
        this.addForm.cat_level = 2
      } else if (val.length === 1) {
        this.addForm.cat_pid = val[0]
        this.addForm.cat_level = 1
      }
    },
    doAddCategory () {
      if (this.addForm.cat_pid === '') {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
      addCategory(this.addForm)
        .then(res => {
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.addDialogFormVisible = false
            this.initList()
            this.addForm.cat_pid = ''
            this.addForm.cat_level = ''
            this.addForm.cat_name = ''
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    doEditCategory () {
      editCategory(this.editForm)
        .then(res => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            this.editForm.cat_name = ''
            this.editForm.id = ''
            this.editDialogFormVisible = false
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    }
  }
}
</script>
