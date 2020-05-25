import Vue from 'vue'
import Live from '../components/Live.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Live),
}).$mount('#app')