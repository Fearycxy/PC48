import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './assets/sass/app.scss'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Constants from './assets/js/constants'
import VueVideoPlayer from 'vue-video-player'

// require videojs style
import 'video.js/dist/video-js.css'
Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.Constants = Constants
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

window.axios = axios
Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)
Vue.prototype.$eventBus = new Vue();

Vue.prototype.$Notice.config({
    top: 50
});
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
