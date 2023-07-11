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
        <label class="condition-sub-label">Product Condition</label>
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
    <el-row class="mt-3">
      <el-col :span="24">
        <el-radio-group v-model="condition.productConditionType">
          <el-radio label="0">Include this product</el-radio>
          <el-radio label="1">Exclude this product</el-radio>
        </el-radio-group>
      </el-col>
      <!-- Product type -->
      <el-col :span="24" class="mt-3">
        <el-select
          placeholder="Select type"
          v-model="condition.productType"
          :default-first-option="true"
        >
          <el-option
            v-for="type in productTypes"
            :key="type.id"
            :label="type.type"
            :value="type.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt-3">
      <el-col :span="12" v-if="condition.productType != 1 && condition.productType != 4">
        <el-form-item
          prop="parentCode"
          :label="productTypes[condition.productType - 1].type + ' code'"
        >
          <el-input
            type="text"
            v-model="condition.parentCode"
            maxlength="20"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="condition.productType == 4">
        <el-form-item prop="parentCode" :label="'Tags'">
          <el-input
            type="text"
            v-model="condition.parentCode"
            maxlength="50"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- Product name -->
    <el-row type="flex" :gutter="10" justify="start" style="align-items: center">
      <!-- Product code -->
      <el-col :span="12">
        <el-form-item prop="productCode" label="Target product code">
          <el-input
            type="text"
            v-model="condition.productCode"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="productName" label="Product name">
          <el-input
            type="text"
            maxlength="100"
            show-word-limit
            v-model="condition.productName"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="10" justify="start" style="align-items: center">
      <el-col :span="12">
        <el-form-item prop="productQuantity" label="Quantity of product">
          <el-input-number
            type="number"
            :max="max10digits"
            :min="minZero"
            v-model="condition.productQuantity"
          >
          </el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="padding-top: 20px">
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
  </el-form>
</template>
<script>
export default {
  name: "product-condition",
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
        parentCode: [
          {
            required: true,
            message: "Please enter tag",
            trigger: ["blur", "change"],
          },
        ],
        productQuantity: [
          {
            required: true,
            message: "Please enter tag",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    productTypes() {
      return this.$store.state.condition.productTypes;
    },
    condition() {
      console.log("condition");
      console.log(this.conditionParam);
      return this.conditionParam;
    },
    operators() {
      return this.$store.state.condition.orperators;
    },
  },
  methods: {
    deleteCondition() {
      this.$emit("delete-condition", this.condition, this.gIndexParam, this.indexParam);
    },
    reorderCondition(isUp) {
      this.$emit("reorder-condition", this.indexParam, this.gIndexParam, isUp);
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
