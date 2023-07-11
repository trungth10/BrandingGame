<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :span="16">
        <el-form
          :id="'conditionBuilderForm_' + indexParam"
          :ref="'conditionBuilderForm_' + indexParam"
          :model="conditionRule"
          label-position="top"
        >
          <div class="card">
            <el-row type="flex" :gutter="10" justify="space-between">
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="Rule name" prop="ruleName">
                  <el-input
                    type="text"
                    placeholder="Name"
                    maxlength="50"
                    v-model="conditionRule.ruleName"
                    :disabled="disableCondition"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="Description">
                  <el-input
                    type="text"
                    placeholder="Description"
                    maxlength="200"
                    v-model="conditionRule.description"
                    :disabled="disableCondition"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="24">
                <el-button
                  type="success"
                  size="small"
                  class="float-right"
                  @click="addCondition"
                  :disabled="disableCondition"
                >
                  Add group
                </el-button>
              </el-col>
            </el-row>
          </div>
          <el-col class="mt-3" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-collapse ref="update-condition-collapse">
              <div
                v-for="(group, gIndex) in groups"
                v-bind:data="groups"
                :key="gIndex"
                :name="gIndex"
                class="mb-3"
              >
                <el-card shadow="never" class="update-card-custom custom-card-2">
                  <!-- Function button cho group -->
                  <el-row
                    class="bg-white mr-2 mt-2 mb-0"
                    style="border-top-left-radius: 5px; border-top-right-radius: 5px"
                  >
                    <el-col :span="24">
                      <div class="float-right">
                        <el-button
                          icon="el-icon-top"
                          @click="reorderGroup(gIndex, true)"
                          plain
                          size="mini"
                          round
                        >
                        </el-button>
                        <el-button
                          icon="el-icon-bottom"
                          @click="reorderGroup(gIndex, false)"
                          plain
                          size="mini"
                          round
                        >
                        </el-button>
                        <el-button
                          type="info"
                          plain
                          icon="el-icon-close"
                          size="mini"
                          circle=""
                          @click="deleteGroup(gIndex)"
                        ></el-button>
                      </div>
                    </el-col>
                  </el-row>
                  <el-collapse-item class="m-0 p-0">
                    <template slot="title">
                      <!-- Function button cho group -->
                      <el-row type="flex" justify="space-between">
                        <label> Group {{ group.groupNo }}</label>
                      </el-row>
                    </template>

                    <div
                      v-for="(condition, index) in group.conditions"
                      :key="'condition-' + index"
                      :v-bind="group.conditions"
                      :span="24"
                    >
                      <!-- Product condition khi general type = 1 -->
                      <div
                        v-if="
                          condition.generalType == 1 ||
                          condition.productConditionId != undefined
                        "
                      >
                        <product-condition
                          v-on:delete-condition="deleteCondition"
                          v-on:reorder-condition="reorderCondition"
                          :conditionParam="groups[gIndex].conditions[index]"
                          :gIndexParam="gIndex"
                          :indexParam="index"
                          :refParam="
                            'product-condition-form-' +
                            indexParam +
                            '-' +
                            gIndex +
                            '-' +
                            index
                          "
                          :ref="
                            'product-condition-' + indexParam + '-' + gIndex + '-' + index
                          "
                        />
                        <span v-if="index != group.conditions.length - 1">
                          <label class="operator-label"
                            >Combine with next condition</label
                          >
                          <el-select
                            class="mt-4"
                            v-model="condition.nextOperator"
                            placeholder="Logical operator"
                          >
                            <el-option key="1" label="OR" value="1"> </el-option>
                            <el-option key="2" label="AND" value="2"> </el-option>
                          </el-select>
                        </span>
                      </div>
                      <!-- Order condition khi general type = 2 -->
                      <div
                        v-if="
                          condition.generalType == 2 ||
                          condition.orderConditionId != undefined
                        "
                      >
                        <order-condition
                          v-on:delete-condition="deleteCondition"
                          v-on:reorder-condition="reorderCondition"
                          :conditionParam="groups[gIndex].conditions[index]"
                          :gIndexParam="gIndex"
                          :indexParam="index"
                          :refParam="
                            'order-condition-form-' +
                            indexParam +
                            '-' +
                            gIndex +
                            '-' +
                            index
                          "
                          :ref="
                            'order-condition-' + indexParam + '-' + gIndex + '-' + index
                          "
                        />
                        <span v-if="index != group.conditions.length - 1">
                          <label class="operator-label"
                            >Combine with next condition</label
                          >
                          <el-select
                            class="mt-3"
                            v-model="condition.nextOperator"
                            placeholder="Logical operator"
                          >
                            <el-option key="1" label="OR" value="1"> </el-option>
                            <el-option key="2" label="AND" value="2"> </el-option>
                          </el-select>
                        </span>
                      </div>
                      <!-- Membership condition khi general type = 3 -->
                      <div
                        v-if="
                          condition.generalType == 3 ||
                          condition.membershipConditionId != undefined
                        "
                      >
                        <membership-condition
                          v-on:delete-condition="deleteCondition"
                          v-on:reorder-condition="reorderCondition"
                          :conditionParam="groups[gIndex].conditions[index]"
                          :gIndexParam="gIndex"
                          :indexParam="index"
                          :refParam="
                            'membership-condition-form-' +
                            indexParam +
                            '-' +
                            gIndex +
                            '-' +
                            index
                          "
                          :ref="
                            'membership-condition-' +
                            indexParam +
                            '-' +
                            gIndex +
                            '-' +
                            index
                          "
                        />
                        <span v-if="index != group.conditions.length - 1">
                          <label class="operator-label"
                            >Combine with next condition</label
                          >
                          <el-select
                            class="mt-3"
                            v-model="condition.nextOperator"
                            placeholder="Logical operator"
                          >
                            <el-option key="1" label="OR" value="1"> </el-option>
                            <el-option key="2" label="AND" value="2"> </el-option>
                          </el-select>
                        </span>
                      </div>
                    </div>
                    <!-- Button add condition -->
                    <div class="mt-4">
                      <el-col :span="24">
                        <el-button
                          class="add-condition-button"
                          icon="el-icon-plus"
                          @click="addConditionToGroup(1, gIndex)"
                          >Add condition for product</el-button
                        >
                      </el-col>
                      <el-col :span="24">
                        <el-button
                          class="add-condition-button"
                          icon="el-icon-plus"
                          @click="addConditionToGroup(2, gIndex)"
                          >Add condition for cart</el-button
                        >
                      </el-col>
                      <el-col :span="24">
                        <el-button
                          class="add-condition-button"
                          icon="el-icon-plus"
                          @click="addConditionToGroup(3, gIndex)"
                          >Add condition for membership</el-button
                        >
                      </el-col>
                    </div>
                  </el-collapse-item>
                </el-card>
                <el-row
                  v-if="gIndex != groups.length - 1"
                  type="flex"
                  justify="space-between"
                  class="operator-section-custom"
                >
                  <el-col :span="20">
                    <span>
                      <label class="operator-label">Combine with next group</label>
                      <el-select
                        v-model="group.nextOperator"
                        placeholder="Combine with next group"
                      >
                        <el-option key="1" label="OR" value="1"> </el-option>
                        <el-option key="2" label="AND" value="2"> </el-option>
                      </el-select>
                    </span>
                  </el-col>
                </el-row>
                <el-row
                  v-if="gIndex == groups.length - 1"
                  type="flex"
                  justify="space-between"
                  class="operator-section-custom"
                >
                  <el-col :span="24">
                    <el-button
                      class="add-condition-button"
                      icon="el-icon-plus"
                      @click="addCondition"
                      >Add new group</el-button
                    >
                  </el-col>
                </el-row>
              </div>
              <!-- END Group -->
            </el-collapse>
          </el-col>
          <!-- END Condition list -->
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <el-col :span="24">
            <h4>Summary</h4>
          </el-col>
          <el-divider></el-divider>
          <div v-for="(group, gIndex) in groupsParam" :key="'gIndex-' + gIndex">
            <p style="word-break: break-word">{{ group | conditionFilter }}</p>
            <label class="mb-3" v-if="gIndex < groups.length - 1">
              <b> {{ group.nextOperator | nextOperatorFilter }}</b>
            </label>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MembershipCondition from "./MembershipCondition.vue";
