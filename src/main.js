import Vue from 'vue';
import axios from 'axios';
import querystring from 'querystring';
import ElementUI from 'element-ui';
import toastr from 'toastr';
import router from './router';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import 'toastr/build/toastr.min.css';
// toastr配置
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '3000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};
Vue.config.productionTip = false;
Vue.prototype.$queryString = querystring;
Vue.prototype.$toastr = toastr;
Vue.prototype.$http = axios.create({
  baseURL: 'localhost:7001',
  timeout: 3000,
});
Vue.prototype.$url = 'localhost:7001';
Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
