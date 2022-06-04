import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "./plugins/element.js";
import "./assets/css/global.css";

import ZkTable from 'vue-table-with-tree-grid'
Vue.component("t-table", ZkTable)

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
import axios from "axios";
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

// 定义全局时间过滤器
/*
dateFormat 过滤器名字
originVal 为传入的要处理的时间参数
+‘ ’ 是为了转为字符串形式 也可以使用toString()方法
padStart() 用于头部补全 不足2位的话用0补全
*/
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



let vm = new Vue({
  router,
  render: (h) => h(App),
});

setTimeout(() => {
  vm.$mount("#app");
}, 0);
