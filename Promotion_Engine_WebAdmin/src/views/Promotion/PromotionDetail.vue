<template>
  <div v-loading="loading">
    <base-header style="z-index: -1" :class="headerClass" :style="headerStyle">
    </base-header>
    <div style="z-index: 100" class="container-fluid mt--6 mb-2">
      <promotion-info
        :promotionTiers="promotionTier"
        :promotionParam="promotionDetail"
        :paymentVariable="paymentVariable"
        v-on:loadingStatus="loadingStatus"
        ref="promotionInfo"
      />

      <div>
        <el-card class="mt-3">
          <h2>DETAIL INFORMATION</h2>
          <el-tabs type="border-card">
            <el-tab-pane key="Configure" label="Configure">
              <promotion-configure
                :promotionParam="promotionDetail"
                :paymentVariable="paymentVariable"
                v-on:loadingStatus="loadingStatus"
                v-on:getPromotionDetail="getPromotionDetail"
                ref="promotionConfig"
              />
            </el-tab-pane>
            <el-tab-pane key="Tiers" label="Tiers"
              ><promotion-action
                :promotionTierParam="promotionTier"
                :promotionId="promotionDetail.promotionId"
                :promotionDetail="promotionDetail"
                v-on:loadingStatus="loadingStatus"
                v-on:getPromotionDetail="getPromotionDetail"
                ref="promotionAction"
            /></el-tab-pane>
            <el-tab-pane key="Distribution" label="Distribution">
              <promotion-channel
                :promotionDetail="promotionDetail"
                :voucherGroupParam="voucherGroup"
                v-on:loadingStatus="loadingStatus"
                ref="promotionChannel"
              />
            </el-tab-pane>
            <el-tab-pane key="Usage" label="Usage">
              <promotion-store
                :promotionDetail="promotionDetail"
                :voucherGroupParam="voucherGroup"
                v-on:loadingStatus="loadingStatus"
                ref="promotionStore"
              />
            </el-tab-pane>
            <el-tab-pane key="Transaction" label="Transaction">
              <promotion-trans />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import PromotionInfo from "./PromotionDetail/PromotionInfo.vue";
import PromotionAction from "./PromotionDetail/PromotionAction.vue";
import PromotionStore from "./PromotionDetail/PromotionStore.vue";
import PromotionChannel from "./PromotionDetail/PromotionChannel.vue";
import PromotionConfigure from "./PromotionDetail/PromotionConfigure.vue";
import PromotionTrans from "./PromotionDetail/PromotionTrans.vue";

Vue.use(VueClipboard);
export default {
  directives: {
    "b-tooltip": BTooltipDirective,
  },

  components: {
    PromotionInfo,
    PromotionAction,
    PromotionStore,
    PromotionChannel,
    PromotionConfigure,
    PromotionTrans,
  },
  computed: {
    promotionDetail() {
      // Lấy thông tin của promotion: voucher, store mapping. Không có thông tin của promotion tier
      return this.$store.state.promotion_detail.promotionDetail;
    },
    promotionTier() {
      // Lấy danh sách các promotion tier
      return this.$store.state.promotion_detail.promotionDetail.promotionTier;
    },
    voucherGroup() {
      return this.$store.state.promotion_detail.promotionDetail.voucherGroup;
    },
    paymentVariable() {
      return this.$ENV.PAYMENT;
    },
    vouchers() {
      return this.$store.state.voucher.vouchers;
    },
  },
  async created() {
    this.loading = true;
    let id = this.$route.params.id;
    this.$store.commit("promotion_detail/setPromotionId", id);
    await this.getPromotionDetail();
    this.setExclusiveParams();
  },
  beforeCreate() {
    window.scrollTo(0, 0);
  },
  beforeDestroy() {
    this.$store.commit("promotion_detail/clearPromotionDetail");
    this.$store.commit("promotion_detail/clearPromotionTiers");
  },

  data() {
    return {
      headerClass: "header pb-8 pt-5 pt-lg-8 d-flex align-items-center img-fluid",
      headerStyle: "",
      loading: false,
      isEditInfo: false,
    };
  },
  methods: {
    setExclusiveParams() {
      let exclusives = [
        {
          label: "None",
          value: 0,
        },
        {
          label: "Global",
          value: 1,
        },
      ];
      let actiontype = this.promotionDetail.actionType;
      let postActionType = this.promotionDetail.postActionType;
      if (actiontype) {
        let ACTION_TYPE = this.$ENV.ACTION_TYPE;
        if (actiontype < ACTION_TYPE.ORDER_SHIPPING) {
          exclusives.push({
            label: "Level-Order",
            value: this.$ENV.EXCLUSIVE.LEVEL_ORDER,
          });
        } else if (actiontype == ACTION_TYPE.ORDER_SHIPPING) {
          exclusives.push({
            label: "Level-Shipping",
            value: this.$ENV.EXCLUSIVE.LEVEL_SHIPPING,
          });
        } else {
          exclusives.push({
            label: "Level-Product",
            value: this.$ENV.EXCLUSIVE.LEVEL_PRODUCT,
          });
        }
      } else if (postActionType) {
        exclusives.push({
          label: "Level-Gift",
          value: this.$ENV.EXCLUSIVE.LEVEL_GIFT,
        });
      }
      this.$store.commit("promotion/setExclusives", exclusives);
    },
    editInfo() {
      this.isEditInfo = !this.isEditInfo;
      this.$refs["promotionInfo"].editMode();
    },
    async getPromotionDetail() {
      this.loading = true;
      await this.$store
        .dispatch("promotion_detail/getPromotionInfo")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error when getting promotion, please try again",
              type: "danger",
            });
          } else {
            this.headerStyle =
              "min-height: 55vh; background-size: cover; background-position: center top; background-image: url(" +
              this.promotionDetail.imgUrl +
              "); ";
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error when getting promotion, please try again",
            type: "danger",
          });
        });
    },

    loadingStatus(value) {
      this.loading = value;
    },
  },
};
</script>
<style>
.custom-card {
  -webkit-box-shadow: -5px 4px 6px -1px rgba(0, 0, 0, 0.16);
  -moz-box-shadow: -5px 4px 6px -1px rgba(0, 0, 0, 0.16);
  box-shadow: -5px 4px 6px -1px rgba(0, 0, 0, 0.16);
}
.custom-card-2 {
  -webkit-box-shadow: -1px 6px 10px 0px rgba(0, 0, 0, 0.11);
  -moz-box-shadow: -1px 6px 10px 0px rgba(0, 0, 0, 0.11);
  box-shadow: -1px 6px 10px 0px rgba(0, 0, 0, 0.11);
}

.custom-navbar-info {
  color: #41b883;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 10px;
  margin: 0px;
}
.detail-label {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  color: rgb(61, 61, 61);
  margin: 0px;
}
.action-builder-title {
  color: black;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0px 0px 10px 0px;
}
.custom-section-label {
  font-size: 1.15vw;
  color: black;
}
.custom-section-label-child {
  font-size: 1vw;
  color: black;
}
.el-tabs--border-card {
  box-shadow: 0px;
}
</style>
