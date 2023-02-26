<template>
  <div>
    <el-row v-if="discountType == 1">
      <div class="card">
        <div class="card-header bg-transparent">
          <el-col :span="24"><h2 class="custom-label-action">Action for cart</h2></el-col>

          <el-row type="flex" :gutter="10" justify="space-between" class="mt-3">
            <el-col :span="12">
              <el-form-item prop="orderAction.value" label="Discount value (VNĐ)">
                <el-input-number
                  type="number"
                  :min="0"
                  :max="999999999"
                  v-model="orderAction.value"
                >
                </el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                :prop="'orderAction.minValue'"
                label="Minimum total of cart after discount (VNĐ)"
              >
                <el-input-number
                  type="number"
                  :min="0"
                  :max="999999999"
                  v-model="orderAction.minValueAfterDiscount"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row v-if="discountType == '2'">
      <div class="card">
        <div class="card-header bg-transparent custom-action-card">
          <el-row>
            <el-col :span="24"
              ><h2 class="custom-label-action">Action for cart</h2></el-col
            >

            <el-row type="flex" :gutter="10" justify="space-between" class="mt-3">
              <el-col :span="12">
                <el-form-item :prop="'orderAction.value'" label="Discount value (%)">
                  <el-input-number :min="0" :max="999999999" v-model="orderAction.value">
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="orderAction.amountLimit"
                  label="Maximum discount amount"
                >
                  <el-input-number
                    :min="0"
                    :max="999999999"
                    v-model="orderAction.amountLimit"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row v-if="discountType == '4'">
      <el-row>
        <div class="card">
          <div class="card-header bg-transparent pb-4">
            <el-col :span="24"
              ><h2 class="custom-label-action">Action for cart</h2></el-col
            >
            <el-row>
              <el-form-item prop="orderAction.type">
                <el-col :span="24">
                  <el-radio v-model="orderAction.type" label="1" @change="changeOption"
                    >Discount amount (VNĐ)</el-radio
                  >
                </el-col>
                <el-col :span="24">
                  <el-radio v-model="orderAction.type" label="2" @change="changeOption"
                    >Discount percentage (%)</el-radio
                  ></el-col
                >
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="orderAction.valueAmount" label="Value (VND)">
                  <el-input-number
                    :min="0"
                    :max="999999999"
                    :disabled="orderAction.type == '2'"
                    v-model="orderAction.valueAmount"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="10" justify="space-between">
              <el-col :span="12">
                <el-form-item prop="orderAction.valuePercent" label="Value (%)">
                  <el-input-number
                    :min="0"
                    :max="100"
                    :disabled="orderAction.type == '1'"
                    v-model="orderAction.valuePercent"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :prop="'orderAction.amountLimit'"
                  label="Amount Limit (VND)"
                >
                  <el-input-number
                    :min="0"
                    :max="999999999"
                    :disabled="orderAction.type == '1'"
                    v-model="orderAction.amountLimit"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </div></div
      ></el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    var validateValue = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("Please input larger than 0"));
      } else callback();
    };
    return {
      rules: {
        requiredField: {
          required: true,
          message: "This field is required",
          trigger: ["blur", "change"],
        },
        valueRule: [
          {
            required: true,
            message: "This field is required",
            trigger: ["blur", "change"],
          },
          {
            validator: validateValue,
          },
        ],
      },
    };
  },
  props: {
    actionForm: Object,
    discountType: String,
  },
  computed: {
    orderAction() {
      return this.actionForm.orderAction;
    },
  },

  name: "order-action",
  methods: {
    changeOption() {
      this.orderAction.valueAmount = 0;
      this.orderAction.valuePercent = 0;
      this.orderAction.amountLimit = 0;
    },
    addAction(actionName) {
      this.$emit("add-action", actionName);
    },
    removeAction(actionName, item) {
      this.$emit("delete-action", actionName, item);
    },
  },
};
</script>

<style></style>
