import Vue from "vue";
import VueRouter from "vue-router";
import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";
import CustomerLayout from "@/layout/CustomerLayout";

// import PromotionInfoLayout from "@/layout/PromotionInfoLayout";
import AdminLayout from "@/layout/AdminLayout";
// import AuthService from "./store/services/auth-service"
Vue.use(VueRouter);

const router = new VueRouter({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      redirect: "dashboard",
      component: DashboardLayout,
      props: true,
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Dashboard.vue"),
        },
        {
          path: "/campaign/promotion",
          name: "campaign",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Promotion.vue"),
        },
        {
          path: "/promotion/detail/:id",
          name: "Promotion detail",
          component: () => import("./views/Promotion/PromotionDetail.vue"),
        },
        {
          path: "/campaign/promotion/wizard",
          name: "Create promotion",
          component: () => import("./views/Promotion/PromotionForm.vue"),
        },
        {
          path: "/campaign/voucher/wizard",
          name: "Voucher group Builder",
          props: true,
          component: () => import("./views/Voucher/VoucherForm.vue"),
        },
        {
          path: "/campaign/condition/wizard",
          name: "Condition Builder",
          component: () => import("./views/Condition/ConditionForm.vue"),
        },
        {
          path: "/profile",
          name: "profile",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/UserProfile.vue"),
        },
        {
          path: "/configuration/general",
          name: "General Configuration",
          component: () => import("./views/GeneralConfig.vue"),
        },
        //# device, memberlevel, product cate, product
        {
          path: "/device",
          name: "Device",
          component: () => import("./views/GeneralConfig/Device.vue"),
        },
        {
          path: "/memlv",
          name: "Membership Level",
          component: () => import("./views/GeneralConfig/MemberLevel.vue"),
        },
        {
          path: "/product",
          name: "Product",
          component: () => import("./views/GeneralConfig/Product.vue"),
        },
        {
          path: "/product-cate",
          name: "Product Category",
          component: () => import("./views/GeneralConfig/ProductCate.vue"),
        },
        //# Settings
        {
          path: "/settings",
          name: "settings",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Settings.vue"),
        },
        {
          path: "/store",
          name: "store",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Stores.vue"),
        },
        {
          path: "/channel",
          name: "channel",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Channel.vue"),
        },
        {
          path: "/voucher",
          name: "voucher",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Voucher.vue"),
        },
        {
          path: "/campaign/condition",
          name: "condition",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/ConditionRule.vue"),
        },
        {
          path: "/action",
          name: "action",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Action.vue"),
        },
        {
          path: "/game-campaign",
          name: "game-campaign",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/GameCampaign.vue"),
        },
        {
          path: "/game-campaign/create",
          name: "Game Campaign",
          component: () =>
            import(
              /* webpackChunkName: "demo" */ "./views/GameCampaign/CreateGameCampaign.vue"
            ),
        },
        {
          path: "/game-campaign/update/:id",
          name: "Update Game Configuration",
          props: true,
          component: () =>
            import(
              /* webpackChunkName: "demo" */ "./views/GameCampaign/UpdateGameCampaign.vue"
            ),
        },
        {
          path: "/action-builder/:isAction",
          name: "Action builder",
          props: true,
          component: () =>
            import(
              /* webpackChunkName: "demo" */ "./views/Action/ActionBuilder.vue"
            ),
        },
        {
          path: "/voucher-group-detail/:id",
          name: "Voucher Group Detail",
          component: () =>
            import(
              /* webpackChunkName: "demo" */ "./views/Voucher/VoucherDetail.vue"
            ),
        },
        {
          path: "/condition-detail/:id",
          name: "Condition Detail",
          component: () =>
            import(
              /* webpackChunkName: "demo" */ "./views/Condition/ConditionDetail.vue"
            ),
        },
        {
          path: "/action-detail/:id",
          name: "Action Detail",
          component: () =>
            import(
              /* webpackChunkName: "demo" */ "./views/Action/ActionDetail.vue"
            ),
        },
        {
          path: "/gift",
          name: "Gift",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Gift.vue"),
        },
      ],
    },
    // {
    //   path: "/",
    //   redirect: "promotion-detail",
    //   component: PromotionInfoLayout,
    //   props: true,
    //   children: [
    //     {
    //       path: "/promotion/detail/:id",
    //       name: "promotion-detail",
    //       component: () => import("./views/Promotion/PromotionDetail.vue"),
    //     },
    //   ],
    // },
    {
      path: "/",
      redirect: "manage-account",
      component: AdminLayout,
      props: true,
      children: [
        {
          path: "/admin",
          name: "account",
          component: () => import("./views/Admin.vue"),
        },
        {
          path: "/game-master",
          name: "game",
          component: () => import("./views/Admin/GameMasterTable.vue"),
        },
      ],
    },
    {
      path: "/logout",
      component: () => import("./views/EmptyPage.vue"),
      props: true,
    },
    {
      path: "/",
      redirect: "customer-form",
      component: CustomerLayout,
      children: [
        {
          path: "/:channelCode/:id",
          name: "customer-form",
          component: () => import("./views/CustomerForm.vue"),
          props: true,
        },
        
      ],
    },
   
    {
      path: "/403",
      name: "forbidden",
      component: () => import("./views/ForbiddenPage.vue"),
      props: true,
    },
    {
      path: "/",
      redirect: "login",
      component: AuthLayout,
      children: [
        {
          path: "/login",
          name: "login",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Login.vue"),
        },
        {
          path: "/register",
          name: "register",
          component: () =>
            import(/* webpackChunkName: "demo" */ "./views/Register.vue"),
        },
        
      ],
    },
  ],
});
// router.beforeEach((to, next) => {
//   let isValidation = AuthService.validation()
//   if (to.name !== "login" && !isValidation) {
//     next({ name: "login" });
//   } else {
//     next();
//   }
// });
export default router;
