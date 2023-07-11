<template>
  <div v-loading="loading" id="voucherBuilder">
    <!-- //# Voucher Buider & Get help -->
    <el-row id="voucher">
      <div class="bg-transparent">
        <el-row type="flex" justify="space-between">
          <el-col :span="21">
            <h1 class="voucher-builder">
              <b-icon scale="0.9" icon="tag-fill" />
              VOUCHER GROUP BUILDER
            </h1>
          </el-col>
          <el-col :span="3">
            <a href="#" class="float-right">
              <i class="el-icon-question" /> <span>Get Help</span>
            </a>
          </el-col>
        </el-row>
      </div>
    </el-row>
    <el-col class="mt-2 mb-3" :span="24">
      <label class="custom-tag-content">
        <i class="el-icon-warning-outline mr-2"></i>{{ $ENV.TEXT_EXPLAIN.Voucher }}</label
      >
    </el-col>
    <el-form
      :model="voucherForm"
      id="voucherType"
      ref="voucherForm"
      :label-position="labelPosition"
      :rules="rules"
    >
      <!-- //# Create voucher form -->
      <el-collapse-transition>
        <div>
          <div class="mt-3 pt-3 pb-2">
            <div class="bg-transparent">
              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="card p-2" style="margin: 0px; min-height: 270px">
                    <!-- //# Input - Group name -->
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item prop="groupName">
                          <template slot="label">
                            <label for="">
                              <h4 class="font-weight-normal align-bottom mb-0">
                                <!-- <b-icon font-scale="1.5" icon="card-text" class="pb-1" /> -->
                                Group Name
                              </h4>
                            </label>
                          </template>

                          <el-input :maxlength="100" v-model="voucherForm.groupName" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <!-- //# Input - Code length -->
                    <!-- <el-row v-show="voucherForm.voucherType == 1"> -->
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item prop="codeLength">
                          <template slot="label">
                            <label>
                              <h4 class="font-weight-normal align-bottom mb-0">
                                <!-- <b-icon font-scale="1.5" icon="card-text" class="pb-1" /> -->
                                Length
                              </h4>
                            </label>
                          </template>
                          <el-col class="pl-0 pr-0">
                            <el-input-number
                              @change="handleChangeCodeLength"
                              :max="30"
                              :min="1"
                              type="number"
                              v-model="voucherForm.codeLength"
                            />
                          </el-col>
                        </el-form-item>
                      </el-col>

                      <!-- //# Input - Quantity -->
                      <el-col :span="12">
                        <el-form-item prop="quantity" class="mb-0">
                          <template slot="label">
                            <label>
                              <h4 class="font-weight-normal align-bottom mb-0">
                                <!-- <b-icon font-scale="1.5" icon="card-text" class="pb-1" /> -->
                                Quantity
                              </h4>
                            </label>
                          </template>
                          <el-col class="pl-0 pr-0">
                            <el-input-number
                              :disabled="voucherForm.voucherType == 2"
                              :min="1"
                              :max="maximumRandomCode"
                              type="number"
                              v-model="voucherForm.quantity"
                            />
                            <el-row class="maximum-code">
                              <div v-show="voucherForm.voucherType != '2'">
                                <el-col>
                                  <b> Maximum quantity of voucher: </b>
                                  {{ maximumRandomCode }}
                                </el-col>
                              </div>
                            </el-row>
                            <!-- //# Press - Check box Unlimited -->
                          </el-col>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="card p-2" style="min-height: 270px">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <label>Action type</label>
                        <el-radio-group v-model="isAction" @change="changeSelectAction">
                          <el-radio-button :label="true">Discount Action</el-radio-button>
                          <el-radio-button :label="false">Gift Action</el-radio-button>
                        </el-radio-group>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="actionId" label="Discount action">
                          <el-select :disabled="!isAction" v-model="voucherForm.actionId">
                            <el-option
                              v-for="(action, index) in actions"
                              :key="index"
                              :label="action.name"
                              :value="action.actionId"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item prop="giftId" label="Gift action">
                          <el-select :disabled="isAction" v-model="voucherForm.giftId">
                            <el-option
                              v-for="(gift, index) in gifts"
                              :key="index"
                              :label="gift.name"
                              :value="gift.giftId"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-checkbox
                  :disabled="typeBlock"
                  v-model="isAdvanced"
                  @change="changeAdvance"
                  class="h4"
                >
                  <!-- <i class="fa fa-cog"></i> -->
                  Advanced settings
                </el-checkbox>
              </el-row>
            </div>
          </div>
        </div>
      </el-collapse-transition>

      <!-- //# Form Advanced code settings -->
      <el-collapse-transition>
        <div v-show="isAdvanced">
          <div class="card mt-3">
            <div class="card-header bg-transparent">
              <el-row
                ><h2>Advanced settings</h2>
                <el-col class="mt-2 mb-2" :span="24">
                  <label class="custom-tag-content">
                    <i class="el-icon-warning-outline mr-2"></i
                    >{{ $ENV.TEXT_EXPLAIN.Voucher }}</label
                  >
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20" justify="space-between">
                <el-col :span="12">
                  <el-form-item label="Charset">
                    <el-select
                      @input="handleChangeCharset"
                      @blur="handleChangeCharset"
                      v-model="voucherForm.charset"
                      placeholder="Alphannumetic"
                    >
                      <el-option
                        v-for="item in charsetMapping"
                        :key="item.type"
                        :label="item.type"
                        :value="item.type"
                      >
                      </el-option>
                    </el-select> </el-form-item
                ></el-col>
                <el-col :span="12">
                  <!-- <label v-if="voucherForm.charset != 'Custom'">{{ sample }}</label> -->
                  <!-- v-if="voucherForm.charset == 'Custom'" -->
                  <el-form-item label="Sample" prop="sample">
                    <el-input
                      class="text-dark"
                      @change="handleCustomcharset"
                      :disabled="voucherForm.charset != 'Custom'"
                      v-model="sample"
                      :maxlength="62"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20" justify="space-between">
                <el-col :span="12">
                  <el-form-item label="Prefix" prop="prefix">
                    <el-input
                      v-model="voucherForm.prefix"
                      maxlength="10"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Postfix" prop="postfix">
                    <el-input
                      v-model="voucherForm.postfix"
                      maxlength="10"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </el-form>
  </div>
