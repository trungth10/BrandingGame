<template>
  <div v-loading="loading" style="min-height: 70vh">
    <base-header type="gradient-success" class="pb-6 mb-3 pt-1"> </base-header>
    <div class="container-fluid">
      <el-card>
        <h2>CONDITION BUILDER</h2>
        <el-divider class="mt-3 mb-3"></el-divider>
        <el-col class="mb-3" :span="24">
          <el-tag class="custom-tag-content" type="warning">
            <i class="el-icon-warning-outline mr-2"></i>
            <label>{{ $ENV.TEXT_EXPLAIN.Condition }}</label></el-tag
          >
        </el-col>
        <el-form
          label-width="200"
          :rules="myRule"
          :model="conditionRule"
          label-position="left"
          ref="ruleForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="ruleName" label="Name">
                <el-input
                  v-model="conditionRule.ruleName"
                  :maxlength="50"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Description" prop="description">
                <el-input
                  :rows="4"
                  resize="none"
                  type="textarea"
                  v-model="conditionRule.description"
                  show-word-limit
                  :maxlength="200"
                >
                </el-input>
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
            icon="el-icon-plus"
            @click="newRule"
            >New Rule</el-button
          >
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import DragItemSection from "./ConditionForm/DragComponent/DragItemSection.vue";
import DropSection from "./ConditionForm/DragComponent/DropSection.vue";

export default {
  name: "condition-form",
  components: {
    DragItemSection,
    DropSection,
  },
  created() {
    this.getProducts();
  },
  data() {
    var ruleNameValidator = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error("Please input name"));
      } else {
        callback();
      }
    };
    var descriptionValidator = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error("Please input description"));
      } else {
        callback();
      }
    };
    return {
      myRule: {
        description: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input description",
          },
          {
            validator: descriptionValidator,
            trigger: ["blur", "change"],
          },
        ],
        ruleName: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input name",
          },
          {
            validator: ruleNameValidator,
            trigger: ["blur", "change"],
          },
        ],
      },
      CONSTANT: this.$ENV,
      formIndex: 0,
      loading: false,
      promotionType: true,
      isSaved: false,
      conditionItem: [],
      conditionRule: {
        ruleName: "",
        description: "",
        brandId: "",
        conditionGroup: [],
      },
    };
  },
  computed: {
    conditions() {
      return this.$store.state.condition.conditions;
    },
    requestParam() {
      return this.$store.state.condition.requestParam;
    },
  },
  methods: {
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
    newRule() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          let condItems = this.conditionItem;
          let conditions = this.handleCondition(condItems);
          if (conditions) {
            let conditionRule = this.conditionRule;
            conditionRule.brandId = this.$store.state.condition.brandId;
            conditionRule.conditionGroup = conditions;
            this.$store.commit("condition/setInsertConditionDto", conditionRule);
            this.$store
              .dispatch("condition/insertConditionRule")
              .then((result) => {
                this.loading = false;
                if (result.status == 200) {
                  this.$notify({
                    title: "Success",
                    message: "Create successful",
                    type: "success",
                  });
                  this.$router.push("/campaign/condition");
                } else {
                  this.loading = false;
                  this.$notify({
                    title: "Warning",
                    message: "Create error",
                    type: "warning",
                  });
                }
              })
              .catch(() => {
                this.loading = false;
                this.$notify({
                  title: "Warning",
                  message: "Create error",
                  type: "warning",
                });
              });
          } else {
            this.loading = false;
          }
        }
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
  font-weight: normal;
}
</style>
