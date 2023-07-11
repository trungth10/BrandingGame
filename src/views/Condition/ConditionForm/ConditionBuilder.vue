<template>
  <div v-loading="loading">
    <el-form
      :id="'conditionBuilderForm_' + indexParam"
      :ref="'conditionBuilderForm_' + indexParam"
      :model="conditionRule"
      label-position="top"
    >
      <el-row>
        <div class="card p-3">
          <!-- START Name and Description -->
          <el-row type="flex" :gutter="10" justify="space-between">
            <!-- START Name-->
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
            <!-- END Name-->
            <!-- START Description-->
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
            <!-- END Description-->
          </el-row>
          <!-- END Name and Description -->
          <!-- START Condition type & Group & Button add -->
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
            <!-- END Button add -->
          </el-row>
        </div>
        <el-col class="mt-3" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-collapse>
            <div
              v-for="(group, gIndex) in groups"
              v-bind:data="groups"
              :key="gIndex"
              :name="gIndex"
              class="mb-3"
            >
              <!-- Function button cho group -->
              <el-row
                class="bg-white pt-2 pr-2"
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
              <el-collapse-item class="m-0 p-0" :title="'Group ' + group.groupNo">
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
                      <label class="operator-label">Combine with next condition</label>
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
                        'order-condition-form-' + indexParam + '-' + gIndex + '-' + index
                      "
                      :ref="'order-condition-' + indexParam + '-' + gIndex + '-' + index"
                    />
                    <span v-if="index != group.conditions.length - 1">
                      <label class="operator-label">Combine with next condition</label>
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
                        'membership-condition-' + indexParam + '-' + gIndex + '-' + index
                      "
                    />
                    <span v-if="index != group.conditions.length - 1">
                      <label class="operator-label">Combine with next condition</label>
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

          <div></div>
        </el-col>
        <!-- END Condition list -->
      </el-row>
    </el-form>
  </div>
</template>

<script>
import MembershipCondition from "./MembershipCondition.vue";
import OrderCondition from "./OrderCondition.vue";
import ProductCondition from "./ProductCondition.vue";

