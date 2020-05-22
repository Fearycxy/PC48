import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './assets/sass/app.scss'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Constants from './assets/js/constants'

Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$Constants = Constants
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

window.axios = axios

Vue.prototype.$eventBus = new Vue();

Vue.prototype.$Notice.config({
    top: 50
});
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
