import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome/Welcome'
import User from '@/views/User/Users'
import Rights from '@/views/Auth/Rights'
import Roles from '@/views/Auth/Roles'
import Category from '@/views/Category/Category'
import Goods from '@/views/Good/Goods'
import Addgoods from '@/views/Good/AddGoods'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'Home',
    path: '/',
    component: Home,
    redirect: 'Welcome',
    children: [
      {name: 'Welcome', path: 'welcome', component: Welcome},
      {name: 'User', path: 'Users', component: User},
      {name: 'Rights', path: 'Rights', component: Rights},
      {name: 'Roles', path: 'Roles', component: Roles},
      {name: 'Category', path: 'Categories', component: Category},
      {name: 'Goods', path: 'Goods', component: Goods},
      {name: 'Addgoods', path: 'toadd', component: Addgoods}
    ]
  }]
})
