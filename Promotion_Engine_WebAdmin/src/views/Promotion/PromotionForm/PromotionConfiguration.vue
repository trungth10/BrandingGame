<template>
  <div>
    <el-row class="mt-0" id="constraints">
      <div>
        <div class="card-header bg-transparent pl-0 pr-0">
          <el-row>
            <el-col :span="10" class="mt-1"><h1>CONSTRAINTS</h1></el-col>

            <el-col :offset="12" :span="2" class="mt-2 pr-1">
              <a href="#" class="float-right"
                ><i class="el-icon-question"></i> <span>Get Help</span></a
              >
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-form
      :model="configurationForm"
      :rules="rules"
      ref="configurationForm"
      id="configuration"
    >
      <!-- //# Payment method -->
      <el-row>
        <div class="card shadow mt-0">
          <div class="card-header custom-card bg-transparent">
            <el-row>
              <el-row><h3>PAYMENT METHOD</h3></el-row>
              <el-row
                ><el-col :span="24">
                  <el-row class="mt-2">
                    <p class="content-custom">
                      {{ $ENV.TEXT_EXPLAIN.Payment }}
                    </p>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="paymentMethod">
                    <el-checkbox-group
                      :fill="$ENV.COLORS.Main_colors"
                      v-model="configurationForm.paymentMethod"
                    >
                      <el-row>
                        <el-col :span="2">
                          <el-checkbox-button
                            label="Cash"
                            name="paymentMethod"
                          ></el-checkbox-button
                        ></el-col>
                        <el-col :span="3">
                          <el-checkbox-button
                            label="Credit Cards"
                            name="paymentMethod"
                          ></el-checkbox-button
                        ></el-col>
                        <el-col :span="3" class="mr-2">
                          <el-checkbox-button
                            label="Bank Transfers"
                            name="paymentMethod"
                          ></el-checkbox-button
                        ></el-col>
                        <el-col :span="2" class="mr-4">
                          <el-checkbox-button
                            label="eWallets"
                            name="paymentMethod"
                          ></el-checkbox-button
                        ></el-col>
                        <el-col :span="3" class="mr-3">
                          <el-checkbox-button
                            label="Mobile Banking"
                            name="paymentMethod"
                          ></el-checkbox-button
                        ></el-col>
                        <el-col :span="4">
                          <el-checkbox-button
                            label="COD"
                            name="paymentMethod"
                          ></el-checkbox-button
                        ></el-col>
                      </el-row>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </div>
        </div>
      </el-row>
      <!-- //# Target customer, membership level & gender -->
      <el-row>
        <div class="card shadow mt-3">
          <div class="card-header custom-card bg-transparent">
            <el-col :span="8">
              <h3>TARGET CUSTOMER</h3>
              <el-col :span="24">
                <p class="content-custom">
                  {{ $ENV.TEXT_EXPLAIN.Customer_type }}
                </p>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="customerType">
                  <el-checkbox-group
                    @change="changeCustomerType"
                    :fill="$ENV.COLORS.Main_colors"
                    v-model="configurationForm.customerType"
                  >
                    <el-col :span="6">
                      <el-checkbox-button
                        label="Guest"
                        name="customerType"
                      ></el-checkbox-button
                    ></el-col>
                    <el-col :span="8">
                      <el-checkbox-button
                        label="Membership"
                        name="customerType"
                      ></el-checkbox-button
                    ></el-col>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col class="vertical-split" :span="8">
              <div>
                <h3>MEMBERSHIP LEVEL</h3>
                <el-col :span="24">
                  <p class="content-custom">
                    {{ $ENV.TEXT_EXPLAIN.Member_level }}
                  </p>
                </el-col>
                <el-col :span="24">
                  <el-form-item :prop="isForMembership ? 'memberLevelParams' : ''">
                    <el-select
                      :disabled="!isForMembership"
                      v-model="configurationForm.memberLevelParams"
                      collapse-tags
                      multiple
                    >
                      <el-option
                        v-for="item in memberLevels"
                        :key="item.memberLevelId"
                        :label="item.name"
                        :value="item.memberLevelId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </div>
            </el-col>
            <el-col class="vertical-split" :span="8">
              <h3>CUSTOMER GENDER</h3>
              <el-col :span="24">
                <p class="content-custom">
                  {{ $ENV.TEXT_EXPLAIN.Customer_gender }}
                </p>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="customerGender">
                  <el-checkbox-group
                    :fill="$ENV.COLORS.Main_colors"
                    v-model="configurationForm.customerGender"
                  >
                    <el-col :span="6">
                      <el-checkbox-button
                        label="Male"
                        name="customerGender"
                      ></el-checkbox-button
                    ></el-col>
                    <el-col :span="8">
                      <el-checkbox-button
                        label="Female"
                        name="customerGender"
                      ></el-checkbox-button
                    ></el-col>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-col>
          </div>
        </div>
      </el-row>
      <!-- //# Sale mode, apply by & exclusive -->
      <el-row>
        <div class="card shadow mt-3">
          <div class="card-header custom-card bg-transparent">
            <el-col :span="8">
              <el-row
                ><el-col :span="24">
                  <h3>SALE MODE</h3>
                  <el-row>
                    <p class="content-custom">
                      {{ $ENV.TEXT_EXPLAIN.Sale_mode }}
                    </p>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="salesMode">
                    <el-checkbox-group
                      :fill="$ENV.COLORS.Main_colors"
                      v-model="configurationForm.salesMode"
                    >
                      <el-col :span="6">
                        <el-checkbox-button
                          value="Eat-in"
                          label="Eat-in"
                          name="salesMode"
                        ></el-checkbox-button
                      ></el-col>
                      <el-col :span="8">
                        <el-checkbox-button
                          label="Take-away"
                          name="salesMode"
                        ></el-checkbox-button
                      ></el-col>
                      <el-col :span="6">
                        <el-checkbox-button
                          label="Delivery"
                          name="salesMode"
                        ></el-checkbox-button
                      ></el-col>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="vertical-split" :span="8">
              <h3>APPLY BY</h3>
              <el-col :span="24">
                <p class="content-custom">
                  {{ $ENV.TEXT_EXPLAIN.Apply_by }}
                </p>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="applyBy">
                  <el-checkbox-group
                    :fill="$ENV.COLORS.Main_colors"
                    v-model="configurationForm.applyBy"
                  >
                    <el-col :span="6">
                      <el-checkbox-button
                        label="Store"
                        name="applyBy"
                      ></el-checkbox-button
                    ></el-col>
                    <el-col :span="5">
                      <el-checkbox-button
                        label="Online"
                        name="applyBy"
                      ></el-checkbox-button
                    ></el-col>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-col>
            <!-- //# EXCLUSIVE -->
            <el-col class="vertical-split" :span="8">
              <div>
                <h3>EXCLUSIVE</h3>
                <el-col :span="24">
                  <p class="content-custom">
                    {{ $ENV.TEXT_EXPLAIN.Exclusive }}
                  </p>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="exclusiveLabel">
                    <el-radio-group
                      :fill="$ENV.COLORS.Main_colors"
                      v-model="configurationForm.exclusiveLabel"
                    >
                      <el-col class="p-0 m-1" :span="7"
                        ><el-radio border label="None"></el-radio
                      ></el-col>
                      <el-col class="p-0 m-1" :span="7"
                        ><el-radio border label="Level"></el-radio></el-col
                      ><el-col class="p-0 m-1" :span="7"
                        ><el-radio border label="Global"></el-radio
                      ></el-col>
                    </el-radio-group>
                  </el-form-item>
                  <!-- <el-form-item prop="isHolidayApply">
                  <el-radio-group
                    :fill="$ENV.COLORS.Main_colors"
                    v-model="configurationForm.isHolidayApply"
                  >
                    <el-col :span="12"
                      ><el-radio border label="Yes" class="mr-5"></el-radio
                    ></el-col>
                    <el-col :span="12"
                      ><el-radio border label="No"></el-radio
                    ></el-col>
                  </el-radio-group>
                </el-form-item> -->
                </el-col>
              </div>
            </el-col>
          </div>
        </div>
      </el-row>
      <!-- //# EXCLUSIVE -->
      <!-- <el-row>
        <div class="card shadow mt-3">
          <div class="card-header custom-card bg-transparent">
            <el-row>
              <el-row><h3>EXCLUSIVE</h3></el-row>
              <el-row :gutter="20" justify="space-between"
                ><el-col :span="24">
                  <el-row>
                    <p class="content-custom">
                      {{ $ENV.TEXT_EXPLAIN.Exclusive }}
                    </p>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="exclusiveLabel">
                    <el-radio-group
                      :fill="$ENV.COLORS.Main_colors"
                      v-model="configurationForm.exclusiveLabel"
                    >
                      <el-col class="p-0 m-1" :span="7"
                        ><el-radio border label="None"></el-radio
                      ></el-col>
                      <el-col class="p-0 m-1" :span="7"
                        ><el-radio border label="Level"></el-radio></el-col
                      ><el-col class="p-0 m-1" :span="7"
                        ><el-radio border label="Global"></el-radio
                      ></el-col>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
            <el-row>
              <el-row><h3>RANKS</h3></el-row>
              <el-row
                ><el-col :span="14">
                  <el-row>
                    <p>
                      It is a long established fact that a reader will be distracted by
                      the readable.
                    </p>
                  </el-row>
                </el-col>
                <el-col :span="3" :offset="2">
                  <el-form-item prop="rank">
                    <el-input
                      type="number"
                      v-model="configurationForm.rank"
                      placeholder="<< Default rank is 0 >>"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </div>
        </div>
      </el-row> -->
      <!-- //#STORE -->
      <el-row>
        <div class="card shadow mt-3">
          <div class="card-header custom-card bg-transparent">
            <el-row :gutter="20" justify="space-between">
              <el-col :span="24">
                <el-col :span="24">
                  <h3>STORES CONFIGURATION</h3>
                </el-col>
                <el-col :span="18">
                  <p class="content-custom">
                    {{ $ENV.TEXT_EXPLAIN.Store }}
                  </p>
                </el-col>
                <el-col :span="6">
                  <el-checkbox
                    class="float-right"
                    :indeterminate="isIndeterminate"
                    v-model="checkAll"
                    @change="handleCheckAllChange"
                    >Select all</el-checkbox
                  >
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="storeApply">
                    <el-checkbox-group
                      :fill="$ENV.COLORS.Main_colors"
                      v-model="configurationForm.storeApply"
                      @change="handleCheckedStoresChange"
                    >
                      <el-col :span="6" v-for="store in storeList" :key="store.storeId">
                        <el-checkbox :label="store">
                          {{ store.storeName | storeNameFilter }}
                        </el-checkbox>
                      </el-col>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-col>
              <!-- <el-col :span="7">
                <h3>GAME CONFIGURATION</h3>
                <p class="content-custom">
                  {{ $ENV.TEXT_EXPLAIN.Game }}
                </p>
                <el-col :span="24">
                  <el-radio-group
                    :fill="$ENV.COLORS.Main_colors"
                    v-model="configurationForm.isForGame"
                  >
                    <el-col class="p-0 m-1" :span="12"
                      ><el-radio border :label="true">Yes</el-radio></el-col
                    >
                    <el-col class="p-0 m-1" :span="8"
                      ><el-radio border :label="false">No</el-radio></el-col
                    >
                  </el-radio-group>
                </el-col>
              </el-col> -->
            </el-row>
          </div>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "promotion-configuration",
  filters: {
    storeNameFilter(value) {
      let max = 35;
      if (value.length > max) {
        return value.substring(0, max - 3) + "...";
      }
      return value;
    },
  },
  data() {
    var validatorMemberLevel = (rule, value, callback) => {
      console.log("validate member level");
      console.log(value);
      if (value.length == 0) {
        callback(new Error("Please select level of member"));
      } else {
        callback();
      }
    };
    var validatorLimitPerDate = (rule, value, callback) => {
      if (this.configurationForm.isLimitUsage == "Yes") {
        if (!value) {
          callback(new Error("Please input your limit"));
        } else {
          if (value <= 0) {
            callback(new Error("Please input a positive number"));
          } else if (value > 100) {
            callback(new Error("Please input smaller than 100"));
          } else callback();
        }
      } else {
        callback();
      }
    };
    var validatorRank = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("Please input a positive number"));
      } else callback();
    };
    return {
      props: {
        formIndex: {
          type: Number,
          default: 0,
          required: false,
        },
      },
      checkAll: false,
      isIndeterminate: true,
      rules: {
        memberLevelParams: [
          {
            validator: validatorMemberLevel,
            trigger: ["blur", "change"],
          },
        ],
        exclusiveLabel: [
          {
            required: true,
            message: "Please choose Exclusive level",
            trigger: ["blur", "change"],
          },
        ],
        rank: [
          {
            validator: validatorRank,
            trigger: "change",
          },
        ],
        salesMode: [
          {
            required: true,
            message: "Please choose at least one sale mode",
            trigger: ["blur", "change"],
          },
        ],
        applyBy: [
          {
            required: true,
            message: "Please choose at least one application",
            trigger: ["blur", "change"],
          },
        ],
        isHolidayApply: [
          {
            required: true,
            message: "Please check this if you want to apply for holiday or not!?",
            trigger: ["blur", "change"],
          },
        ],
        customerType: [
          {
            required: true,
            message: "Please choose at least one Customer type",
            trigger: ["blur", "change"],
          },
        ],
        customerGender: [
          {
            required: true,
            message: "Please choose at least one gender",
            trigger: ["blur", "change"],
          },
        ],
        paymentMethod: [
          {
            required: true,
            message: "Please choose at least one payment",
            trigger: ["blur", "change"],
          },
        ],
        isLimitUsage: [
          {
            required: true,
            message: "Please choose if you want to limit your voucher or not?",
            trigger: ["blur", "change"],
          },
        ],
        limitUsage: [
          {
            validator: validatorLimitPerDate,
            trigger: "change",
          },
        ],
        storeApply: [
          {
            required: true,
            message: "Please choose at least one store",
            trigger: ["blur", "change"],
          },
        ],
      },
      sales: 0,
      configurationForm: {
        exclusiveLabel: "None",
        exclusive: 0,
        rank: 0,
        salesMode: [],
        salesModeNum: "",
        applyBy: [],
        applyByNum: "",
        isHolidayApply: "Yes",
        isHolidayApplyNum: false,
        customerType: [],
        customerTypeNum: 0,
        customerGender: [],
        customerGenderNum: "",
        paymentMethod: [],
        paymentMethodNum: "",
        isLimitUsage: "No",
        isLimitUsageNum: false,
        limitUsage: "",
        storeApply: [],
        imgUrl: "",
        memberLevels: [],
        memberLevelParams: [],
        isForGame: true,
      },
      isForMembership: false,
    };
  },
  computed: {
    memberLevels() {
      return this.$store.state.condition.levels;
    },
    storeList() {
      return this.$store.state.stores.storeList;
    },
    promotionTypeForm() {
      return this.$store.state.promotion.promotionTypeForm;
    },
  },
  methods: {
    changeCustomerType(value) {
      this.isForMembership = value.includes("Membership");
      if (!this.isForMembership) {
        this.configurationForm.memberLevels = [];
        this.configurationForm.memberLevelParams = [];
      }
    },
    handleCheckAllChange(val) {
      this.configurationForm.storeApply = val ? this.storeList : [];
      console.log("this.storeList :>> ", this.storeList);
      console.log(
        "this.configurationForm.storeApply :>> ",
        this.configurationForm.storeApply
      );
      this.isIndeterminate = !this.isIndeterminate;
      console.log("handleCheckAllChange :>> ", val);
      this.$store.commit("promotion/setIsLimitForStore", !val);
    },
    handleCheckedStoresChange(value) {
      console.log("value :>> ", value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.storeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.storeList.length;
      this.$store.commit("promotion/setIsLimitForStore", !this.checkAll);
    },
    nextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (
          this.isForMembership &&
          this.configurationForm.memberLevelParams.length == 0
        ) {
          this.$notify({
            title: "Error",
            message: "Please select level of member",
            type: "error",
          });

          return;
        }
        if (valid) {
          this.handleConfigurationForm();
          this.$store.commit(
            "promotion/setPromotionConfigurationForm",
            this.configurationForm
          );
          this.$emit("change-page", 2);
        } else {
          this.$message.error("Please input required fields");
          return false;
        }
      });
    },
    handleChangeLimitation(val) {
      if (val == "No") {
        this.configurationForm.limitUsage = 1;
      }
    },
    handleConfigurationForm() {
      //Exclusive
      let EXCLUSIVE = this.$ENV.EXCLUSIVE;
      switch (this.configurationForm.exclusiveLabel) {
        case "None":
          this.configurationForm.exclusive = EXCLUSIVE.NONE;
          break;
        case "Level": {
          let actionType = this.promotionTypeForm.actionType;
          let postActionType = this.promotionTypeForm.postActionType;
          console.log("possss >>>", postActionType);
          if (actionType > this.$ENV.ACTION_TYPE.EMPTY) {
            if (actionType < this.$ENV.ACTION_TYPE.ORDER_SHIPPING) {
              this.configurationForm.exclusive = EXCLUSIVE.LEVEL_ORDER;
            } else if (actionType == this.$ENV.ACTION_TYPE.ORDER_SHIPPING) {
              this.configurationForm.exclusive = EXCLUSIVE.LEVEL_SHIPPING;
            } else {
              this.configurationForm.exclusive = EXCLUSIVE.LEVEL_PRODUCT;
            }
          } else if (postActionType > 0) {
            this.configurationForm.exclusive = EXCLUSIVE.LEVEL_GIFT;
          }
          break;
        }
        case "Global":
          this.configurationForm.exclusive = EXCLUSIVE.GLOBAL;
          break;
      }
      //Sales Mode
      this.configurationForm.salesModeNum = 0;
      this.configurationForm.salesMode.forEach((e) => {
        switch (e) {
          case "Eat-in":
            this.configurationForm.salesModeNum += 1;
            break;
          case "Take-away":
            this.configurationForm.salesModeNum += 2;
            break;
          case "Delivery":
            this.configurationForm.salesModeNum += 4;
            break;
        }
      });
      //Apply
      this.configurationForm.applyByNum = 0;
      this.configurationForm.applyBy.forEach((e) => {
        switch (e) {
          case "Store":
            this.configurationForm.applyByNum += 1;
            break;
          case "Online":
            this.configurationForm.applyByNum += 2;
            break;
        }
      });
      //Holiday
      if (this.configurationForm.isHolidayApply == "Yes") {
        this.configurationForm.isHolidayApplyNum = true;
      } else this.configurationForm.isHolidayApplyNum = false;
      //Customer Type

      if (this.configurationForm.customerType.length > 1) {
        this.configurationForm.customerTypeNum = 0;
      } else {
        this.configurationForm.customerTypeNum =
          this.configurationForm.customerType[0] == "Guest" ? "2" : "1";
      }

      if (this.configurationForm.customerType.includes("Membership")) {
        this.configurationForm.memberLevelParams.forEach((level) => {
          this.memberLevels.forEach((obj) => {
            if (obj.memberLevelId == level) {
              this.configurationForm.memberLevels.push(obj);
            }
          });
        });
      }

      //Customer Gender
      this.configurationForm.customerGenderNum = 0;
      this.configurationForm.customerGender.forEach((e) => {
        switch (e) {
          case "Male":
            this.configurationForm.customerGenderNum += 1;
            break;
          case "Female":
            this.configurationForm.customerGenderNum += 2;
            break;
        }
      });
      //Payment Method
      this.configurationForm.paymentMethodNum = 0;
      this.configurationForm.paymentMethod.forEach((e) => {
        switch (e) {
          case "Cash":
            this.configurationForm.paymentMethodNum += 1;
            break;
          case "Credit Cards":
            this.configurationForm.paymentMethodNum += 2;
            break;
          case "Bank Transfers":
            this.configurationForm.paymentMethodNum += 4;
            break;
          case "eWallets":
            this.configurationForm.paymentMethodNum += 8;
            break;
          case "Mobile Banking":
            this.configurationForm.paymentMethodNum += 16;
            break;
          case "COD":
            this.configurationForm.paymentMethodNum += 32;
            break;
        }
      });
      //Limit Per Date
      if (this.configurationForm.isLimitUsage == "Yes") {
        this.configurationForm.isLimitUsageNum = true;
      } else this.configurationForm.isLimitUsageNum = false;
    },
    getStoreList() {
      //Get stores
      this.$store.commit("stores/setPageIndex", 0);
      this.$store.commit("stores/setPageSize", 0);
      this.$store
        .dispatch("stores/getStoresList")
        .then(
          () => {
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.message =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
          }
        )
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
    saveNewDraft() {
      this.loading = true;
      this.isSaved = true;
      this.handleConfigurationForm();
      this.$store.commit(
        "promotion/setPromotionConfigurationForm",
        this.configurationForm
      );
      this.$store
        .dispatch("promotion/savePromotion")
        .then((response) => {
          this.loading = false;
          console.log("save promo");
          console.log(response);
          if (response.status == 200) {
            this.$message({
              type: "success",
              message: "Congrats! Create promotion successful.",
            });
            this.$router.push("/campaign/promotion");
          } else {
            this.$message({
              message: response.data.message + ", please try again.",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
    saveDraft(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveNewDraft();
        } else {
          this.$message.error("Please input required fields");
          return false;
        }
      });
    },
    getMemberLevels() {
      this.$store.dispatch("condition/getBrandLevel");
    },
  },
  created() {
    this.getStoreList();
    this.getMemberLevels();
  },
};
</script>

<style scoped>
.vertical-split {
  border-left: 0.3vw solid #2dce89;
  min-height: 14vh;
  padding-left: 10px;
  margin: 0px;
}
.vertical-split-right {
  border-right: 0.3vw solid #2dce89;
  min-height: 20vh;
  padding-left: 10px;
  margin: 0px;
}
.content-custom {
  text-align: justify;
}
#configuration .el-radio-button__inner {
  font-size: 16px;
}
#configuration .el-checkbox-button__inner {
  width: 7vw;
}
#configuration .el-checkbox__label {
  font-size: 16px;
}
#constraints .card-header {
  border-bottom: 0px;
}
.custom-card {
  -webkit-box-shadow: -6px -1px 15px -3px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: -6px -1px 15px -3px rgba(0, 0, 0, 0.2);
  box-shadow: -6px -1px 15px -3px rgba(0, 0, 0, 0.2);
}
</style>
