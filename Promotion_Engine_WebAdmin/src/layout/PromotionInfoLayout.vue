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
        <sidebar-item
          :link="{
            name: 'Vouchers',
            icon: 'fas fa-tag text-blue',
            path: '/voucher',
          }"
        />
        <el-divider content-position="center">Campaign</el-divider>
        <sidebar-item
          :link="{
            name: 'Promotion',
            icon: 'fas fa-percent text-blue',
            path: '/campaign/promotion',
          }"
        />

        <sidebar-item
          :link="{
            name: 'Rule builder',
            icon: 'fas fa-pencil-ruler text-info',
            path: '/campaign/condition',
          }"
        />
        <el-divider content-position="center">Configuration</el-divider>

        <sidebar-item
          :link="{
            name: 'Stores',
            icon: 'fas fa-store-alt text-orange',
            path: '/store',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Channel',
            icon: 'fas fa-network-wired text-red',
            path: '/channel',
          }"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
import ContentFooter from "./ContentFooter.vue";
import { FadeTransition } from "vue2-transitions";

export default {
  components: {
    ContentFooter,
    FadeTransition,
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
