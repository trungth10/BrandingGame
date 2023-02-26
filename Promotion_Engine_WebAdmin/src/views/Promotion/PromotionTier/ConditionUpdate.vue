<template>
  <div>
    <el-card shadow="never" class="custom-card-2">
      <el-row class="bg-transparent">
        <el-col :span="24" class="action-builder-title-2">CONDITION RULE</el-col>
      </el-row>
      <el-row>
        <update-condition
          ref="update-condition"
          :conditions="conditions"
          :conditionRule="conditionRule"
          :groups="groups"
          :disableCondition="disableCondition"
          v-on:addConditionGroup="addConditionGroup"
          v-on:deleteCondition="deleteCondition"
          v-on:addConditionToGroup="addConditionToGroup"
          v-on:reorderGroup="reorderGroup"
          v-on:reorderCondition="reorderCondition"
          v-on:deleteGroup="deleteGroup"
        />
      </el-row>
      <el-row class="mt-3">
        <el-col :span="24">
          <div class="float-right">
            <el-button type="text" @click="closeDialog" style="color: black" size="small"
              >Cancel</el-button
            >
            <el-button type="success" @click="updateCondition" size="small"
              >Update</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import UpdateCondition from "../../Condition/ConditionForm/UpdateCondition";
export default {
  name: "condition-update",
  components: {
    "update-condition": UpdateCondition,
  },

  props: {
    promotionId: String,
    promotionTierParam: Object,
  },
  data() {
    return {
      conditionOption: 1,
      viewListOption: true,
      // Condition
      conditionRule: {
        conditionRuleId: "",
        brandId: "",
        ruleName: "",
        description: "",
      },
      conditions: [],
      conditionGroups: [],
      disableCondition: false,
    };
  },
  computed: {
    promotionTier() {
      return this.promotionTierParam;
    },
    groups() {
      return this.conditionGroups;
    },
  },
  mounted() {
    this.loadData();
  },
  watch: {
    promotionTier() {
      this.loadData();
    },
  },
  methods: {
    updateCondition() {
      this.$emit("updateConditionFunc");
    },
    closeDialog() {
      this.$refs["update-condition"].closeCollapse();
      this.$emit("handleCloseUpdCond");
    },
    deleteGroup(gIndex) {
      this.conditionGroups.splice(gIndex, 1);
      if (this.conditionGroups.length > 0) {
        for (let i = 0; i < this.conditionGroups.length; i++) {
          this.conditionGroups[i].groupNo = i + 1;
        }
      }
      this.$forceUpdate();
    },
    reorderCondition(currentIndex, groupIndex, isUp) {
      let conditions = this.conditionGroups[groupIndex].conditions;
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
        }
      } else {
        if (currentIndex != lastIndex) {
          let belowCondition = conditions[currentIndex + 1];
          let temp = belowCondition;
          conditions[currentIndex + 1] = currentCondition;
          conditions[currentIndex + 1].indexGroup = currentIndex + 1;
          conditions[currentIndex] = temp;
          conditions[currentIndex].indexGroup = currentIndex;
        }
      }
      this.$forceUpdate();
    },
    // Thay đổi vị trí group
    reorderGroup(groupIndex, isUp) {
      let groups = this.conditionGroups;
      let currentGroup = groups[groupIndex];
      if (isUp) {
        if (groupIndex != 0) {
          let aboveGroup = groups[groupIndex - 1];
          let temp = aboveGroup;
          groups[groupIndex - 1] = currentGroup;
          groups[groupIndex - 1].groupNo = groupIndex;
          groups[groupIndex] = temp;
          groups[groupIndex].groupNo = groupIndex + 1;
        }
      } else {
        let lastIndex = groups.length - 1;
        if (groupIndex != lastIndex) {
          let aboveGroup = groups[groupIndex + 1];
          let temp = aboveGroup;
          groups[groupIndex + 1] = currentGroup;
          groups[groupIndex + 1].groupNo = groupIndex + 2;
          groups[groupIndex] = temp;
          groups[groupIndex].groupNo = groupIndex + 1;
        }
      }
      this.$forceUpdate();
    },
    addConditionToGroup(generalType, gIndex) {
      let conditions = this.conditionGroups[gIndex].conditions;
      switch (generalType) {
        case 1: {
          let productCondition = {
            generalType: this.$ENV.CONDITION_TYPE.PRODUCT_CONDITION,
            productConditionType: this.$ENV.PRODUCT_CONDITION_TYPE
              .INCLUDE,
            productType: this.$ENV.PRODUCT_TYPE.SINGLE_PRODUCT,
            productCode: "",
            productName: "",
            parentCode: "",
            productQuantity: 0,
            quantityOperator: "1",
            productTag: "",
            nextOperator: "1",
            indexGroup: conditions.length,
          };
          conditions.push(productCondition);
          console.log(conditions);
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
    addConditionGroup() {
      let groupNo = this.conditionGroups.length + 1;
      let newGroup = {
        nextOperator: "1",
        groupNo: groupNo,
        conditions: [
          // Product condition => generalType = 1
          {
            generalType: this.$ENV.CONDITION_TYPE.PRODUCT_CONDITION,
            productConditionType: this.$ENV.PRODUCT_CONDITION_TYPE
              .INCLUDE,
            productType: this.$ENV.PRODUCT_TYPE.SINGLE_PRODUCT,
            parentCode: "",
            productCode: "",
            productName: "",
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
      this.conditionGroups.push(newGroup);
    },
    deleteCondition(condition, gIndex, index) {
      let storeIndex = this.conditions.indexOf(condition);
      this.conditions.splice(storeIndex, 1);
      this.conditionGroups[gIndex].conditions.splice(index, 1);
      if (this.conditionGroups[gIndex].conditions.length == 0) {
        this.conditionGroups.splice(gIndex, 1);
      } else {
        for (let i = 0; i < this.conditionGroups[gIndex].conditions.length; i++) {
          let cond = this.conditionGroups[gIndex].conditions;
          cond[i].indexGroup = i;
        }
      }
    },
    loadData() {
      let condition = this.promotionTierParam.conditionRule;
      if (condition != undefined) {
        this.conditionRule = {
          conditionRuleId: condition.conditionRuleId,
          brandId: condition.brandId,
          ruleName: condition.ruleName,
          description: condition.description,
        };
        let conditionGroups = condition.conditionGroups;
        this.conditionGroups = [];
        if (conditionGroups != undefined) {
          for (let group of conditionGroups) {
            let conditionGroup = {
              groupNo: group.groupNo,
              nextOperator: group.nextOperator,
              conditionGroupId: group.conditionGroupId,
              conditions: group.conditions,
            };
            this.conditionGroups.push(conditionGroup);
          }
        }
      }
    },
  },
  filters: {},
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
