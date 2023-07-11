<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Promotion Engine"
      title="Promotion Engine"
    >
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'far fa-chart-bar text-green',
            path: '/dashboard',
          }"
        />

        <el-divider content-position="center">Campaign</el-divider>
        <sidebar-item
          :link="{
            name: 'Promotion',
            icon: 'fas fa-percent text-red',
            path: '/campaign/promotion',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Vouchers',
            icon: 'fas fa-tag text-blue',
            path: '/voucher',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Condition',
            icon: 'fas fa-pencil-ruler text-info',
            path: '/campaign/condition',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Action',
            icon: 'fa fa-key text-danger',
            path: '/action',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Gift',
            icon: 'fa fa-gift text-success',
            path: '/gift',
          }"
        />
        <el-divider content-position="center">Configuration</el-divider>
        <sidebar-item
          :link="{
            name: 'Settings',
            icon: 'fa fa-cogs text-warning',
            path: '/settings',
          }"
        />
        <sidebar-item
          :link="{
            name: 'My profile',
            icon: 'fa fa-user text-purple',
            path: '/profile',
          }"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar">
        <fade-transition
          style="min-height: 95vh"
          :duration="200"
          origin="center top"
          mode="out-in"
        >
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import { FadeTransition } from "vue2-transitions";
import AuthService from "../store/services/auth-service";
import SidebarItem from "../components/SidebarPlugin/SidebarItem.vue";
export default {
  beforeCreate() {
    let session = this.$session;
    let isValidation = AuthService.validation(session);
    if (!isValidation) {
      this.loaderEnabled = false;
      this.$router.push("/login").catch(() => {});
    } else {
      let session = JSON.parse(sessionStorage.getItem("vue-session-key"));
      let user = session["user-info"];
      if (user != undefined) {
        if (user.roleName == this.$ENV.ROLE.ADMIN) {
          this.$router.push("/admin").catch(() => {});
        } else if (user.roleName == this.$ENV.ROLE.Brand) {
          if (this.$router.history.current.name == "manage-account") {
            this.$router.push("/").catch(() => {});
          } else {
            let brandId = user.brandId;
            this.$store.commit("action/setBrandId", brandId);
            this.$store.commit("gift/setBrandId", brandId);
            this.$store.commit("profile/setUsername", user.username);
            this.$store.commit("channel/setBrandId", brandId);
            this.$store.commit("condition/setBrandId", brandId);
            this.$store.commit("dashboard/setBrandId", brandId);
            this.$store.commit("promotion/setBrandId", brandId);
            this.$store.commit("promotion_detail/setBrandId", brandId);
            this.$store.commit("product_cate/setBrandId", brandId);
            this.$store.commit("product/setBrandId", brandId);
            this.$store.commit("stores/setBrandId", brandId);
            this.$store.commit("voucher/setBrandId", brandId);
            this.$store.commit("game_campaign/setBrandId", brandId);
            this.$store.commit("profile/setBrandId", brandId);
          }
        } else {
          this.$router.push("/login").catch(() => {});
        }
      }
    }
  },
  computed: {
    routerParam() {
      return this.$router;
    },
  },
  mounted() {},
  components: {
    DashboardNavbar,
    ContentFooter,
    FadeTransition,
    SidebarItem,
  },
  data() {
    return {
      sidebarBackground: "primary", //vue|blue|orange|green|red|primary
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
<style lang="scss"></style>
