import Vue from 'vue'
import Review from '../components/Review.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Review),
}).$mount('#app')