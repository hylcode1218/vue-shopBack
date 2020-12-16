import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI  from 'element-ui'
//导入全局样式表
import "./assets/css/global.css"
import "./assets/css/iconfont.css"

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


//引入第三方插件
import TreeTable from "vue-table-with-tree-grid"

//数据请求
import axios from 'axios'
//根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//通过axios请求拦截添加token 保证拥有获取数据的权限
axios.interceptors.request.use((config)=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //在最后必须return config
  return config 
})
Vue.prototype.$http=axios

Vue.use(VueQuillEditor)
Vue.use(ElementUI)

Vue.component('tree-table', TreeTable)



Vue.filter('dataFormat',function(originVal){
  //全局时间过滤器
  const dt=new Date(originVal)
  const y=dt.getFullYear()
  const m=(dt.getMonth() +1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
