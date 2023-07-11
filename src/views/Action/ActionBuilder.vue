<template>
  <div v-loading="loading">
    <base-header type="gradient-success" class="pb-6 mb-3 pt-1"> </base-header>
    <div class="container-fluid">
      <el-card>
        <h2 v-if="isAction">ACTION BUILDER</h2>
        <h2 v-if="!isAction">GIFT BUILDER</h2>

        <el-divider class="mt-3 mb-3"></el-divider>
        <el-col class="mb-4" :span="24">
          <div>
            <el-tag class="custom-tag-content" type="warning">
              <i class="el-icon-warning-outline mr-2"></i>
              {{ $ENV.TEXT_EXPLAIN.Action }}</el-tag
            >
          </div>
        </el-col>
        <el-form
          label-width="200"
          ref="actionObjForm"
          :rules="rules"
          :model="actionObj"
          label-position="left"
        >
          <el-row class="mb-2">
            <el-col :span="12">
              <el-form-item prop="name" label="Name">
                <el-input
                  :rows="1"
                  resize="none"
                  type="textarea"
                  v-model="actionObj.name"
                  maxlength="100"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="20">
          <el-col :span="6">
            <drag-section :isAction="isAction" :actionItem="actionItem" />
          </el-col>
          <el-col :span="18">
            <drop-section
              v-on:getProducts="getProducts"
              ref="dropSection"
              :actionItemParam="actionItem"
            />
            <el-button
              type="primary"
              class="mt-3 float-right"
              @click="createAction"
              icon="el-icon-plus"
              >New Action</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import DragSection from "./DragSection.vue";
