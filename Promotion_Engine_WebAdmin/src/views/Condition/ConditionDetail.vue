<template>
  <div v-loading="loading" id="action">
    <base-header type="gradient-success" class="pb-6 mb-3 pt-1"> </base-header>
    <div class="container-fluid">
      <el-card>
        <h2>UPDATE CONDITION</h2>
        <el-divider class="mt-3 mb-3"></el-divider>
        <el-col class="mb-3" :span="24">
          <el-tag class="custom-tag-content" type="warning">
            <i class="el-icon-warning-outline mr-2"></i>
            <label>{{ $ENV.TEXT_EXPLAIN.Condition }}</label></el-tag
          >
        </el-col>
        <el-form label-width="200" :model="conditionRuleObj" label-position="left">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="ruleName" label="Name">
                <el-input v-model="conditionRuleObj.ruleName"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Description" prop="description">
                <el-input v-model="conditionRuleObj.description"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card>
              <drag-item-section ref="dragSection" :conditionItem="conditionItem" />
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card>
              <drop-section ref="dropSection" :conditionItemParam="conditionItem" />
            </el-card>
          </el-col>
        </el-row>

        <el-row>
          <el-button
            type="primary"
            class="mt-3 float-right"
            @click="updateCondition"
            icon="el-icon-plus"
            >Update Rule</el-button
          >
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import DropSection from "./ConditionForm/DragComponent/DropSection.vue";
import DragItemSection from "./ConditionForm/DragComponent/DragItemSection.vue";

