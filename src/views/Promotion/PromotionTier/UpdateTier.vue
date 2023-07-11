<template>
  <div>
    <el-card shadow="never" class="custom-card-2">
      <el-row class="bg-transparent">
        <el-col :span="24" class="action-builder-title-2">ACTION</el-col>
      </el-row>
      <el-row v-if="actionForm != undefined">
        <el-col :span="24">
          <label class="label-type">
            Discount Type: <b> {{ actionForm.discountType | discountTypeFilter }}</b>
          </label>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form
            :model="actionForm"
            :ref="'update_actionForm_'"
            :id="'update_actionForm_'"
            label-position="top"
          >
            <el-card shadow="never">
              <product-action-update
                v-if="actionForm.actionType == 1"
                :actionForm="actionForm"
                :productCodes="productCodes"
                v-on:addProductCode="addProductCode"
                v-on:removeProductCode="removeProductCode"
              />
              <order-action-update
                v-if="actionForm.actionType == 2"
                :actionForm="actionForm"
              />
              <gift-action-update
                v-if="actionForm.actionType == 3"
                :actionForm="actionForm"
              />
              <bonus-point-update
                v-if="actionForm.actionType == 4"
                :actionForm="actionForm"
              />
            </el-card>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <el-col :span="24">
              <h4>Summary</h4>
            </el-col>
            <el-divider></el-divider>
            <p style="word-break: break-word">{{ actionForm | actionType }}</p>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="mt-3">
        <el-col :span="24">
          <div class="float-right">
            <el-button type="text" @click="closeDialog" style="color: black" size="small"
              >Cancel</el-button
            >
            <el-button type="success" @click="updateAction" size="small"
              >Update</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import BonusPointUpdate from "./UpdateAction/BonusPointUpdate.vue";
import GiftActionUpdate from "./UpdateAction/GiftActionUpdate.vue";
import OrderActionUpdate from "./UpdateAction/OrderActionUpdate.vue";
import ProductActionUpdate from "./UpdateAction/ProductActionUpdate";

