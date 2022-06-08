import Vue from "vue";
import VueRouter from "vue-router";
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '@/views/Login')
const Layout = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '@/layout')
const Welcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '@/views/welcome')
const Users = () =>
  import(/* webpackChunkName: "user" */ '@/views/user')
const Rights = () =>
  import(/* webpackChunkName: "power" */ '@/views/power/Rights')
const Roles = () =>
  import(/* webpackChunkName: "power" */ '@/views/power/Roles')
const Cate = () =>
  import(/* webpackChunkName: "goods" */ '@/views/goods/cate')
const Params = () =>
  import(/* webpackChunkName: "goods" */ '@/views/goods/params')
const List = () =>
  import(/* webpackChunkName: "goods" */ '@/views/goods/list')
const Add = () =>
  import(/* webpackChunkName: "goods" */ '@/views/goods/add')
const Order = () =>
  import(/* webpackChunkName: "order" */ '@/views/order')
const Report = () =>
  import(/* webpackChunkName: "order" */ '@/views/report')

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
