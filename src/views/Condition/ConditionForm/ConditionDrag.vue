<template>
  <div class="condition-drag-custom">
    <el-form
      ref="ruleForm"
      :model="conditionRuleObj"
      :rules="validateRule"
      label-position="top"
    >
      <el-row justify="space-between">
        <el-col class="pl-3" :span="11">
          <el-form-item label="Name" prop="ruleName">
            <el-input v-model="conditionRuleObj.ruleName" type="text"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="pl-2 pr-3" :span="13">
          <el-form-item label="Description" prop="description">
            <el-input
              class="float-right"
              v-model="conditionRuleObj.description"
              type="text"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row> </el-row>
    <el-row style="background-color: white">
      <el-col :span="6">
        <el-card>
          <drag-item-section
            :conditionItem="conditionItem"
            :actionItem="actionItem"
            :actionType="actionType"
          />
        </el-card>
      </el-col>

      <el-col :span="19">
        <drop-section
          ref="dropSection"
          :conditionItemParam="conditionItem"
          :actionItemParam="actionItem"
          :actionType="actionType"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DragItemSection from "./DragComponent/DragItemSection.vue";
import DropSection from "./DragComponent/DropSection.vue";
export default {
  name: "condition-drag",
  props: {
    promotionId: String,
    actionType: String,
    discountType: String,
    conditionRule: Object,
    actionParam: Object,
    giftParam: Object,
  },
  components: {
    DragItemSection,
    DropSection,
  },
  created() {
    let user = this.$session.get("user-info");
    if (user != undefined) {
      let brandId = user.brandId;
      if (brandId != undefined) {
        this.$store.commit("condition/setBrandId", brandId);
        this.$store.dispatch("condition/getBrandProduct").catch((err) => {
          this.$notify.error({
            title: "Cannot load product",
            message: err.message,
          });
        });
        this.$store.dispatch("condition/getBrandLevel").catch((err) => {
          this.$notify.error({
            title: "Cannot load member level",
            message: err.message,
          });
        });
        this.setupUpdateData();
      } else {
        this.$router.push("/login").catch(() => {});
      }
    } else {
      this.$router.push("/login").catch(() => {});
    }
  },
  watch: {
    actionParam() {
      console.log("watch actionParam");
      if (
        this.actionParam != undefined &&
        this.actionParam != {} &&
        this.actionParam != null
      ) {
        this.setupUpdateData();
      }
    },
    giftParam() {
      console.log("watch giftParam");
      if (
        this.giftParam != undefined &&
        this.giftParam != {} &&
        this.giftParam != null
      ) {
        this.setupUpdateData();
      }
    },
    conditionRule() {
      console.log("watch conditionRule");
      this.setupUpdateData();
    },
  },
  data() {
    return {
      validateRule: {
        ruleName: [
          {
            required: true,
            message: "Please input name",
            trigger: ["blur", "change"],
          },
        ],
      },
      conditionRuleObj: {
        ruleName: "",
        description: "",
      },
      conditionItem: [],
      actionItem: [],
      memberLevel: "",

      updatePromotionTierParam: {
        promotionId: "",
        promotionTierId: "",
        conditionRule: {
          brandId: "",
          ruleName: "",
          description: "",
        },
        conditionGroups: [],
        action: {},
        membershipAction: {},
      },
      createPromotionTierParam: {
        conditionRule: {
          brandId: "",
          ruleName: "",
          description: "",
        },
        conditionGroups: [],
        action: {},
        gift: {},
      },
      conditionGroup: {
        groupNo: 0,
        nextOperator: "1",
        conditions: [],
      },
      productCondition: {
        productConditionType: "1",
        productId: "",
        productQuantity: 0,
        quantityOperator: "1",
        nextOperator: "1",
        indexGroup: 0,
      },
      orderCondition: {
        quantity: 0,
        quantityOperator: "1",
        amount: 0,
        amountOperator: "1",
        nextOperator: "1",
        indexGroup: 0,
      },
      actProdList: [],
    };
  },
  computed: {
    memberLevels() {
      return this.$store.state.condition.levels;
    },
    conditionItemParam() {
      return this.conditionItem;
    },
    actionItemParam() {
      return this.actionItem;
    },
    conditionRuleParam() {
      return this.conditionRule;
    },
    products() {
      return this.$store.state.condition.products;
    },
  },
  methods: {
    validRuleForm() {
      this.$refs["ruleForm"].validate((valid) => {
        return valid;
      });
    },
    resetData() {
      this.conditionItem = [];
      this.actionItem = [];
      this.conditionRuleObj.ruleName = "";
      this.conditionRuleObj.description = "";
      if (this.$refs["static-item"] != undefined) {
        this.$refs["static-item"].resetData();
      }
    },
    setupUpdateData() {
      this.conditionItem = [];
      this.actionItem = [];
      if (
        this.conditionRuleParam != undefined &&
        this.conditionRuleParam.conditionGroups != undefined
      ) {
        this.conditionRuleObj.ruleName = this.conditionRuleParam.ruleName;
        this.conditionRuleObj.description = this.conditionRuleParam.description;
        let groups = this.conditionRuleParam.conditionGroups;
        this.setupConditions(groups);
      }
    },

    setupConditions(groups) {
      if (groups != undefined && groups != null) {
        groups.forEach((group) => {
          let conditions = group.conditions;
          // Trường hợp group chỉ có 1 condition
          if (conditions.length == 1) {
            let condition = conditions[0];
            let condType =
              condition.productConditionId != undefined ? "PRODUCT" : "ORDER";
            switch (condType) {
              case "PRODUCT": {
                if (condition.productQuantity > 0) {
                  let item = {
                    condType: "PRODUCT",
                    itemType: "QUANTITY",
                    name: "Quantity",
                    productQuantity: condition.productQuantity,
                    quantityOperator: condition.quantityOperator,
                    nextOperator: condition.nextOperator,
                    productList: condition.listProduct,
                  };
                  this.conditionItem.push(item);
                } else {
                  let item = {
                    condType: "PRODUCT",
                    itemType: "CODE",
                    name: "Product code",
                    productConditionType: condition.productConditionType,
                    nextOperator: condition.nextOperator,
                    productList: condition.listProduct,
                  };
                  this.conditionItem.push(item);
                }
                break;
              }
              case "ORDER": {
                if (condition.quantity > 0) {
                  let item = {
                    condType: "ORDER",
                    itemType: "QUANTITY",
                    name: "Quantity",
                    quantityOperator: condition.quantityOperator,
                    quantity: condition.quantity,
                    nextOperator: condition.nextOperator,
                  };
                  this.conditionItem.push(item);
                } else {
                  let item = {
                    condType: "ORDER",
                    itemType: "AMOUNT",
                    name: "Amount",
                    amountOperator: condition.amountOperator,
                    amount: condition.amount,
                    nextOperator: condition.nextOperator,
                  };
                  this.conditionItem.push(item);
                }
                break;
              }
            }
          }
          if (conditions.length > 1) {
            let groupItem = {
              groupNo: group.groupNo,
              tasks: [],
              nextOperator: group.nextOperator,
            };
            conditions.forEach((condition) => {
              let condType =
                condition.productConditionId != undefined ? "PRODUCT" : "ORDER";
              switch (condType) {
                case "PRODUCT": {
                  if (condition.productQuantity > 0) {
                    let item = {
                      condType: "PRODUCT",
                      itemType: "QUANTITY",
                      name: "Quantity",
                      productQuantity: condition.productQuantity,
                      quantityOperator: condition.quantityOperator,
                      nextOperator: condition.nextOperator,
                      productList: condition.listProduct,
                    };
                    groupItem.tasks.push(item);
                  } else {
                    let item = {
                      condType: "PRODUCT",
                      itemType: "CODE",
                      name: "Product code",
                      productConditionType: condition.productConditionType,
                      nextOperator: condition.nextOperator,
                      productList: condition.listProduct,
                    };
                    groupItem.tasks.push(item);
                  }
                  break;
                }
                case "ORDER": {
                  if (condition.quantity > 0) {
                    let item = {
                      condType: "ORDER",
                      itemType: "QUANTITY",
                      name: "Quantity",
                      quantityOperator: condition.quantityOperator,
                      quantity: condition.quantity,
                      nextOperator: condition.nextOperator,
                    };
                    groupItem.tasks.push(item);
                  } else {
                    let item = {
                      condType: "ORDER",
                      itemType: "AMOUNT",
                      name: "Amount",
                      amountOperator: condition.amountOperator,
                      amount: condition.amount,
                      nextOperator: condition.nextOperator,
                    };
                    groupItem.tasks.push(item);
                  }
                  break;
                }
              }
            });
            this.conditionItem.push(groupItem);
          }
        });
      }
    },
    updateTier() {
      if (this.actionType == "1" || this.actionType == "2") {
        this.updatePromotionTierParam.action = this.$refs["static-item"].action;
        this.updatePromotionTierParam.promotionTierId = this.$refs[
          "static-item"
        ].action.promotionTierId;
        if (
          this.updatePromotionTierParam.action.actionType == "1" &&
          this.updatePromotionTierParam.action.listProduct.length == 0
        ) {
          this.$notify({
            title: "Warning",
            message: "Please select product for action",
            type: "warning",
          });
          return;
        }
      } else {
        this.updatePromotionTierParam.gift = this.$refs["static-item"].gift;
        this.updatePromotionTierParam.promotionTierId = this.$refs[
          "static-item"
        ].gift.promotionTierId;
        if (
          this.updatePromotionTierParam.gift.actionType == "3" &&
          this.updatePromotionTierParam.gift.discountType == "8" &&
          this.updatePromotionTierParam.gift.listProduct.length == 0
        ) {
          this.$notify({
            title: "Warning",
            message: "Please select product for action",
            type: "warning",
          });
          return;
        }
      }
      let condItems = this.conditionItem;
      let conditionGroups = this.handleCondition(condItems);
      if (conditionGroups == undefined) {
        return;
      }
      this.updatePromotionTierParam.conditionGroups = conditionGroups;
      this.updatePromotionTierParam.promotionId = this.promotionId;
      this.updatePromotionTierParam.conditionRule = this.conditionRule;
      this.updatePromotionTierParam.conditionRule.ruleName = this.conditionRuleObj.ruleName;
      this.updatePromotionTierParam.conditionRule.description = this.conditionRuleObj.description;
      return this.updatePromotionTierParam;
    },
    createTier() {
      let condItems = this.conditionItem;
      let actItems = this.actionItem;
      let productList = this.$refs["dropSection"].productSelection;
      let action = {};
      if (this.actionType != undefined) {
        if (this.actionType == "1" || this.actionType == "2") {
          action = this.$refs["static-item"].action;
          if (action.actionType == "1" && action.listProduct.length == 0) {
            this.$notify({
              title: "Warning",
              message: "Please select product for action",
              type: "warning",
            });
            return;
          }
        } else {
          action = this.$refs["static-item"].gift;
          if (
            action.actionType == "3" &&
            action.discountType == "8" &&
            action.listProduct.length == 0
          ) {
            this.$notify({
              title: "Warning",
              message: "Please select product for action",
              type: "warning",
            });
            return;
          }
        }
      } else {
        action = this.handleAction(actItems, productList);
      }

      let conditionGroups = this.handleCondition(condItems);
      if (conditionGroups == undefined) {
        return;
      }
      if (action.actionType != "1" && action.actionType != "2") {
        this.createPromotionTierParam.gift = action;
      } else {
        this.createPromotionTierParam.action = action;
      }
      this.createPromotionTierParam.conditionGroups = conditionGroups;
      this.createPromotionTierParam.conditionRule.brandId = this.$store.state.condition.brandId;
      if (this.promotionId != undefined || this.promotionId != "") {
        this.createPromotionTierParam.promotionId = this.promotionId;
      }

      console.log(this.createPromotionTierParam);
      this.createPromotionTierParam.conditionRule.ruleName = this.conditionRuleObj.ruleName;
      this.createPromotionTierParam.conditionRule.description = this.conditionRuleObj.description;

      return this.createPromotionTierParam;
    },

    saveTier() {},

    handleCondition(condItems) {
      if (condItems.length == 0) {
        this.$notify({
          title: "Warning",
          message: "Please select condition",
          type: "warning",
        });
        return;
      }
      let conditionGroups = [];
      for (let i = 0; i < condItems.length; i++) {
        let item = condItems[i];
        // Nếu item không phải là group
        if (item.condType != undefined) {
          let condType = item.condType;
          let conditionGroup = {
            groupNo: i,
            nextOperator: item.nextOperator,
            orderCondition: [],
            productCondition: [],
          };
          switch (condType) {
            case "PRODUCT": {
              if (item.productList != undefined && item.productList.length > 0) {
                let productCondition = {
                  productConditionType:
                    item.productConditionType != undefined
                      ? item.productConditionType
                      : "1",
                  productQuantity:
                    item.productQuantity != undefined ? item.productQuantity : 0,
                  quantityOperator:
                    item.quantityOperator != undefined ? item.quantityOperator : "1",
                  nextOperator: item.nextOperator,
                  indexGroup: 0,
                  listProduct: [],
                };
                item.productList.forEach((element) => {
                  productCondition.listProduct.push(element.productId);
                });

                conditionGroup.productCondition.push(productCondition);
                break;
              } else {
                this.$notify({
                  title: "Warning",
                  message: "Please select product for condition",
                  type: "warning",
                });
                return;
              }
            }
            case "ORDER": {
              let orderCondition = {
                quantity: item.quantity != undefined ? item.quantity : 0,
                quantityOperator:
                  item.quantityOperator != undefined ? item.quantityOperator : "1",
                amount: item.amount != undefined ? item.amount : 0,
                amountOperator:
                  item.amountOperator != undefined ? item.amountOperator : "1",
                nextOperator: item.nextOperator,
                indexGroup: 0,
              };
              conditionGroup.orderCondition.push(orderCondition);
              break;
            }
          }
          conditionGroups.push(conditionGroup);
        } else {
          // Nếu item là group
          let conditionGroup = {
            groupNo: i,
            nextOperator: item.nextOperator,
            orderCondition: [],
            productCondition: [],
          };
          for (let j = 0; j < item.tasks.length; j++) {
            let child = item.tasks[j];
            let condType = child.condType;
            switch (condType) {
              case "PRODUCT": {
                let productCondition = {
                  productConditionType:
                    child.productConditionType != undefined
                      ? child.productConditionType
                      : "0",
                  productQuantity:
                    child.productQuantity != undefined ? child.productQuantity : 0,
                  quantityOperator:
                    child.quantityOperator != undefined ? child.quantityOperator : "1",
                  nextOperator: child.nextOperator,
                  indexGroup: j,
                  listProduct: [],
                };
                child.productList.forEach((element) => {
                  productCondition.listProduct.push(element.productId);
                });
                conditionGroup.productCondition.push(productCondition);
                break;
              }
              case "ORDER": {
                let orderCondition = {
                  quantity: child.quantity != undefined ? child.quantity : 0,
                  quantityOperator:
                    child.quantityOperator != undefined ? child.quantityOperator : "1",
                  amount: child.amount != undefined ? child.amount : 0,
                  amountOperator:
                    child.amountOperator != undefined ? child.amountOperator : "1",
                  nextOperator: child.nextOperator,
                  indexGroup: j,
                };
                conditionGroup.orderCondition.push(orderCondition);
                break;
              }
            }
          }
          conditionGroups.push(conditionGroup);
        }
      }

      return conditionGroups;
    },

    handleAction(actionItems, productList) {
      if (actionItems.length == 0) {
        this.$notify({
          title: "Warning",
          message: "Please select action",
          type: "warning",
        });
        return;
      }

      let actItem = actionItems[0];
      let actionType = actItem.actionType;
      let discountType = actItem.discountType;
      if (actionType == "1" || actionType == "2") {
        if (actionType == "1" && productList.length == 0) {
          this.$notify({
            title: "Warning",
            message: "Please select product for action",
            type: "warning",
          });
          return;
        }
        let action = {
          actionType: actionType,
          discountType: discountType,
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
          bundleStrategy: "",
          listProduct: [],
        };
        productList.forEach((product) => {
          action.listProduct.push(product.productId);
        });
        switch (actionType) {
          case "1": {
            switch (discountType) {
              case "1": {
                action.discountAmount = actItem.value;
                action.minPriceAfter = actItem.minValueAfterDiscount;
                break;
              }
              case "2": {
                action.discountPercentage = actItem.valuePercent;
                action.maxAmount = actItem.amountLimit;
                break;
              }
              case "3": {
                action.discountQuantity = actItem.value;
                break;
              }
              case "5": {
                action.fixedPrice = actItem.fixedValue;
                break;
              }
              case "6": {
                action.orderLadderProduct = actItem.orderLadderProduct;
                action.ladderPrice = actItem.ladderPrice;
                break;
              }
              case "7": {
                action.bundlePrice = actItem.bundlePrice;
                action.bundleQuantity = actItem.bundleQuantity;
                action.bundleStrategy = actItem.strategy;
                break;
              }
            }
            break;
          }
          case "2": {
            switch (discountType.trim()) {
              case "1": {
                action.discountAmount = actItem.value;
                action.minPriceAfter = actItem.minValueAfterDiscount;
                break;
              }
              case "2": {
                action.discountPercentage = actItem.valuePercent;
                action.maxAmount = actItem.amountLimit;
                break;
              }
              case "4": {
                if (actItem.type == "1") {
                  action.discountAmount = actItem.valueAmount;
                } else {
                  action.discountPercentage = actItem.valuePercent;
                  action.maxAmount = actItem.amountLimit;
                }
                break;
              }
            }
            break;
          }
        }
        return action;
      } else if (actionType == "3" || actionType == "4") {
        let gift = {
          actionType: actionType,
          discountType: discountType,
          giftQuantity: 0,
          giftProductCode: "",
          giftName: "",
          giftVoucherCode: "",
          bonusPoint: 0,
          listProduct: [],
        };
        productList.forEach((product) => {
          gift.listProduct.push(product.productId);
        });
        switch (discountType) {
          case "8": {
            gift.giftQuantity = actItem.quantity;
            break;
          }
          case "9": {
            gift.giftVoucherCode = actItem.giftVoucherCode;
            break;
          }
          case "10": {
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
<style scoped>
.condition-drag-custom {
  background-color: white;
  padding-bottom: 30px;
}
</style>
