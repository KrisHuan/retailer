import Vue from "vue";
import VueRouter from "vue-router";
import Login from '@/views/Login'
import Layout from "@/layout";
import Welcome from "@/views/welcome";
import Users from "@/views/user/index";
import Rights from "@/views/power/Rights";
import Roles from "@/views/power/Roles";
import Cate from "@/views/goods/Cate";
import Params from "@/views/goods/params";
import List from "@/views/goods/list";
import Add from "@/views/goods/add";
import Order from "@/views/order";
import Report from "@/views/report";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/login", component: Login },
    { path: "/", component: Login },
    {
      path: "/home",
      component: Layout,
      redirect: "/welcome",
      children: [
        { path: "/welcome", component: Welcome },
        { path: "/users", component: Users },
        { path: "/rights", component: Rights },
        { path: "/roles", component: Roles },
        { path: "/categories", component: Cate },
        { path: "/params", component: Params },
        { path: "/goods", component: List },
        { path: "/goods/add", component: Add },
        { path: "/orders", component: Order },
        { path: "/reports", component: Report },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenstr = window.sessionStorage.getItem("token");
  if (!tokenstr) return next("/login");
  next();
});
export default router;
