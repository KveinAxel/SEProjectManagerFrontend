import Vue from 'vue'
// require('./mock.js')

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'
import '@/permission'
import '@/styles/index.scss' // global css
import store from './store'
import App from './App'
import router from './router'

import '@/icons' // icon
import echarts from 'echarts'
import websocket from "./websocket";
Vue.use(ElementUI, {locale});

Vue.use(VCharts);
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    template: '<div><App/><websocket/></div>',
    components: {App, websocket}
});

Vue.prototype.$echarts = echarts;
