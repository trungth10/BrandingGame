<template>
  <div>
    <el-row v-if="discountType == '8'">
      <div class="card">
        <div class="card-header bg-transparent">
          <el-col :span="24"><h2 class="custom-label-action">Gift product</h2></el-col>
          <el-row type="flex" :gutter="10" justify="space-between" class="mt-3">
            <el-col :span="12">
              <el-form-item
                :prop="'giftAction.giftProductCode'"
                label="Gift product code"
              >
                <el-input
                  type="text"
                  maxlength="50"
                  show-word-limit
                  v-model="giftAction.giftProductCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'giftAction.giftName'" label="Gift name">
                <el-input
                  type="text"
                  show-word-limit
                  maxlength="50"
                  v-model="giftAction.giftName"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="10" justify="space-between">
            <el-col :span="12">
              <el-form-item :prop="'giftAction.quantity'" label="Quantity">
                <el-input-number
                  type="number"
                  :min="0"
                  :max="99999"
                  v-model="giftAction.quantity"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row v-if="discountType == '9'">
      <div class="card">
        <div class="card-header bg-transparent">
          <el-col :span="24"><h2 class="custom-label-action">Gift voucher</h2></el-col>
          <el-row type="flex" :gutter="10" justify="space-between" class="mt-3">
            <el-col :span="12">
              <el-form-item
                :prop="'giftAction.giftVoucherCode'"
                label="Gift voucher code"
              >
                <el-input
                  maxlength="100"
                  show-word-limit
                  type="text"
                  v-model="giftAction.giftVoucherCode"
                  :disabled="voucherGiftOption"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
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
      voucherGiftOption: false,
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
    giftAction() {
      return this.actionForm.giftAction;
    },
  },

  name: "gift-action",
  methods: {
    addAction(actionName) {
      this.$emit("add-action", actionName);
    },
    removeAction(actionName, item) {
      this.$emit("delete-action", actionName, item);
    },
    changeOption(val) {
      this.giftAction.giftVoucherCode = "";
      this.voucherGiftOption = val;
    },
  },
};
</script>

<style></style>