import DropSection from "./DropSection.vue";
export default {
  components: { DragSection, DropSection },
  name: "action-builder",
  data() {
    return {
      loading: false,
      rules: {
        name: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input Name",
          },
        ],
      },
      actionObj: {
        name: "",
      },
      action: {},
      actionItem: [],
    };
  },
  computed: {
    isAction() {
      return this.$route.params.isAction == "true" || this.$route.params.isAction == true;
    },
  },
  created() {
    this.getProducts();
    this.getGameCampaign();
    this.getVoucherGroups();
    this.isAction;
  },
  methods: {
    getGameCampaign() {
      this.$store.commit("game_campaign/setPageSize", 0);
      this.$store.commit("game_campaign/setPageIndex", 0);
      this.$store
        .dispatch("game_campaign/getGameCampaignList")
        .then((result) => {
          this.$store.commit("game_campaign/setPageSize", 10);
          this.$store.commit("game_campaign/setPageIndex", 1);
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error while get Games",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error while get Games",
            type: "warning",
          });
        });
    },
    createAction() {
      let action = this.handleAction(this.actionItem);
      action.name = this.actionObj.name;
      action.brandId = "";
      this.$refs["actionObjForm"].validate((valid) => {
        if (valid) {
          let actType = this.actionItem[0].actType;
          if (actType == "PRODUCT" || actType == "ORDER") {
            this.addAction(action);
          } else {
            this.addPostAction(action);
          }
        }
      });
    },
    addAction(action) {
      this.loading = true;
      this.$store.commit("action/setInsertAction", action);
      this.$store
        .dispatch("action/insertAction")
        .then((result) => {
          this.loading = false;
          if (result.status == 200) {
            this.$notify({
              icon: "el-icon-circle-check",
              title: "Success",
              message: "Create successfully",
              type: "success",
            });
            this.$router.push("/action").catch(() => {});
          } else {
            this.loading = false;
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error while inserting Action",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error while inserting Action",
            type: "warning",
          });
        });
    },
    addPostAction(action) {
      this.loading = true;
      this.$store.commit("gift/setInsertPostAction", action);
      this.$store
        .dispatch("gift/insertPostAction")
        .then((result) => {
          this.loading = false;
          if (result.status == 200) {
            this.$notify({
              icon: "el-icon-circle-check",
              title: "Success",
              message: "Create successfully",
              type: "success",
            });
            this.$router.push("/gift").catch(() => {});
          } else {
            this.loading = false;
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error while inserting Action",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error while inserting Action",
            type: "warning",
          });
        });
    },
    getProducts() {
      this.$store
        .dispatch("condition/getBrandProduct")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              title: "Warning",
              message: "Cannot get Products",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "Warning",
            message: "Cannot get Products",
            type: "warning",
          });
        });
    },
    getVoucherGroups() {
      this.$store.commit("voucher/setAvailPageSize", 0);
      this.$store.commit("voucher/setAvailPageIndex", 0);
      this.$store
        .dispatch("voucher/getAvailableVoucher")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              title: "Warning",
              message: "Cannot get Vouchers",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "Warning",
            message: "Cannot get Vouchers",
            type: "warning",
          });
        });
    },
    handleAction(actionItems) {
      if (actionItems.length == 0) {
        this.$notify({
          title: "Warning",
          message: "Please select action",
          type: "warning",
        });
        return;
      }
      let productList = this.$refs["dropSection"].productSelection;
      let actItem = actionItems[0];
      let actionType = actItem.actionType;
      let actType = actItem.actType;
      let ACTION_TYPE = this.$ENV.ACTION_TYPE;
      let POST_ACTION = this.$ENV.POST_ACTION_TYPE;
      if (actType == "PRODUCT" || actType == "ORDER") {
        if (actionType >= ACTION_TYPE.PRODUCT_AMOUNT && productList.length == 0) {
          this.$notify({
            title: "Warning",
            message: "Please select product for action",
            type: "warning",
          });
          return;
        }
        let action = {
          actionType: actionType,
          discountQuantity: 0,
          discountAmount: 0,
          discountPercentage: 0,
          fixedPrice: 0,
          maxAmount: 0,
          minPriceAfter: 0,
          orderLadderProduct: 0,
          ladderPrice: 0,
          bundlePrice: 0,
          bundleQuantity: 0,
          bundleStrategy: 0,
          listProduct: [],
        };
        if (actType == "PRODUCT") {
          productList.forEach((product) => {
            action.listProduct.push({
              productId: product.productId,
              quantity: product.quantity,
            });
          });
        }
        switch (actionType) {
          case ACTION_TYPE.PRODUCT_AMOUNT: {
            action.discountAmount = actItem.value;
            action.minPriceAfter = actItem.minValueAfterDiscount;
            break;
          }
          case ACTION_TYPE.PRODUCT_PERCENT: {
            action.discountPercentage = actItem.valuePercent;
            action.maxAmount = actItem.amountLimit;
            break;
          }
          case ACTION_TYPE.PRODUCT_UNIT: {
            action.discountQuantity = actItem.value;
            break;
          }
          case ACTION_TYPE.PRODUCT_FIXED: {
            action.fixedPrice = actItem.fixedValue;
            break;
          }
          case ACTION_TYPE.PRODUCT_LADDER: {
            action.orderLadderProduct = actItem.orderLadderProduct;
            action.ladderPrice = actItem.ladderPrice;
            break;
          }
          case ACTION_TYPE.PRODUCT_BUNDLE: {
            action.bundlePrice = actItem.bundlePrice;
            action.bundleStrategy = actItem.strategy;
            break;
          }
          case ACTION_TYPE.ORDER_AMOUNT: {
            action.discountAmount = actItem.value;
            action.minPriceAfter = actItem.minValueAfterDiscount;
            break;
          }
          case ACTION_TYPE.ORDER_PERCENT: {
            action.discountPercentage = actItem.valuePercent;
            action.maxAmount = actItem.amountLimit;
            break;
          }
          case ACTION_TYPE.ORDER_SHIPPING: {
            if (actItem.type == "1") {
              action.discountAmount = actItem.valueAmount;
            } else {
              action.discountPercentage = actItem.valuePercent;
              action.maxAmount = actItem.amountLimit;
            }
            break;
          }
        }
        return action;
      } else if (actType == "GIFT" || actType == "BONUS") {
        if (actionType == POST_ACTION.GIFT_PRODUCT && productList.length == 0) {
          this.$notify({
            title: "Warning",
            message: "Please select product",
            type: "warning",
          });
          return;
        }
        let gift = {
          postActionType: actionType,
          giftVoucherGroupId: null,
          gameCampaignId: null,
          bonusPoint: 0,
          listProduct: [],
        };
        if (actionType == POST_ACTION.GIFT_PRODUCT) {
          productList.forEach((product) => {
            let prodObj = {
              productId: product.productId,
              quantity: product.quantity,
            };
            gift.listProduct.push(prodObj);
          });
        }

        switch (actionType) {
          case POST_ACTION.GIFT_VOUCHER: {
            if (actItem.giftVoucherGroupId == "") {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Please select voucher",
                type: "warning",
              });
              return;
            }
            gift.giftVoucherGroupId = actItem.giftVoucherGroupId;
            break;
          }
          case POST_ACTION.GIFT_GAME_CODE: {
            if (actItem.gameCampaignId == "") {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Please select game",
                type: "warning",
              });
              return;
            }
            gift.gameCampaignId = actItem.gameCampaignId;
            break;
          }
          case POST_ACTION.GIFT_POINT: {
            if (actItem.bonusPoint == 0) {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Please input point",
                type: "warning",
              });
              return;
            }
            gift.bonusPoint = actItem.bonusPoint;
            break;
          }
        }
        return gift;
      }
    },
  },
};
</script>
<style>
.el-form-item__label {
  line-height: 10px;
}
</style>
<style scoped>
.custom-tag-content {
  word-break: break-word;
  font-size: 17px;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
