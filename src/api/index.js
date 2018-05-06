// 引入axios
import axios from 'axios'

const URL = 'http://localhost:8888/api/private/v1/'

// 给axios设置一个全局路径
axios.defaults.baseURL = URL

// 设置axios请求拦截器
axios.interceptors.request.use(function (config) {
  var token = localStorage.getItem('adminToken')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

// 自定义登录请求
export const checkLogin = params => axios.post('login', params).then(res => res.data)

// 获取左侧菜单
export const menus = () => axios.get('menus').then(res => res.data)

// 获取用户列表
export const getUserList = params => axios.get('users', { params }).then(res => res.data)

// 更改用户状态
export const changeState = params => axios.put(`users/${params.uId}/state/${params.type}`).then(res => res.data)

// 添加用户
export const addUser = params => axios.post('users', params).then(res => res.data)

// 删除用户
export const deleteUser = params => axios.delete(`users/${params}`).then(res => res.data)

// 编辑用户
export const editUser = params => axios.put(`users/${params.id}`, params).then(res => res.data)

// 获取用户角色列表
export const RoleList = () => axios.get('roles').then(res => res.data)

// 修改用户角色
export const changeRole = params => axios.put(`users/${params.id}/role`, params).then(res => res.data)

// 获取所有权限数据
export const getRoleList = params => axios.get(`rights/${params}`).then(res => res.data)

// 添加角色
export const addRole = params => axios.post('roles', params).then(res => res.data)

// 删除用户
export const deleteRole = id => axios.delete(`roles/${id}`).then(res => res.data)

// 修改用户角色
export const editRole = params => axios.put(`roles/${params.id}`, params).then(res => res.data)

// 角色授权
export const setRole = params => axios.post(`roles/${params.id}/rights`, {rids: params.rids}).then(res => res.data)

// 删除用户
export const deleteRoleRight = (id, rid) => axios.delete(`roles/${id}/rights/${rid}`).then(res => res.data)

// 获取分类数据
export const getCategory = params => axios.get('categories', {params}).then(res => res.data)

// 删除分类
export const deleteCategory = params => axios.delete(`categories/${params}`).then(res => res.data)

// 添加分类
export const addCategory = params => axios.post('categories', params).then(res => res.data)

// 根据id查询分类
export const checkCategory = id => axios.get(`categories/${id}`).then(res => res.data)

// 编辑分类
export const editCategory = params => axios.put(`categories/${params.id}`, {cat_name: params.cat_name}).then(res => res.data)

// 获取商品列表数据
export const getGoodsList = () => axios.get().then(res => res.data)

// 上传图片
export const upload = params => axios.post('upload', {file: params}).then(res => res.data)