</template>

<script>
export default {
  watch: {
    sample() {
      this.handleChangeCharset("Custom");
      console.log(this.sample);
      this.voucherForm.customCharset = this.sample;
    },
  },
  props: {
    promotionId: String,
  },
  data() {
    var validatorQuantity = (rule, value, callback) => {
      if (!this.voucherForm.isUnLimit) {
        if (!value) {
          callback(new Error("Please input your quantity"));
        } else if (value <= 0) {
          callback(new Error("Please input a positive number more than zero!"));
        } else if (value > this.maximumRandomCode) {
          callback(new Error("Please input a number smaller than the maximum quantity"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validatorCustomCode = (rule, value, callback) => {
      if (this.voucherForm.voucherType == "2") {
        if (!value) {
          callback(new Error("Please input your custom code"));
        } else callback();
      } else {
        callback();
      }
    };
    var validatorCodeLength = (rule, value, callback) => {
      if (!this.voucherForm.isUnLimit) {
        if (!value) {
          callback(new Error("Please input your code length"));
        } else if (value <= 0) {
          callback(new Error("Please input a positive number more than zero!"));
        } else if (value > 30) {
          callback(new Error("Code length can be maximum 30 chars"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validatorActionId = (rule, value, callback) => {
      if (this.isAction) {
        if (this.voucherForm.actionId == "") {
          callback(new Error("Please select action"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validatorGiftId = (rule, value, callback) => {
      if (!this.isAction) {
        if (this.voucherForm.giftId == "") {
          callback(new Error("Please select gift"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validatorSample = (rule, value, callback) => {
      if (this.voucherForm.customCharset == "") {
        callback(new Error("Please input charset"));
      }
      for (var i = 0; i < this.charset; i++) {
        if (
          this.charset.indexOf(this.charset[i]) !==
          this.charset.lastIndexOf(this.charset[i])
        ) {
          callback(new Error("Characters in charset must be not the same"));
        }
      }
      callback();
    };

    return {
      isAction: true,
      loading: false,
      labelPosition: "top",
      isAdvanced: false,
      isCreateVoucher: "1",
      loadingVoucherGroup: false,
      charsetType: "",
      sample: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      voucherGroup: "",
      maxQuantity: 10000,
      maximumRandomCode: 62,
      voucherForm: {
        voucherType: 1,
        charset: "Alphanumeric",
        prefix: "",
        postfix: "",
        groupName: "",
        customCharset: this.sample,
        customCode: "",
        quantity: 1,
        isUnLimit: false,
        codeLength: 1,
        actionId: "",
        giftId: "",
      },
      rules: {
        sample: [
          {
            validator: validatorSample,

            trigger: ["blur", "change"],
          },
        ],
        actionId: [
          {
            validator: validatorActionId,
            message: "Please select discount action",
            trigger: ["blur", "change"],
          },
        ],
        giftId: [
          {
            validator: validatorGiftId,
            message: "Please select gift action",
            trigger: ["blur", "change"],
          },
        ],
        customCode: [{ validator: validatorCustomCode, trigger: ["blur", "change"] }],
        groupName: [
          {
            required: true,
            message: "Please enter Voucher Group Name",
            trigger: ["blur", "change"],
          },
        ],
        quantity: [
          {
            required: true,
            validator: validatorQuantity,
            trigger: ["change", "blur"],
          },
        ],
        prefix: [
          {
            max: 10,
            trigger: ["change", "blur"],
          },
        ],
        postfix: [
          {
            max: 10,
            trigger: ["change", "blur"],
          },
        ],
        codeLength: [
          {
            required: true,
            validator: validatorCodeLength,
            trigger: ["change", "blur"],
          },
        ],
      },
      voucherList: [],
      charsetMapping: [
        {
          type: "Alphanumeric",
          sample: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        },
        {
          type: "Alphabetic",
          sample: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        },
        {
          type: "Alphabetic Lowercase",
          sample: "abcdefghijklmnopqrstuvwxyz",
        },
        {
          type: "Alphabetic Uppercase",
          sample: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        },
        {
          type: "Numbers",
          sample: "0123456789",
        },
        {
          type: "Custom",
          sample: "",
        },
      ],
    };
  },
  created() {},
  computed: {
    quantityBlock() {
      return this.maximumRandomCode == 0;
    },
    actions() {
      return this.$store.state.action.actionList;
    },
    gifts() {
      return this.$store.state.gift.giftList;
    },
    conditions() {
      return this.$store.state.condition.conditionForVoucher;
    },
    typeBlock() {
      return this.voucherForm.voucherType == "2";
    },
  },
  methods: {
    handleCustomcharset(value) {
      if (value == "") {
        this.maximumRandomCode = 0;
      } else {
        this.charsetMapping.find((el) => el.type == "Custom").sample = value;
        this.countQuantity("Custom");
      }
    },
    changeSelectAction() {
      this.$refs["voucherForm"].clearValidate(["giftId", "actionId"]);
      this.voucherForm.actionId = "";
      this.voucherForm.giftId = "";
    },
    changeAdvance() {
      this.voucherForm.charset = "Alphanumeric";
      this.handleChangeCharset("Alphanumeric");
    },
    handleChangeCharset(val) {
      if (val) {
        this.charsetMapping.forEach((e) => {
          if (e.type == val && e.type != "Custom") {
            this.voucherForm.charset = e.type;
            this.sample = e.sample;
          } else if (e.type == "Custom") {
            e.sample = this.sample;
          }
        });
        this.countQuantity(this.voucherForm.charset);
      }
    },
    handleChangeCodeLength(val) {
      console.log("handleChangeCodeLength");
      if (val <= 30) {
        console.log(this.voucherForm.charset);
        this.countQuantity(this.voucherForm.charset);
      }
    },
    factorial(num) {
      var factorial = 1;
      if (num) {
        for (var i = 1; i <= num; i++) {
          factorial = factorial * i;
        }
      }
      return factorial;
    },
    countQuantity(charset) {
      this.charsetMapping.forEach((e) => {
        if (e.type == charset) {
          let charLength = e.sample.length;
          this.maximumRandomCode = Math.pow(charLength, this.voucherForm.codeLength);
          console.log("maximumRandomCode ", this.maximumRandomCode);
          this.voucherForm.customCharset = this.sample;
          console.log("this.voucherForm.customCharset ", this.voucherForm.customCharset);
          this.maximumRandomCode =
            this.maximumRandomCode > this.maxQuantity
              ? this.maxQuantity
              : this.maximumRandomCode;
        }
      });
    },
    handleVoucherType(val) {
      this.$store.commit("voucher/setVoucherType", val);
      this.voucherForm.quantity = 1;
      this.isAdvanced = false;
    },
    handleChangeUnlimit() {
      this.voucherForm.isUnLimit = !this.voucherForm.isUnLimit;
      this.voucherForm.quantity = 1;
    },

    async saveVoucher(formName) {
      if (this.quantityBlock) {
        this.$notify({
          icon: "el-icon-circle-check",
          title: "Error",
          message: "Invalid quantity",
          type: "danger",
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
        console.log("valid", valid);
        if (valid) {
          this.loading = true;
          let promotionId = this.promotionId;
          this.$store.commit("voucher/setVoucherForm", this.voucherForm);
          if (promotionId !== undefined && promotionId !== "") {
            this.$store.commit("voucher/setPromotionId", promotionId);
          }
          return this.$store
            .dispatch("voucher/saveVoucherGroup")
            .then((response) => {
              if (response.status == 200) {
                this.$notify({
                  icon: "el-icon-circle-check",
                  title: "Success",
                  message: "Creating vouchers, please wait",
                  type: "success",
                });
                this.$store.commit("voucher/setPageIndex", 1);
                this.$store.commit("voucher/setSearchContent", "");
                this.$router.push("/voucher");
              } else {
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Error",
                  message: response.data.message,
                  type: "danger",
                });
              }
              this.loading = false;
              return response;
            })
            .catch((err) => {
              this.loading = false;
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: err.message,
                type: "danger",
              });
              throw err;
            });
        } else {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Please input required fields",
            type: "danger",
          });

          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.custom-tag-content {
  word-break: break-word;
  font-size: 17px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-size: 16px;
  background-color: #faecd8;
  color: #e6a23c;
  width: 70vw;
  padding: 10px;
  border-radius: 7px;
}
.vertical-split {
  border-left: 0.3vw solid #2dce89;
  min-height: 20vh;
  padding-left: 10px;
  margin: 0px;
}
</style>
<style>
#voucherBuilder .bulk-code {
  font-size: 1.5vw;
}
#voucherBuilder .description {
  display: block;
  widows: 100%;
  white-space: pre-wrap;
  word-wrap: break-word; /* IE 5.5-7 */
  white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
  line-height: 120%;
  font-size: 0.95vw;
}
#voucherBuilder .voucher-builder {
  margin-bottom: 0;
  font-size: 1.4vw;
}
#voucherBuilder .maximum-code {
  height: 3vh;
  line-height: 225%;
}
#voucherBuilder .maximum-char {
  line-height: 160%;
}
#voucherBuilder .text-body {
  font-size: 1.4vw;
}
#voucherType .voucher-type-item {
  /* height: 16vh; */
  width: 35vw;
  background-color: transparent;
  border-radius: calc(0.375rem - 1px) calc(0.375rem - 1px) 0 0;
  /* background-color: white; */
}
#voucherType .el-form-item__error {
  padding-top: 0%;
  list-style: 150%;
}
/* #voucherType .el-radio-button__inner { */
  /* width: ;
  height: 15vh; */
/* } */
#voucherType .el-form-item__label {
  float: none;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
#voucherType .el-radio-group {
  width: 100%;
}
#voucherType .el-radio__label {
  font-size: 20px;
}
#voucherType .el-select {
  width: 100%;
}
#voucherType .el-checkbox__label {
  padding-left: 0.5vw;
}
#voucherBuilder .el-input-number__increase {
  display: none;
  width: 0px;
}
#voucherBuilder .el-input-number__decrease {
  display: none;
  width: 0px;
}
#voucherBuilder .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
#voucherBuilder .el-input-number {
  width: 100%;
}
</style>
