import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
//Template
import ArgonDashboard from "./plugins/argon-dashboard";
//Element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
//Firebase
import firebase from "firebase/app";
import "firebase/storage";
import "./assets/scss/element-variables.scss";
//Store
import { store } from "./store";

import { ENV } from "./CONSTANT_VARIABLE";
//Boostrap Vue
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
// Websocket
import { HubConnectionBuilder } from "@microsoft/signalr";
// URL
import { API_URL } from "../src/store/API_KEY";
//Session
import VueSession from "vue-session";

import VueDragTree from "vue-drag-tree";
import "vue-drag-tree/dist/vue-drag-tree.min.css";

import { currency } from "./currency";

Vue.filter("currency", currency);

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI, { locale });
Vue.use(ArgonDashboard);
Vue.prototype.$ENV = ENV;
Vue.use(VueSession);
Vue.use(VueDragTree);
const connection = new HubConnectionBuilder()
  .withUrl(API_URL + "notify/message")
  .build();

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    const firebaseConfig = {
      apiKey: "AIzaSyCAO2-RSgesc6Asm4RQb_rVxFB56LhnkOM",
      authDomain: "promotion-engine-3a6dc.firebaseapp.com",
      projectId: "promotion-engine-3a6dc",
      storageBucket: "promotion-engine-3a6dc.appspot.com",
      messagingSenderId: "114032604280",
      appId: "1:114032604280:web:caea14b88724b66ecee98d",
    };

    firebase.initializeApp(firebaseConfig);

    // Start websocket
    connection
      .start()
      .then(() => {
        this.$store.commit("notify/setConnectionId", connection.connectionId);
        this.$store.commit("notify/setConnection", connection);
      })
      .catch(() => {
        this.$notify({
          icon: "el-icon-circle-check",
          title: "Warning",
          message: "Cannot connected to server, please try again",
          type: "warning",
        });
      });
    connection.onclose(() => {
      connection
        .start()
        .then(() => {
          this.$store.commit("notify/setConnectionId", connection.connectionId);
          this.$store.commit("notify/setConnection", connection);
        })
        .catch(() => {
          this.$notify({
            icon: "el-icon-circle-check",
            title: "Warning",
            message: "Cannot connected to server, please try again",
            type: "warning",
          });
        });
    });
    let session = JSON.parse(sessionStorage.getItem("vue-session-key"));
    if (session) {
      let user = session["user-info"];
      if (user) {
        let token = user.token;
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      }
    }
  },
  mounted() {
    // Handle request from websocket
    connection.on("InsertingVouchers", (task) => {
      this.$store.commit("notify/addDoingTasks", task);
    });
    connection.on("InsertedVouchers", (task) => {
      this.$store.commit("notify/addDoneTasks", task);
    });
    connection.on("Error", (task) => {
      this.$store.commit("notify/addErrorTasks", task);
    });
    connection.on("ShowMessage", (message) => {
      console.log("ShowMessage");
      this.$notify({
        icon: message.icon,
        title: message.title,
        message: message.message,
        type: message.type,
      });
    });
  },
}).$mount("#app");
