import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/page/Login.vue';
import Register from '../components/page/Register.vue';
import MessageBoard from '../components/page/MessageBoard.vue';
import MessageDetail from "../components/page/MessageDetail";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
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
      path: '/messageBoard',
      component: MessageBoard,
      meta: {
        title: '留言板',
      },
    },
    {
      path: '/messageDetail',
      component: MessageDetail,
      meta: {
        title: '留言详情',
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