Vue.use(VueClipboard);
export default {
  components: { DropSection, DragItemSection },
  name: "condition-detail",
  data() {
    return {
      loading: false,
      CONSTANT: this.$ENV,
      conditionItem: [],
      conditionRuleObj: {
        ruleName: "",
        description: "",
      },
      updateParam: {
        conditionRule: {
          conditionRuleId: "",
          brandId: "",
          ruleName: "",
          description: "",
          insDate: "",
          updDate: "",
        },
        conditionGroups: [],
      },
    };
  },
  computed: {
    conditionDetail() {
      return this.$store.state.condition.conditionDetail;
    },
  },
  async created() {
    await this.getProducts();
    await this.getConditionDetail();
    this.setupUpdateData();
  },
  methods: {
    async getProducts() {
      this.loading = true;
      await this.$store
        .dispatch("condition/getBrandProduct")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              title: "Warning",
              message: "Cannot get Products",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            title: "Warning",
            message: "Cannot get Products",
            type: "warning",
          });
        });
    },
    updateCondition() {
      this.loading = true;
      let condItems = this.conditionItem;
      let conditionGroups = this.handleCondition(condItems);
      if (conditionGroups == undefined) {
        this.loading = false;
        return;
      }
      this.updateParam.conditionGroups = conditionGroups;
      this.updateParam.conditionRule.conditionRuleId = this.conditionDetail.conditionRuleId;
      this.updateParam.conditionRule.brandId = this.conditionDetail.brandId;
      this.updateParam.conditionRule.ruleName = this.conditionRuleObj.ruleName;
      this.updateParam.conditionRule.insDate = this.conditionDetail.insDate;
      this.updateParam.conditionRule.updDate = new Date().toLocaleString("vn", {
        timeZone: "Asia/Ho_Chi_Minh",
      });
      this.updateParam.conditionRule.description = this.conditionRuleObj.description;
      this.$store.commit("condition/setUpdateId", this.conditionDetail.conditionRuleId);
      this.$store.commit("condition/setUpdateParam", this.updateParam);
      this.$store
        .dispatch("condition/updateCondition")
        .then((result) => {
          if (result.status == 200) {
            this.loading = false;
            this.$notify({
              title: "Success",
              message: "Update Success",
              type: "success",
            });
          } else {
            this.$notify({
              title: "Warning",
              message: "Update Error",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            title: "Warning",
            message: "Update Error",
            type: "warning",
          });
        });
    },
    handleCondition(condItems) {
      let CONTAIN_CODE = this.CONSTANT.CONTAIN_CODE;
      let OPERATOR = this.CONSTANT.OPERATOR;
      // let NEXT_OPERATOR = CONSTANT.NEXT_OPERATOR;
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
                      : CONTAIN_CODE.INCLUDE,
                  productQuantity:
                    item.productQuantity != undefined ? item.productQuantity : 0,
                  quantityOperator:
                    item.quantityOperator != undefined
                      ? OPERATOR.find((o) => o.id == item.quantityOperator).name
                      : OPERATOR.find((o) => o.id == 1).name,
                  nextOperator: item.nextOperator,
                  indexGroup: 0,
                  productConditionMapping: [],
                };
                item.productList.forEach((element) => {
                  let mapp = {
                    productId: element.productId,
                    insDate: new Date().toLocaleString("vn", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    }),
                    updDate: new Date().toLocaleString("vn", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    }),
                  };
                  productCondition.productConditionMapping.push(mapp);
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
                  item.quantityOperator != undefined
                    ? OPERATOR.find((o) => o.id == item.quantityOperator).name
                    : OPERATOR.find((o) => o.id == 1).name,
                amount: item.amount != undefined ? item.amount : 0,
                amountOperator:
                  item.amountOperator != undefined
                    ? OPERATOR.find((o) => o.id == item.amountOperator).name
                    : OPERATOR.find((o) => o.id == 1).name,
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
          if (item.tasks.length == 0) {
            this.$notify({
              title: "Warning",
              message: "Please select condition for group",
              type: "warning",
            });
            return;
          } else {
            for (let j = 0; j < item.tasks.length; j++) {
              let child = item.tasks[j];
              let condType = child.condType;
              switch (condType) {
                case "PRODUCT": {
                  let productCondition = {
                    productConditionType:
                      child.productConditionType != undefined
                        ? child.productConditionType
                        : CONTAIN_CODE.INCLUDE,
                    productQuantity:
                      child.productQuantity != undefined ? child.productQuantity : 0,
                    quantityOperator:
                      child.quantityOperator != undefined
                        ? OPERATOR.find((o) => o.id == child.quantityOperator).name
                        : OPERATOR.find((o) => o.id == 1).name,
                    nextOperator: child.nextOperator,
                    indexGroup: j,
                    productConditionMapping: [],
                  };
                  child.productList.forEach((element) => {
                    let mapp = {
                      productId: element.productId,
                      insDate: new Date().toLocaleString("vn", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      }),
                      updDate: new Date().toLocaleString("vn", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      }),
                    };
                    productCondition.productConditionMapping.push(mapp);
                  });

                  conditionGroup.productCondition.push(productCondition);
                  break;
                }
                case "ORDER": {
                  let orderCondition = {
                    quantity: child.quantity != undefined ? child.quantity : 0,
                    quantityOperator:
                      child.quantityOperator != undefined
                        ? OPERATOR.find((o) => o.id == child.quantityOperator).name
                        : OPERATOR.find((o) => o.id == 1).name,
                    amount: child.amount != undefined ? child.amount : 0,
                    amountOperator:
                      child.amountOperator != undefined
                        ? OPERATOR.find((o) => o.id == child.amountOperator).name
                        : OPERATOR.find((o) => o.id == 1).name,
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
      }
      return conditionGroups;
    },
    setupUpdateData() {
      this.conditionItem = [];
      if (this.conditionDetail) {
        this.conditionRuleObj.ruleName = this.conditionDetail.ruleName;
        this.conditionRuleObj.description = this.conditionDetail.description;
        let groups = this.conditionDetail.conditionGroups;
        this.setupConditions(groups);
      }
      console.log(this.conditionItem);
    },

    setupConditions(groups) {
      let OPERATOR = this.CONSTANT.OPERATOR;
      if (groups) {
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
                    quantityOperator: OPERATOR.find(
                      (o) => o.name == condition.quantityOperator.trim()
                    ).id,
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
                    quantityOperator: OPERATOR.find(
                      (o) => o.name == condition.quantityOperator.trim()
                    ).id,
                    quantity: condition.quantity,
                    nextOperator: condition.nextOperator,
                  };
                  this.conditionItem.push(item);
                } else {
                  let item = {
                    condType: "ORDER",
                    itemType: "AMOUNT",
                    name: "Amount",
                    amountOperator: OPERATOR.find(
                      (o) => o.name == condition.amountOperator.trim()
                    ).id,
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
                      quantityOperator: OPERATOR.find(
                        (o) => o.name == condition.quantityOperator.trim()
                      ).id,
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
                      quantityOperator: OPERATOR.find(
                        (o) => o.name == condition.quantityOperator.trim()
                      ).id,
                      quantity: condition.quantity,
                      nextOperator: condition.nextOperator,
                    };
                    groupItem.tasks.push(item);
                  } else {
                    let item = {
                      condType: "ORDER",
                      itemType: "AMOUNT",
                      name: "Amount",
                      amountOperator: OPERATOR.find(
                        (o) => o.name == condition.amountOperator.trim()
                      ).id,
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
    async getConditionDetail() {
      let id = this.$route.params.id;
      this.$store.commit("condition/setDetailId", id);
      await this.$store
        .dispatch("condition/getConditionDetail")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              title: "Error",
              message: "Error when get condition detail",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "Error",
            message: "Error when get condition detail",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style></style>
<style scoped>
.custom-tag-content {
  word-break: break-word;
  font-size: 17px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
}
</style>
