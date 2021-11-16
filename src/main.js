import Vue from "vue";
import App from "./App.vue";
// import Kit from 'http://kit-url/kit-contact.1.0.0.js'
import touch from 'vue-directive-touch';

Vue.use(touch);
Vue.config.productionTip = false;
// Vue.use(Kit)
new Vue({
  render: h => h(App)
}).$mount("#app");
