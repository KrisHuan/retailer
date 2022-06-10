import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "./assets/css/global.css";
import '@/assets/font/iconfont.css'
import "./plugins/element.js";
// vue use

import ZkTable from 'vue-table-with-tree-grid'
Vue.component("t-table", ZkTable)

import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
import axios from "axios";
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use((config) => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

axios.interceptors.response.use((config) => {
  NProgress.done();
  return config;
});
Vue.prototype.$http = axios;


// 全局filter
import * as filters from '@/filters'
// 导出的是对象，可以直接通过 key 和 value 来获得过滤器的名和过滤器的方法
console.log(filters)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


let vm = new Vue({
  router,
  render: (h) => h(App),
});

setTimeout(() => {
  vm.$mount("#app");
}, 0);