export default {
  name: "update-tier",
  components: {
    "product-action-update": ProductActionUpdate,
    OrderActionUpdate,
    GiftActionUpdate,
    BonusPointUpdate,
  },

  props: {
    promotionId: String,
    promotionTierParam: Object,
  },
  data() {
    return {
      conditionOption: 1,
      viewListOption: true,
      actionForm: {
        actionType: "1",
        discountType: "1",
        productAction: {
          productType: "1",
          parentCode: "",
          productCode: "",
          value: 0,
          minValueAfterDiscount: 0,
        },
        orderAction: {
          value: 0,
          minValueAfterDiscount: 0,
        },
        giftAction: {
          giftProductCode: "",
          giftName: "",
          quantity: 0,
        },
        bonusPoint: {
          bonusPoint: 0,
        },
      },
      productCodes: [],
      // List of product actions
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
      // List of order actions
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
      // List of gift actions
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
      // Bonus point action
      bonusPoint: {
        bonusPoint: 0,
      },
    };
  },
  computed: {
    promotionTier() {
      return this.promotionTierParam;
    },
  },
  mounted() {
    console.log("Update tier mounted");
    this.loadData();
  },
  watch: {
    promotionTier() {
      console.log("Update tier watch");
      this.loadData();
    },
    // console.log('load data')
  },
  methods: {
    addProductCode(productCode) {
      this.productCodes.push(productCode);
    },
    closeDialog() {
      this.refeshActionForm();
      this.$emit("handleCloseUpdAct");
    },
    updateAction() {
      this.$emit("updateActionFunc");
    },
    loadData() {
      this.handleAction(this.actionForm, this.promotionTier);
    },
    removeProductCode(index) {
      this.productCodes.splice(index, 1);
    },

    viewListCondition() {
      this.ruleDialogVisible = true;
    },
    handleAction(actionForm, promotionTier) {
      let selectAction = {};
      let actionParam = actionForm;
      if (promotionTier.action != null) {
        selectAction = promotionTier.action;
        actionParam.actionId = selectAction.actionId;
      } else if (promotionTier.membershipAction != null) {
        selectAction = promotionTier.membershipAction;
        actionParam.membershipActionId = selectAction.membershipActionId;
      }
      actionParam.actionType = selectAction.actionType;
      actionParam.discountType = selectAction.discountType;
      switch (actionParam.actionType) {
        case "1": {
          switch (actionParam.discountType) {
            case "1": {
              actionParam.productAction = {
                productType: selectAction.productType,
                parentCode: selectAction.parentCode,
                productCode: selectAction.productCode,
                value: selectAction.discountAmount,
                minValueAfterDiscount: selectAction.minPriceAfter,
              };
              break;
            }
            case "2": {
              actionParam.productAction = {
                productType: selectAction.productType,
                parentCode: selectAction.parentCode,
                productCode: selectAction.productCode,
                valuePercent: selectAction.discountPercentage,
                amountLimit: selectAction.maxAmount,
              };
              break;
            }
            case "3": {
              actionParam.productAction = {
                productType: selectAction.productType,
                parentCode: selectAction.parentCode,
                productCode: selectAction.productCode,
                value: selectAction.discountQuantity,
              };
              break;
            }
            case "5": {
              actionParam.productAction = {
                productType: selectAction.productType,
                parentCode: selectAction.parentCode,
                productCode: selectAction.productCode,
                fixedValue: selectAction.fixedPrice,
              };
              break;
            }
            case "6": {
              actionParam.productAction = {
                productType: selectAction.productType,
                parentCode: selectAction.parentCode,
                productCode: selectAction.productCode,
                orderLadderProduct: selectAction.orderLadderProduct,
                ladderPrice: selectAction.ladderPrice,
              };
              break;
            }
            case "7": {
              actionParam.productAction = {
                productType: selectAction.productType,
                parentCode: selectAction.parentCode,
                productCode: selectAction.productCode,
                strategy: selectAction.bundleStrategy,
                bundleQuantity: selectAction.bundleQuantity,
                bundlePrice: selectAction.bundlePrice,
              };
              break;
            }
          }
          if (actionParam.productAction.productCode.length > 0) {
            this.productCodes = actionParam.productAction.productCode.split("|");
          }

          break;
        }
        case "2": {
          switch (actionParam.discountType) {
            case "1": {
              actionParam.orderAction = {
                value: selectAction.discountAmount,
                minValueAfterDiscount: selectAction.minPriceAfter,
              };
              break;
            }
            case "2": {
              actionParam.orderAction = {
                value: selectAction.discountPercentage,
                amountLimit: selectAction.maxAmount,
              };
              break;
            }
            case "4": {
              actionParam.orderAction = {
                type: "1",
                valueAmount: selectAction.discountAmount,
                valuePercent: selectAction.discountPercentage,
                amountLimit: selectAction.maxAmount,
              };
              if (selectAction.discountPercentage > 0) {
                actionParam.orderAction.type = "2";
              }
              break;
            }
          }
          break;
        }
        case "3": {
          switch (actionParam.discountType.trim()) {
            case "8": {
              actionParam.giftAction = {
                giftProductCode: selectAction.giftProductCode,
                giftName: selectAction.giftName,
                quantity: selectAction.giftQuantity,
              };
              break;
            }
            case "9": {
              actionParam.giftAction = {
                option: false,
                giftVoucherCode: selectAction.giftVoucherCode,
              };
              break;
            }
          }
          break;
        }
        case "4": {
          actionParam.bonusPoint = {
            bonusPoint: selectAction.bonusPoint,
          };
          break;
        }
      }
    },
    refeshActionForm() {
      this.actionForm = {
        actionType: "1",
        discountType: "1",
        productAction: {
          productType: "1",
          parentCode: "",
          productCode: "",
          value: 0,
          minValueAfterDiscount: 0,
        },
        orderAction: {
          value: 0,
          minValueAfterDiscount: 0,
        },
        giftAction: {
          giftProductCode: "",
          giftName: "",
          quantity: 0,
        },
        bonusPoint: {
          bonusPoint: 0,
        },
      };
    },
  },
  filters: {
    actionType(promotionTier) {
      let result = "";
      if (promotionTier.actionId != null) {
        let actionType = promotionTier.actionType;
        switch (actionType) {
          // Giảm giá cho sản phẩm
          case "1": {
            let discountType = promotionTier.discountType.trim();
            switch (discountType) {
              case "1": {
                result += "Discount ";
                result +=
                  promotionTier.productAction.value.toLocaleString("vi-VN") + " VNĐ";
                if (promotionTier.minValueAfterDiscount > 0) {
                  result +=
                    ", minimum residual price " +
                    promotionTier.productAction.minValueAfterDiscount.toLocaleString(
                      "vi-VN"
                    ) +
                    " VNĐ";
                }
                result += " for product";
                break;
              }
              case "2": {
                result += "Discount ";
                result += promotionTier.productAction.valuePercent + "%";
                if (promotionTier.productAction.amountLimit > 0) {
                  result += ", maximum ";
                  result +=
                    promotionTier.productAction.amountLimit.toLocaleString("vi-VN") +
                    " VNĐ ";
                }
                result += " for product";
                break;
              }
              case "3": {
                result += "Free ";
                result += promotionTier.productAction.value + " unit(s) ";
                result += "of product";
                break;
              }

              case "5": {
                result += "Fixed ";
                result +=
                  promotionTier.productAction.fixedValue.toLocaleString("vi-VN") +
                  " VNĐ ";
                result += "for product";
                break;
              }
              case "6": {
                result += "Buy from the ";
                result +=
                  promotionTier.productAction.orderLadderProduct +
                  ["th", "st", "nd", "rd"][
                    Math.abs(
                      ~[1, 2, 3].indexOf(
                        +(+promotionTier.productAction.orderLadderProduct)
                          .toFixed()
                          .substr(-1)
                      )
                    )
                  ];
                result += " product at the price of ";
                result +=
                  promotionTier.productAction.ladderPrice.toLocaleString("vi-VN") +
                  " VNĐ";

                break;
              }
              case "7": {
                result += "Buy ";
                result += promotionTier.productAction.bundleQuantity + " product(s) for ";
                result +=
                  promotionTier.productAction.bundlePrice.toLocaleString("vi-VN") +
                  " VNĐ";

                break;
              }
            }
            break;
          }
          // Giảm giá cho order
          case "2": {
            let discountType = promotionTier.discountType.trim();
            switch (discountType) {
              case "1": {
                result += "Discount ";
                result +=
                  promotionTier.orderAction.value.toLocaleString("vi-VN") + " VNĐ";
                if (promotionTier.orderAction.minValueAfterDiscount > 0) {
                  result +=
                    ", minimum residual price " +
                    promotionTier.orderAction.minValueAfterDiscount.toLocaleString(
                      "vi-VN"
                    ) +
                    " VNĐ";
                }

                result += " for order";
                break;
              }
              case "2": {
                result += "Discount ";
                result += promotionTier.orderAction.value + "%";
                if (promotionTier.orderAction.amountLimit > 0) {
                  result += ", maximum ";
                  result +=
                    promotionTier.orderAction.amountLimit.toLocaleString("vi-VN") +
                    " VNĐ ";
                }
                result += "for order";
                break;
              }
              case "4": {
                result += "Discount ";
                if (promotionTier.orderAction.valueAmount != 0) {
                  result +=
                    promotionTier.orderAction.valueAmount.toLocaleString("vi-VN") +
                    " VNĐ ";
                } else {
                  result += promotionTier.orderAction.valuePercent + "% ";
                  if (promotionTier.orderAction.amountLimit > 0) {
                    result += ", maximum ";
                    result +=
                      promotionTier.orderAction.amountLimit.toLocaleString("vi-VN") +
                      " VNĐ ";
                  }
                }
                result += "for shipping of order";

                break;
              }
            }
            break;
          }
        }
        return result;
      } else if (promotionTier.membershipActionId != null) {
        let actionType = promotionTier.actionType;
        switch (actionType) {
          case "3": {
            let discountType = promotionTier.discountType.trim();
            switch (discountType) {
              case "8": {
                result += "Gift ";
                result += promotionTier.giftAction.quantity;
                result += " " + promotionTier.giftAction.giftName + "(s)";
                break;
              }
              case "9": {
                result += "Gift a voucher code: ";
                result += promotionTier.giftAction.giftVoucherCode;
                break;
              }
            }
            return result;
          }
          case "4": {
            result += "Bonus point: ";
            result += promotionTier.bonusPoint.bonusPoint + " point(s)";
            return result;
          }
        }
      }
      return "Undifined";
    },
    actionTypeFilter(value) {
      switch (value) {
        case "1": {
          return "Action for item";
        }
        case "2": {
          return "Action for cart";
        }
        case "3": {
          return "Gift";
        }
        case "4": {
          return "Bonus point";
        }
      }
    },
    discountTypeFilter(value) {
      if (value != undefined) {
        switch (value.trim()) {
          case "1": {
            return "Amount";
          }
          case "2": {
            return "Percentage";
          }
          case "3": {
            return "Unit";
          }
          case "4": {
            return "Shipping fee";
          }
          case "5": {
            return "Fixed price";
          }
          case "6": {
            return "Ladder price";
          }
          case "7": {
            return "Bundle price";
          }
          case "8": {
            return "Gift product";
          }
          case "9": {
            return "Gift voucher";
          }
          default: {
            return "Bonus point";
          }
        }
      } else return "";
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
.label-type {
  font-size: 1.1vw;
  color: black;
}
.action-builder-title-2 {
  color: rgb(19, 19, 19);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0px 0px 10px 0px;
}

</style>
