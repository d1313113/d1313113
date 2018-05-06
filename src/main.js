// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import store from '@/store/store.js'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
// 启用elementUI
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
// 使用vuex组件
// Vue.use(vuex)
// var store = new vuex.Store({// store对象
//   state: {
//     show: false
//   }
// })

// 路由拦截
router.beforeEach((to, from, next) => {
  // 获取token
  let token = localStorage.getItem('adminToken')
  if (token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({path: '/login'})
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
