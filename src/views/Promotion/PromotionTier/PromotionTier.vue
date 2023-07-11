<template>
  <div>
    <el-form
      :model="actionForm"
      :ref="'actionForm_' + index"
      :id="'actionForm_' + index"
      label-position="top"
    >
      <product-action
        v-show="actionType == '1'"
        :actionForm="actionForm"
        :productCodes="productCodes"
        :discountType="discountType"
        v-on:addProductCode="addProductCode"
        v-on:removeProductCode="removeProductCode"
      ></product-action>
      <order-action
        v-show="actionType == '2'"
        :actionForm="actionForm"
        :discountType="discountType"
      ></order-action>
      <gift-action
        v-show="actionType == '3'"
        :actionForm="actionForm"
        :discountType="discountType"
      ></gift-action>
      <bonus-point
        v-show="actionType == '4'"
        :actionForm="actionForm"
        :discountType="discountType"
      ></bonus-point>
    </el-form>
  </div>
</template>

<script>
import ProductAction from "./PromotionTierAction/ProductAction";
import OrderAction from "./PromotionTierAction/OrderAction";
import GiftAction from "./PromotionTierAction/GiftAction.vue";
import BonusPoint from "./PromotionTierAction/BonusPoint.vue";
export default {
  name: "action-builder",
  components: {
    ProductAction,
    OrderAction,
    GiftAction,
    BonusPoint,
  },
  props: {
    actionType: String,
    discountType: String,
    promotionId: String,
    productCodes: Array,
    index: Number,
  },
  created() {
    this.setupData();
  },
  computed: {
    actionForm() {
      return this.$store.state.action.actionParam;
    },
  },
  watch: {},
  data() {
    return {
      currentAction: "productsAmount",
      productAction: {
        amount: {
          productType: "1",
          parentCode: "",
          productCode: "",
          value: 0,
          minValueAfterDiscount: 0,
        },
        percent: {
          productType: "1",
          parentCode: "",
          productCode: "",
          valuePercent: 0,
          amountLimit: 0,
        },
        unit: {
          productType: "1",
          parentCode: "",
          productCode: "",
          value: 0,
        },
        fixed: {
          productType: "1",
          parentCode: "",
          productCode: "",
          fixedValue: 0,
        },
        ladder: {
          productType: "1",
          parentCode: "",
          productCode: "",
          orderLadderProduct: 0,
          ladderPrice: 0,
        },
        bundle: {
          productType: "1",
          parentCode: "",
          productCode: "",
          strategy: "3",
          bundleQuantity: 0,
          bundlePrice: 0,
        },
      },
      orderAction: {
        amount: {
          value: 0,
          minValueAfterDiscount: 0,
        },
        percent: {
          value: 0,
          amountLimit: 0,
        },
        shipping: {
          productCode: "shipping",
          type: "1",
          valueAmount: 0,
          valuePercent: 0,
          amountLimit: 0,
        },
      },
      giftAction: {
        giftProduct: {
          giftProductCode: "",
          giftName: "",
          quantity: 0,
        },
        giftVoucher: {
          option: false,
          giftVoucherCode: "",
        },
      },
      bonusPoint: {
        bonusPoint: 0,
      },
    };
  },
  methods: {
    addProductCode(productCode) {
      this.$emit("addProductCode", productCode);
    },
    removeProductCode(index) {
      this.$emit("removeProductCode", index);
    },
    setupData() {
      let actionType = this.actionType;
      let val = this.discountType;
      this.actionForm.actionType = actionType;
      this.actionForm.discountType = val;
      let discountType = this.$ENV.ACTION_TYPE;
      this.refeshActionObject();
      switch (val) {
        case discountType.AMOUNT:
          if (actionType == 1) {
            this.actionForm.productAction = this.productAction.amount;
            break;
          }
          if (actionType == 2) {
            this.actionForm.orderAction = this.orderAction.amount;
            break;
          }
          break;
        case discountType.PERCENTAGE:
          if (actionType == 1) {
            this.actionForm.productAction = this.productAction.percent;
            break;
          }
          if (actionType == 2) {
            this.actionForm.orderAction = this.orderAction.percent;
            break;
          }
          break;
        case discountType.UNIT:
          if (actionType == 1) {
            this.actionForm.productAction = this.productAction.unit;
            break;
          }
          if (actionType == 2) {
            this.actionForm.orderAction = this.orderAction.unit;
            break;
          }
          break;
        case discountType.FIXED:
          this.actionForm.productAction = this.productAction.fixed;
          break;
        case discountType.LADDER:
          this.actionForm.productAction = this.productAction.ladder;
          break;
        case discountType.SHIPPING:
          this.actionForm.orderAction = this.orderAction.shipping;
          break;
        case discountType.BUNDLE:
          this.actionForm.productAction = this.productAction.bundle;
          break;
        case discountType.GIFT_PRODUCT:
          this.actionForm.giftAction = this.giftAction.giftProduct;
          break;
        case discountType.GIFT_VOUCHER:
          this.actionForm.giftAction = this.giftAction.giftVoucher;
          break;
        case discountType.BONUS_POINT:
          this.actionForm.giftAction = this.bonusPoint;
          break;
      }
      this.$emit("clearProductCodes");
      this.$store.commit("action/setActionParam", this.actionForm);
      console.log(this.actionForm);
      console.log(this.$store.state.action.actionParam);
    },

    refeshActionObject() {
      this.productAction = {
        amount: {
          productType: "1",
          parentCode: "",
          productCode: "",
          value: 0,
          minValueAfterDiscount: 0,
        },
        percent: {
          productType: "1",
          parentCode: "",
          productCode: "",
          valuePercent: 0,
          amountLimit: 0,
        },
        unit: {
          productType: "1",
          parentCode: "",
          productCode: "",
          value: 0,
        },
        fixed: {
          productType: "1",
          parentCode: "",
          productCode: "",
          fixedValue: 0,
        },
        ladder: {
          productType: "1",
          parentCode: "",
          productCode: "",
          orderLadderProduct: 0,
          ladderPrice: 0,
        },
        bundle: {
          productType: "1",
          parentCode: "",
          productCode: "",
          strategy: "3",
          bundleQuantity: 0,
          bundlePrice: 0,
        },
      };
      this.orderAction = {
        amount: {
          value: 0,
          minValueAfterDiscount: 0,
        },
        percent: {
          value: 0,
          amountLimit: 0,
        },
        shipping: {
          productCode: "shipping",
          type: "1",
          valueAmount: 0,
          valuePercent: 0,
          amountLimit: 0,
        },
      };
      this.giftAction = {
        giftProduct: {
          giftProductCode: "",
          giftName: "",
          quantity: 0,
        },
        giftVoucher: {
          option: false,
          giftVoucherCode: "",
        },
      };
      this.bonusPoint = {
        bonusPoint: 0,
      };
    },
  },
};
</script>

<style>
#actionForm .el-radio__label {
  font-size: 1.1rem;
}
#actionForm .el-radio__inner {
  width: 1rem;
  height: 1rem;
}
.custom-label-action {
  font-size: 1.1rem;
  color: black;
  font-weight: bold;
}
.el-input-number__increase {
  display: none;
  width: 0px;
}
.el-input-number__decrease {
  display: none;
  width: 0px;
}
.el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner h2 {
  color: white;
}
.el-input-number {
  width: 100%;
}
.el-dialog__body {
  padding: 0px 20px 20px 20px;
}
#type-custom .el-radio-button__inner {
  width: 11vw;
  font-size: 1rem;
  text-align: center;
}
</style>
