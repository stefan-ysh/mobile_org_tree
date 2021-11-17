import Vue from "vue";
import App from "./App.vue";
import MobileTree from './components/MobileTree'
Vue.use(MobileTree)
Vue.config.productionTip = false;
new Vue({
  render: h => h(App)
}).$mount("#app");
