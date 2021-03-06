import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "./plugins/element.js";
import "./assets/css/global.css";

import ZkTable from 'vue-table-with-tree-grid'
Vue.component("t-table", ZkTable)

import axios from "axios";
//配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

let vm = new Vue({
  router,
  render: (h) => h(App),
});

setTimeout(() => {
  vm.$mount("#app");
}, 0);
