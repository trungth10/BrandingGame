<template>
  <el-form
    class="custom-condition-form"
    :id="refParam"
    :ref="refParam"
    :rules="rules"
    :model="condition"
    label-position="top"
  >
    <el-row type="flex" justify="space-between">
      <el-col :span="8">
        <label class="condition-sub-label">Order Condition</label>
      </el-col>
      <el-col class="text-right" :span="8">
        <el-button
          icon="el-icon-top"
          @click="reorderCondition(true)"
          plain
          size="mini"
          round
        >
        </el-button>
        <el-button
          icon="el-icon-bottom"
          @click="reorderCondition(false)"
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
          @click="deleteCondition"
        ></el-button>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="10" justify="start" style="align-items: center">
      <!-- Quantity -->
      <el-col :span="12">
        <el-row>
          <el-form-item prop="quantity" label="Quantity of items in cart">
            <el-input-number
              type="number"
              :max="max10digits"
              :min="minZero"
              v-model="condition.quantity"
            >
            </el-input-number>
          </el-form-item>
        </el-row>
      </el-col>
      <!-- Quantity operator -->
      <el-col :span="6" style="padding-top: 21px">
        <el-select
          placeholder="Select type"
          v-model="condition.quantityOperator"
          :default-first-option="true"
        >
          <el-option
            v-for="operator in operators"
            :key="operator.id"
            :label="operator.name"
            :value="operator.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="10" justify="start" style="align-items: center">
      <!-- Amount -->
      <el-col :span="12">
        <el-row>
          <el-form-item prop="amount" label="Total amount of cart">
            <el-input-number
              type="number"
              :max="max10digits"
              :min="minZero"
              v-model="condition.amount"
            >
            </el-input-number>
          </el-form-item>
        </el-row>
      </el-col>
      <!-- Quantity operator -->
      <el-col :span="6" style="padding-top: 21px">
        <el-select
          placeholder="Select type"
          v-model="condition.amountOperator"
          :default-first-option="true"
        >
          <el-option
            v-for="operator in operators"
            :key="operator.id"
            :label="operator.name"
            :value="operator.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: "order-condition",
  props: {
    conditionParam: Object,
    gIndexParam: Number,
    indexParam: Number,
    refParam: String,
  },

  data() {
    return {
      max10digits: 9999999999,
      minZero: 0,
      max2digits: 99,
      formValid: true,
      rules: {
        quantity: [
          {
            required: true,
            message: "Please enter quantity",
            trigger: ["blur", "change"],
          },
        ],
        amount: [
          {
            required: true,
            message: "Please enter amount",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    operators() {
      return this.$store.state.condition.orperators;
    },
    condition() {
      return this.conditionParam;
    },
  },
  methods: {
    reorderCondition(isUp) {
      this.$emit("reorder-condition", this.indexParam, this.gIndexParam, isUp);
    },
    deleteCondition() {
      this.$emit("delete-condition", this.condition, this.gIndexParam, this.indexParam);
    },
    checkValidForm() {
      this.$refs[this.refParam].validate((valid) => {
        this.formValid = valid;
      });
    },
  },
};
</script>
<style></style>
