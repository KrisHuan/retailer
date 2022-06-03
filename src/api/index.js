import Vue from "vue";
import axios from "axios";
Vue.prototype.$http = axios
export
    const getCategories = function () {
        return this.$http('categories')
    }