import Vue from "vue";
import App from "./App.vue";
// dev
// import MobileOrg from "./components/MobileOrg";

// test
import MobileOrg from 'mobile-org'
import 'mobile-org/mobile-org.css'

Vue.use(MobileOrg);
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
