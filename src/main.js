import Vue from 'vue';
import axios from 'axios';
import querystring from 'querystring';
import ElementUI from 'element-ui';
import router from './router';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;
Vue.prototype.$queryString = querystring;

Vue.prototype.$http = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:7001',
    timeout: 3000,
});
Vue.prototype.$url = 'http://localhost:7001';
Vue.use(ElementUI);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