import OrderCondition from "./OrderCondition.vue";
import ProductCondition from "./ProductCondition.vue";

export default {
  components: { OrderCondition, ProductCondition, MembershipCondition },
  name: "update-condition",

  data() {
    return {
      loading: false,
      name: "",
      description: "",
      radio: "1",
      conditionCount: 0,
      defaultSelectedConditionType: "1",
      hasCondition: false,
      groupNo: 1,
      condition: [],
      isValid: true,
      rules: {
        ruleName: [
          {
            required: true,
            message: "Please enter name",
            trigger: ["blur", "change"],
          },
        ],
        groupNo: [
          {
            required: true,
            message: "Please enter group",
            trigger: ["blur", "change"],
          },
        ],
      },
      conditionFromRules: {
        productCode: [
          {
            required: true,
            message: "Please enter code",
            trigger: ["blur", "change"],
          },
        ],
        productName: [
          {
            required: true,
            message: "Please enter name",
            trigger: ["blur", "change"],
          },
        ],
        productQuantity: [
          {
            required: true,
            message: "Please enter quantity",
            trigger: ["blur", "change"],
          },
        ],
        productTag: [
          {
            required: true,
            message: "Please enter quantity",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  props: {
    disableCondition: Boolean,
    indexParam: Number,
    conditions: Array,
    conditionRule: Object,
    groups: Array,
  },
  computed: {
    conditionTypes() {
      return this.$store.state.condition.conditionTypes;
    },
    groupsParam() {
      return this.groups;
    },
  },
  filters: {
    nextOperatorFilter(value) {
      if (value == "1") {
        return " Or ";
      } else {
        return " And ";
      }
    },
    conditionFilter(group) {
      console.log("conditionFilter");
      console.log(group);
      let conditions = group.conditions;
      let result = "";
      if (conditions != undefined) {
        console.log("!= undefined");
        for (let i = 0; i < conditions.length; i++) {
          let condition = conditions[i];
          //  Product Condition
          if (condition.productConditionId != undefined || condition.generalType == "1") {
            let value = condition;
            let productResult = "";
            if (value.productConditionType == "0") {
              if (result == "") {
                productResult = "- Include ";
              } else {
                productResult = "include ";
              }
            } else {
              if (result == "") {
                productResult = "- Exclude ";
              } else {
                productResult = "exclude ";
              }
            }

            if (value.productConditionType == "0") {
              switch (value.quantityOperator) {
                case "1": {
                  productResult += "more than ";
                  break;
                }
                case "2": {
                  productResult += "more than or equal ";
                  break;
                }
                case "3": {
                  productResult += "less than ";
                  break;
                }
                case "4": {
                  productResult += "less than or equal ";
                  break;
                }
              }
            }
            if (value.productConditionType == "0") {
              productResult += value.productQuantity + " ";
            }
            productResult += value.productName;
            if (i < conditions.length - 1) {
              if (value.nextOperator == "1") {
                productResult += " or ";
              } else {
                productResult += " and ";
              }
            }

            result += productResult;
          }
          // Order condition
          if (condition.orderConditionId != undefined || condition.generalType == "2") {
            let value = condition;
            let orderResult = "order has ";
            if (result == "") {
              orderResult = "- Order has ";
            }
            switch (value.quantityOperator) {
              case "1": {
                orderResult += "more than ";
                break;
              }
              case "2": {
                orderResult += "more than or equal ";
                break;
              }
              case "3": {
                orderResult += "less than ";
                break;
              }
              case "4": {
                orderResult += "less than or equal ";
                break;
              }
              case "5": {
                orderResult += "equal ";
                break;
              }
            }
            orderResult += value.quantity + " item(s) and total ";
            switch (value.amountOperator) {
              case "1": {
                orderResult += "more than ";
                break;
              }
              case "2": {
                orderResult += "more than or equal ";
                break;
              }
              case "3": {
                orderResult += "less than ";
                break;
              }
              case "4": {
                orderResult += "less than or equal ";
                break;
              }
              case "5": {
                orderResult += "equal ";
                break;
              }
            }
            orderResult += value.amount.toLocaleString("vi-VN") + " VNĐ";
            if (i < conditions.length - 1) {
              if (value.nextOperator == "1") {
                orderResult += " or ";
              } else {
                orderResult += " and ";
              }
            }

            result += orderResult;
          }
          // Membership condition
          if (
            condition.membershipConditionId != undefined ||
            condition.generalType == "3"
          ) {
            let value = condition;
            let membershipResult = "membership level are:  ";
            if (result == "") {
              membershipResult = "- Membership level are:  ";
            }
            let list = "";
            let levels = value.membershipLevel.split("|");
            levels.forEach((level) => {
              if (list == "") {
                list += level;
              } else {
                list += ", " + level;
              }
            });
            membershipResult += list;
            if (i < conditions.length - 1) {
              if (value.nextOperator == "1") {
                membershipResult += " or ";
              } else {
                membershipResult += " and ";
              }
            }

            result += membershipResult;
          }
        }
      }

      return result;
    },
  },
  methods: {
    closeCollapse() {
      this.$refs["update-condition-collapse"].setActiveNames([]);
    },
    deleteGroup(gIndex) {
      this.$emit("deleteGroup", gIndex);
    },
    addCondition() {
      this.$emit("addConditionGroup");
    },

    // Xóa condition
    deleteCondition(condition, gIndex, index) {
      this.$emit("deleteCondition", condition, gIndex, index);
    },
    // Thay đổi thứ tự condition
    reorderCondition(currentIndex, groupIndex, isUp) {
      this.$emit("reorderCondition", currentIndex, groupIndex, isUp);
      this.$forceUpdate();
    },
    // Thay đổi vị trí group
    reorderGroup(groupIndex, isUp) {
      this.$emit("reorderGroup", groupIndex, isUp);
      this.$forceUpdate();
    },
    addConditionToGroup(generalType, gIndex) {
      this.$emit("addConditionToGroup", generalType, gIndex);
    },
  },
};
</script>

<style>
.el-collapse-item__wrap {
  border: 0px;
  border-top: 0px;
  margin: 0px;
  padding-left: 20px;
  padding-right: 20px;
}
.el-collapse-item__header {
  border: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 1.1rem;
  font-weight: bold;
  color: black;
}

.el-collapse-item__header:hover {
  color: black;
}
.card {
  border: 0px;
  padding: 0px;
}
.condition-form {
  margin-top: 5px;
  border: 0px solid rgb(180, 180, 180);
}
.el-collapse-item__header.is-active {
  border-bottom: 0px;
}
.condition-sub-label {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.1rem;
  font-weight: bold;
}
.el-form--label-top .el-form-item__label {
  padding-bottom: 0;
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
.operator-label {
  font-size: 1rem;
  color: black;
  margin-right: 10px;
}
.custom-condition-form {
  padding: 20px;
  margin-top: 15px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 9px 2px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 9px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 9px 2px rgba(0, 0, 0, 0.1);
}
.add-condition-button {
  width: 100%;
  border: 0px;
  background-color: rgb(248, 248, 248);
  margin: 10px 0px 10px 0px;
  color: rgb(97, 97, 97);
  font-size: 0.9rem;
}
.operator-section-custom {
  background-color: transparent;
  padding: 10px 0px 0px 15px;
}
.update-card-custom .el-card__body {
  padding: 0px;
}
</style>
