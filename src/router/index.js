import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/page/Login.vue';
import Register from '../components/page/Register.vue';
import MessageBoard from '../components/page/MessageBoard.vue';
import MessageDetail from "../components/page/MessageDetail";
import Information from "../components/page/Information";
import ManagerMessage from "../components/page/ManagerMessage";
import ResetPassword from "../components/page/ResetPassword";
import UserManage from "../components/page/UserManage";

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: '登录页面',
      },
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: '注册页面',
      },
    },
    {
      path: '/resetPassword',
      component: ResetPassword,
      meta: {
        title: '忘记密码',
      },
    },
    {
      path: '/messageBoard',
      component: MessageBoard,
      meta: {
        title: '留言板',
      },
    },
    {
      path: '/managerMessage',
      component: ManagerMessage,
      meta: {
        title: '管理留言',
      },
    },
    {
      path: '/messageDetail',
      component: MessageDetail,
      meta: {
        title: '留言详情',
      },
    },
    {
      path: '/information',
      component: Information,
      meta: {
        title: '个人信息',
      },
    },
    {
      path: '/userManage',
      component: UserManage,
      meta: {
        title: '管理留言',
      },
    },
  ],
});
router.beforeEach((to, from, next) => { // beforeEach是router的钩子函数，在进入路由前执行
  if (to.meta.title) { // 判断是否有标题
    document.title = to.meta.title;
  }
  next();
});
export default router;