export default {
  components: { OrderCondition, ProductCondition, MembershipCondition },
  name: "condition-builder",
  props: {
    disableCondition: Boolean,
    formIndex: {
      type: Number,
      default: 0,
      required: false,
    },
    indexParam: Number,
  },
  created() {
    let user = this.$session.get("user-info");
    if (user != undefined) {
      let brandId = user.brandId;
      if (brandId != undefined) {
        this.$store.commit("condition/setBrandId", brandId);
      } else {
        this.$router.push("/login").catch(() => {});
      }
    } else {
      this.$router.push("/login").catch(() => {});
    }
  },
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
  computed: {
    conditionTypes() {
      return this.$store.state.condition.conditionTypes;
    },

    conditions() {
      return this.$store.state.condition.conditions;
    },
    conditionRule() {
      return this.$store.state.condition.conditionRule;
    },
    groups() {
      return this.$store.state.condition.conditionGroups;
    },
  },
  methods: {
    deleteGroup(gIndex) {
      this.groups.splice(gIndex, 1);
      if (this.groups.length > 0) {
        for (let i = 0; i < this.groups.length; i++) {
          this.groups[i].groupNo = i + 1;
        }
      }
      this.$forceUpdate();
    },
    showCondition() {
      this.hasCondition = this.conditions.length > 0;
    },
    addCondition() {
      let groupNo = this.groups.length + 1;
      let newGroup = {
        nextOperator: "1",
        groupNo: groupNo,
        conditions: [
          // Product condition => generalType = 1
          {
            generalType: this.$ENV.CONDITION_TYPE.PRODUCT_CONDITION,
            productConditionType: this.$ENV.PRODUCT_CONDITION_TYPE.INCLUDE,
            productType: this.$ENV.PRODUCT_TYPE.SINGLE_PRODUCT,
            productCode: "",
            productName: "",
            parentCode: "",
            productQuantity: 0,
            quantityOperator: "1",
            productTag: "",
            nextOperator: "1",
            indexGroup: 0,
          },
          // Order condition => generalType = 2
          {
            generalType: this.$ENV.CONDITION_TYPE.ORDER_CONDITION,
            quantityOperator: "1",
            quantity: 0,
            amountOperator: "1",
            amount: 0,
            nextOperator: "1",
            indexGroup: 1,
          },
          // Membership condition => generalType = 3
          {
            generalType: this.$ENV.CONDITION_TYPE.MEMBERSHIP_CONDITION,
            forNewMember: false,
            membershipLevel: "",
            nextOperator: "1",
            indexGroup: 2,
          },
        ],
      };
      this.$store.commit("condition/addConditionGroup", newGroup);
    },

    // Xóa condition
    deleteCondition(condition, gIndex, index) {
      let storeIndex = this.conditions.indexOf(condition);
      this.$store.commit("condition/deleteCondition", storeIndex);
      this.groups[gIndex].conditions.splice(index, 1);
      if (this.groups[gIndex].conditions.length == 0) {
        this.groups.splice(gIndex, 1);
      } else {
        for (let i = 0; i < this.groups[gIndex].conditions.length; i++) {
          let cond = this.groups[gIndex].conditions;
          cond[i].indexGroup = i;
        }
      }
    },
    // Thay đổi thứ tự condition
    reorderCondition(currentIndex, groupIndex, isUp) {
      let conditions = this.groups[groupIndex].conditions;
      let currentCondition = conditions[currentIndex];
      let lastIndex = conditions.length - 1;
      if (isUp == true) {
        if (currentIndex != 0) {
          let aboveCondition = conditions[currentIndex - 1];
          let temp = aboveCondition;
          conditions[currentIndex - 1] = currentCondition;
          conditions[currentIndex - 1].indexGroup = currentIndex - 1;
          conditions[currentIndex] = temp;
          conditions[currentIndex].indexGroup = currentIndex;
          this.$forceUpdate();
        }
      } else {
        if (currentIndex != lastIndex) {
          let belowCondition = conditions[currentIndex + 1];
          let temp = belowCondition;
          conditions[currentIndex + 1] = currentCondition;
          conditions[currentIndex + 1].indexGroup = currentIndex + 1;
          conditions[currentIndex] = temp;
          conditions[currentIndex].indexGroup = currentIndex;
          this.$forceUpdate();
        }
      }
    },
    // Thay đổi vị trí group
    reorderGroup(groupIndex, isUp) {
      let groups = this.groups;
      let currentGroup = groups[groupIndex];
      if (isUp) {
        if (groupIndex != 0) {
          let aboveGroup = groups[groupIndex - 1];
          let temp = aboveGroup;
          groups[groupIndex - 1] = currentGroup;
          groups[groupIndex - 1].groupNo = groupIndex - 1;
          groups[groupIndex] = temp;
          groups[groupIndex].groupNo = groupIndex;
          this.$forceUpdate();
        }
      } else {
        let lastIndex = groups.length - 1;
        if (groupIndex != lastIndex) {
          let aboveGroup = groups[groupIndex + 1];
          let temp = aboveGroup;
          groups[groupIndex + 1] = currentGroup;
          groups[groupIndex + 1].groupNo = groupIndex + 1;
          groups[groupIndex] = temp;
          groups[groupIndex].groupNo = groupIndex;
          this.$forceUpdate();
        }
      }
    },
    addConditionToGroup(generalType, gIndex) {
      let conditions = this.groups[gIndex].conditions;
      switch (generalType) {
        case 1: {
          let productCondition = {
            generalType: this.$ENV.CONDITION_TYPE.PRODUCT_CONDITION,
            productConditionType: this.$ENV.PRODUCT_CONDITION_TYPE.INCLUDE,
            parentCode: "",
            productType: this.$ENV.PRODUCT_TYPE.SINGLE_PRODUCT,
            productCode: "",
            productName: "",
            productQuantity: 0,
            quantityOperator: "1",
            productTag: "",
            nextOperator: "1",
            indexGroup: conditions.length,
          };
          conditions.push(productCondition);
          break;
        }
        case 2: {
          let orderCondition = {
            generalType: this.$ENV.CONDITION_TYPE.ORDER_CONDITION,
            quantityOperator: "1",
            quantity: 0,
            amountOperator: "1",
            amount: 0,
            nextOperator: "1",
            indexGroup: conditions.length,
          };
          conditions.push(orderCondition);
          break;
        }
        case 3: {
          let membershipCondition = {
            generalType: this.$ENV.CONDITION_TYPE.MEMBERSHIP_CONDITION,
            forNewMember: false,
            membershipLevel: "",
            nextOperator: "1",
            indexGroup: conditions.length,
          };
          conditions.push(membershipCondition);
          break;
        }
      }
    },

    // checkValidForms() {
    //   this.isValid = true;
    //   // Check validate rule name
    //   this.$refs["conditionBuilderForm"].validate((valid) => {
    //     if (!valid) {
    //       this.isValid = false;
    //     }
    //   });
    //   // Check validate của form con
    //   if (this.isValid) {
    //     for (let group of this.groups) {
    //       for (let index = 0; index < group.conditions.length; index++) {
    //         console.log("condition-" + group.groupNo);
    //         this.$refs["condition-" + group.groupNo][index].checkValidForm();
    //         let formValid = this.$refs["condition-" + group.groupNo][index].formValid;
    //         if (!formValid) {
    //           this.isValid = false;
    //         }
    //       }
    //     }
    //   }
    // },
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
/* .el-collapse-item__header {
  border: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 1.1rem;
  font-weight: bold;
  color: black;
} */

/* .el-collapse-item__header:hover {
  color: black;
} */
.card {
  border: 0px;
  padding: 0px;
}
.condition-form {
  margin-top: 5px;
  border: 0px solid rgb(180, 180, 180);
}
/* .el-collapse-item__header.is-active {
  border-bottom: 0px;
} */
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
</style>
