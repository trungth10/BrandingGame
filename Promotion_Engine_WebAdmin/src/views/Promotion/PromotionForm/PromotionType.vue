<template>
  <div id="promotionTypeCustom">
    <!-- <el-form :model="promotionTypeForm" :rules="ruleVoucher">
      <div class="card shadow mt-3 pt-3 pb-2 pr-4 pl-4">
        <el-col :span="22">
          <h1>VOUCHER</h1>
        </el-col>
        <el-row class="mt-2">
          <el-col :span="24">
            <label style="font-size: 16px" class="mr-3">Using voucher</label>
            <el-switch
              @change="changeHasVoucher"
              v-model="promotionTypeForm.hasVoucher"
            ></el-switch>
          </el-col>
          <el-col :span="8">
            <el-form-item :prop="promotionTypeForm.hasVoucher ? 'voucherGroupId' : ''">
              <el-select
                style="width: 50%"
                :disabled="!promotionTypeForm.hasVoucher"
                v-model="promotionTypeForm.voucherGroupId"
                @change="changeSelectVoucher"
              >
                <el-option
                  v-for="(voucher, index) in vouchers"
                  :key="index"
                  :label="voucher.voucherName"
                  :value="voucher.voucherGroupId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item
              label="Quantity"
              :prop="promotionTypeForm.hasVoucher ? 'voucherQuantity' : ''"
            >
              <el-input-number
                v-loading="loading"
                v-model="promotionTypeForm.voucherQuantity"
                :min="minVoucherQuantity"
                :max="maxVoucherQuantity"
              >
              </el-input-number>
              <br />
              <label class="ml-3"
                >Remain quantity: <b> {{ maxVoucherQuantity }}</b></label
              >
              <i class="ml-2 el-icon-loading" v-if="loading"></i>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :prop="promotionTypeForm.hasVoucher ? 'conditionRuleId' : ''">
              <el-select
                style="width: 50%"
                :disabled="!promotionTypeForm.hasVoucher"
                v-model="promotionTypeForm.conditionRuleId"
              >
                <el-option
                  v-for="(condition, index) in conditions"
                  :key="index"
                  :label="condition.ruleName"
                  :value="condition.conditionRuleId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form> -->
    <div class="card shadow mt-3 pt-3 pb-2 pr-4 pl-4">
      <div class="bg-transparent">
        <!-- //# Promotion Type & Get Help -->
        <el-row class="pb-3">
          <el-col :span="22">
            <h1>PROMOTION TYPE</h1>
          </el-col>
          <el-col :span="2">
            <a href="#" class="float-right">
              <i class="el-icon-question" />
              <span>Get Help</span>
            </a>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <label class="mb-0">What type of promotion ?</label>
          <el-form
            :model="promotionTypeForm"
            :rules="rules"
            ref="promotionTypeForm"
          >
            <el-radio-group v-model="typeOption" @change="changeTypeOption">
              <div class="row align-items-center">
                <el-col class="col-4">
                  <el-radio-button class="m-0 p-0" :label="1"
                    >Using voucher</el-radio-button
                  ></el-col
                >
                <el-col class="col-4">
                  <el-radio-button class="m-0 p-0" :label="2"
                    >Using code</el-radio-button
                  ></el-col
                >
                <el-col class="col-4">
                  <el-radio-button class="m-0 p-0" :label="3"
                    >Automatic</el-radio-button
                  ></el-col
                >
              </div>
            </el-radio-group>
            <el-row>
              <!-- <el-col class="mb-4" :span="5">
                <label style="font-size: 16px margin-top: 1.5vw" class="mr-3"
                  >Using voucher</label
                >
                <el-switch
                  @change="changeHasVoucher"
                  v-model="promotionTypeForm.hasVoucher"
                ></el-switch>
              </el-col> -->
              <!-- <el-col class="mb-4" :span="4">
                <label class="mr-4" style="margin-top: 1.5vw">Automatic </label>
                <el-switch
                  @change="changeAuto"
                  :disabled="promotionTypeForm.hasVoucher"
                  v-model="promotionTypeForm.isAuto"
                >
                </el-switch>
              </el-col> -->
            </el-row>
            <el-row class="mt-3" :gutter="20">
              <!-- //# Input - Promotion Name -->
              <el-col :span="10">
                <el-form-item
                  label=""
                  label-position="top"
                  prop="promotionName"
                  spellcheck="false"
                  required
                >
                  <h4 class="font-weight-normal align-bottom mb-0">
                    Promotion Name
                  </h4>
                  <center>
                    <el-input
                      :maxlength="100"
                      v-model="promotionTypeForm.promotionName"
                      show-word-limit
                    />
                  </center>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :prop="!promotionTypeForm.isAuto ? 'promotionCode' : ''"
                  :required="!promotionTypeForm.isAuto"
                >
                  <h4 class="font-weight-normal align-bottom mb-0">Code</h4>
                  <el-input
                    :disabled="promotionTypeForm.isAuto"
                    :maxlength="promoCodeMaxLength"
                    v-model="promotionTypeForm.promotionCode"
                    spellcheck="false"
                    show-word-limit
                    @keydown.native.space.prevent
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- //# Start choosing Action Type -->
            <el-row>
              <label class="mb-0">What kind of action ?</label>
              <el-col :span="24">
                <el-radio-group
                  id="kindGroup"
                  v-model="isActionType"
                  @change="changeActionType"
                >
                  <el-radio-button :label="true"> Discount </el-radio-button>
                  <el-radio-button :label="false"> Gift</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row class="mt-3" v-if="isActionType">
              <el-col :span="24">
                <el-col :span="24">
                  <label class="mb-0">Discount Action</label>
                </el-col>
                <el-radio-group
                  v-model="promotionTypeForm.actionType"
                  class="mt-0"
                  id="promotionType"
                  :fill="$ENV.COLORS.Main_colors"
                  :disabled="!isActionType"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-radio-button :label="$ENV.ACTION_TYPE.ORDER_AMOUNT">
                        Discount amount of order
                      </el-radio-button>
                    </el-col>
                    <el-col :span="8">
                      <el-radio-button :label="$ENV.ACTION_TYPE.ORDER_PERCENT">
                        Discount percent of order
                      </el-radio-button>
                    </el-col>
                    <el-col :span="8">
                      <el-radio-button :label="$ENV.ACTION_TYPE.ORDER_SHIPPING">
                        Discount shipping fee of order
                      </el-radio-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-radio-button :label="$ENV.ACTION_TYPE.PRODUCT_AMOUNT">
                        Discount amount of item
                      </el-radio-button>
                    </el-col>
                    <el-col :span="8">
                      <el-radio-button
                        :label="$ENV.ACTION_TYPE.PRODUCT_PERCENT"
                      >
                        Discount percent of item
                      </el-radio-button></el-col
                    >
                    <el-col :span="8">
                      <el-radio-button :label="$ENV.ACTION_TYPE.PRODUCT_UNIT">
                        Discount unit of item
                      </el-radio-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-radio-button :label="$ENV.ACTION_TYPE.PRODUCT_FIXED">
                        Fixed price of item
                      </el-radio-button>
                    </el-col>
                    <el-col :span="8">
                      <el-radio-button :label="$ENV.ACTION_TYPE.PRODUCT_LADDER">
                        Ladder price of item
                      </el-radio-button>
                    </el-col>
                    <el-col :span="8"
                      ><el-radio-button
                        :label="$ENV.ACTION_TYPE.PRODUCT_BUNDLE"
                      >
                        Bundle price of item
                      </el-radio-button></el-col
                    >
                  </el-row>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row class="mt-2" v-if="!isActionType">
              <el-col :span="24">
                <el-col :span="24">
                  <label class="mb-0">Gift Action</label>
                </el-col>
              </el-col>
            </el-row>
            <el-row v-if="!isActionType">
              <el-col :span="24">
                <div id="promotionType">
                  <el-radio-group
                    v-model="promotionTypeForm.postActionType"
                    class="mt-0"
                    :fill="$ENV.COLORS.Main_colors"
                    :disabled="isActionType"
                  >
                    <el-col :span="6">
                      <el-radio-button
                        :label="$ENV.POST_ACTION_TYPE.GIFT_PRODUCT"
                      >
                        Gift products
                      </el-radio-button></el-col
                    >

                    <el-col :span="6"
                      ><el-radio-button
                        :label="$ENV.POST_ACTION_TYPE.GIFT_VOUCHER"
                      >
                        Gift vouchers
                      </el-radio-button></el-col
                    >

                    <el-col :span="6">
                      <el-radio-button
                        :label="$ENV.POST_ACTION_TYPE.GIFT_POINT"
                      >
                        Gift points
                      </el-radio-button></el-col
                    >

                    <el-col :span="6">
                      <el-radio-button
                        :label="$ENV.POST_ACTION_TYPE.GIFT_GAME_CODE"
                      >
                        Gift game code
                      </el-radio-button></el-col
                    >
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>

            <!-- //# Title - Time-frame -->
            <el-row type="flex" class="mt-4">
              <el-col><h3>TIMEFRAME</h3></el-col>
            </el-row>

            <el-row type="flex" :gutter="0" justify="center">
              <!-- <el-col :span="24"><h3>TIME-FRAME:</h3></el-col> -->
              <!-- //# Input - Start date -->
              <el-col :span="10">
                <el-form-item label="" prop="startDate">
                  <h5 class="font-weight-normal mb-0 pl-0">Start date</h5>
                  <el-col :span="11" class="ml-0 mr-0">
                    <el-date-picker
                      @change="changeStartDate"
                      format="dd-MM-yyyy"
                      type="date"
                      placeholder="Pick a date"
                      :clearable="false"
                      v-model="promotionTypeForm.startDate"
                      style="width: 100%"
                      :picker-options="pickerOptionsStartDate"
                    />
                  </el-col>
                  <el-col :span="2" class="text-center">at</el-col>
                  <el-col :span="11" class="ml-0 mr-0">
                    <el-time-picker
                      :clearable="false"
                      placeholder="Pick a time"
                      style="width: 100%"
                      format="HH:mm"
                      v-model="promotionTypeForm.startDate"
                    />
                  </el-col>
                </el-form-item>
              </el-col>

              <el-col class="text-center pt-4" :span="1"> - </el-col>
              <!-- //# Input - End date -->
              <el-col :span="10">
                <el-form-item prop="endDate" label="">
                  <h5 class="font-weight-normal mb-0">End date</h5>
                  <el-col :span="11" class="ml-0 mr-0">
                    <el-date-picker
                      :clearable="false"
                      format="dd-MM-yyyy"
                      type="date"
                      placeholder="Pick a date"
                      v-model="promotionTypeForm.endDate"
                      style="width: 100%"
                      :picker-options="pickerOptionEndDate"
                      :disabled="
                        !promotionTypeForm.startDate ||
                          promotionTypeForm.isUnlimited
                      "
                    />
                  </el-col>
                  <el-col :span="2" class="text-center">at</el-col>
                  <el-col :span="11" class="ml-0 mr-0">
                    <el-time-picker
                      :clearable="false"
                      placeholder="Pick a time"
                      style="width: 100%"
                      v-model="promotionTypeForm.endDate"
                      :default-value="
                        promotionTypeForm.startDate != null &&
                        promotionTypeForm.startDate != ''
                          ? promotionTypeForm.startDate + 1
                          : new Date()
                      "
                      format="HH:mm"
                      :disabled="
                        !promotionTypeForm.startDate ||
                          promotionTypeForm.isUnlimited
                      "
                    />
                  </el-col>
                </el-form-item>
              </el-col>

              <!-- //# Unlimited Date -->
              <el-col :span="3" class="pl-3">
                <el-checkbox
                  class="mb-0 mt-4 pt-1"
                  v-model="checkUnlimited"
                  @change="changeUnlimited"
                  id="startDateCheckBox"
                >
                  Unlimited Date
                </el-checkbox>
              </el-col>
            </el-row>
            <!-- //# Valid in this timeframe only -->
            <el-row type="flex" :gutter="0">
              <el-col :span="7">
                <el-form-item
                  class="timeframe mb-0"
                  label="Valid in this timeframe only"
                >
                  <el-switch
                    v-model="promotionTypeForm.isHourFilter"
                    @change="switchHour"
                  />
                </el-form-item>
              </el-col>
              <!-- //# Check All -->
              <el-col :span="17" v-show="promotionTypeForm.isHourFilter">
                <el-checkbox
                  class="align-middle mb-0 mt-2 float-right"
                  :indeterminate="isIndeterminateTF"
                  v-model="checkAllTimeFrame"
                  @change="handleCheckAllChangeTF"
                >
                  Select all
                </el-checkbox>
              </el-col>
            </el-row>
            <!-- //# Hour Filter -->
            <el-row v-if="promotionTypeForm.isHourFilter">
              <el-form-item prop="hourFilter">
                <el-row :gutter="20">
                  <el-checkbox-group v-model="promotionTypeForm.hourFilter">
                    <el-col
                      :span="4"
                      v-for="(item, index) in hourFilterOptions"
                      :key="index"
                    >
                      <el-checkbox :label="item.value">
                        <label style="font-size: 1vw"
                          >{{ item.label
                          }}<i class="el-icon-alarm-clock ml-2"></i
                        ></label>
                      </el-checkbox>
                    </el-col>
                  </el-checkbox-group>
                </el-row>
              </el-form-item>
            </el-row>

            <!-- //# Valid on particular days only -->
            <el-row type="flex">
              <el-col :span="7">
                <el-form-item
                  class="timeframe mb-0"
                  label="Valid on particular days only"
                >
                  <el-switch
                    v-model="promotionTypeForm.isDateFilter"
                    @change="switchDay"
                  />
                </el-form-item>
              </el-col>
              <!-- //# Check All -->
              <el-col :span="17" v-show="promotionTypeForm.isDateFilter">
                <el-checkbox
                  class="align-middle mb-0 mt-2 float-right"
                  :indeterminate="isIndeterminateDF"
                  v-model="checkAllDateFilter"
                  @change="handleCheckAllChangeDF"
                >
                  Select all
                </el-checkbox>
              </el-col>
            </el-row>
            <!--  //# Date Filter -->
            <el-row v-if="promotionTypeForm.isDateFilter">
              <el-form-item prop="dateFilter">
                <el-row :gutter="20">
                  <el-checkbox-group v-model="promotionTypeForm.dateFilter">
                    <el-col
                      :span="3"
                      v-for="item in dateFilterOptions"
                      :key="item.value"
                    >
                      <el-checkbox :label="item.value">
                        <label style="font-size: 1vw"
                          >{{ item.label }}<i class="el-icon-date ml-2"></i
                        ></label>
                      </el-checkbox>
                    </el-col>
                  </el-checkbox-group>
                </el-row>
              </el-form-item>
            </el-row>
            <el-col :span="24">
              <el-form-item
                label="Description"
                label-position="top"
                prop="description"
              >
                <center>
                  <el-input
                    :rows="6"
                    resize="none"
                    type="textarea"
                    :maxlength="4000"
                    v-model="promotionTypeForm.description"
                  />
                </center>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    promotionTypeForm() {
      if (this.promotionTypeForm.startDate) {
        console.log("watch start date");
        this.promotionTypeForm.startTime = new Date();
        this.promotionTypeForm.startTime.setHours(0, 0);
      }
    },
    checkUnlimited(val) {
      this.promotionTypeForm.isUnlimited = val ? true : false;
      if (val === true) {
        this.promotionTypeForm.endDate = "";
      }
    },
    minVoucherQuantity() {
      this.promotionTypeForm.fromIndex = this.voucherIndexInfo.fromIndex;
      this.promotionTypeForm.voucherQuantity = this.minVoucherQuantity;
    },
  },
  name: "promotion-type",
  beforeDestroy() {
    this.$store.commit("voucher/setIndexInfo", {});
  },
  computed: {
    conditions() {
      return this.$store.state.voucher.conditions;
    },
    voucherIndexInfo() {
      return this.$store.state.voucher.indexInfo;
    },
    maxVoucherQuantity() {
      let remain = this.voucherIndexInfo.remain;
      if (remain) {
        return remain;
      }
      return 0;
    },
    minVoucherQuantity() {
      let remain = this.voucherIndexInfo.remain;
      if (remain > 0) {
        return 1;
      } else {
        return 0;
      }
    },
    vouchers() {
      return this.$store.state.voucher.voucherList;
    },
    isExistPromoCode() {
      return this.$store.state.promotion.isExistPromoCode;
    },
  },
  data() {
    var validateEndDate = (rule, value, callback) => {
      if (value) {
        if (value.getTime() <= this.promotionTypeForm.startDate.getTime()) {
          this.promotionTypeForm.endDate = "";
          callback(new Error("Please choose End date after the Start date!"));
        } else {
          callback();
        }
      } else if (!value && !this.promotionTypeForm.isUnlimited) {
        this.promotionTypeForm.endDate = "";
        callback(new Error("Please choose End date!"));
      } else {
        callback();
      }
    };
    var validateTimeframe = (rule, value, callback) => {
      if (
        this.promotionTypeForm.isHourFilter &&
        this.promotionTypeForm.hourFilter
      ) {
        if (this.promotionTypeForm.hourFilter.length == 0) {
          callback(new Error("Please choose at least one Timeframe!"));
        } else {
          callback();
        }
      }
    };
    var validateDateFilter = (rule, value, callback) => {
      if (
        this.promotionTypeForm.isDateFilter &&
        this.promotionTypeForm.dateFilter
      ) {
        if (this.promotionTypeForm.dateFilter.length == 0) {
          callback(new Error("Please choose at least one day!"));
        } else {
          callback();
        }
      }
    };
    var validatorPromoCode = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please input code"));
      } else {
        await this.checkPromoCodeExisting(value).then(() => {
          if (this.isExistPromoCode) {
            callback(new Error("This code is existing"));
          } else {
            for (let i = 0; i < value.length; i++) {
              if (value.charCodeAt(i) > 127) {
                return callback(new Error("Unicode is not allowed!"));
              } else if (value.charCodeAt(i) == 45) {
                console.log("vô đây check dấu gạch ngang");
                return callback(new Error("Dash (-) is not allowed!"));
              }
            }
            callback();
          }
        });
      }
    };
    var validatorVoucherGroup = async (rule, value, callback) => {
      if (
        this.promotionTypeForm.hasVoucher &&
        this.promotionTypeForm.voucherGroupId == ""
      ) {
        return callback(new Error("Please select Voucher"));
      }
    };
    return {
      typeOption: 1,
      hasVoucher: false,
      pickerOptionEndDate: {
        disabledDate: this.handleDueDate,
      },
      props: {
        formIndex: {
          type: Number,
          default: 0,
          required: false,
        },
      },
      ruleVoucher: {
        voucherGroupId: [
          {
            validator: validatorVoucherGroup,
            trigger: ["blur", "change"],
            message: "Please select Voucher",
          },
        ],
        voucherQuantity: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input Quantity",
          },
        ],
      },
      isActionType: true,
      voucherGroupId: "",
      promoCodeMaxLength: 20,
      checkAllTimeFrame: false,
      isIndeterminateTF: true,
      checkAllDateFilter: false,
      isIndeterminateDF: true,
      checkUnlimited: false,
      promotionTypeForm: {
        promotionCode: "",
        promotionName: "",
        isAuto: false,
        hasVoucher: true,
        actionType: this.$ENV.ACTION_TYPE.ORDER_AMOUNT,
        postActionType: this.$ENV.POST_ACTION_TYPE.EMPTY,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        isHourFilter: false,
        hourFilter: [],
        hourFilterNum: 0,
        isDateFilter: false,
        isUnlimited: false,
        dateFilter: [],
        dateFilterNum: 0,
        voucherGroupId: "",
        voucherQuantity: 0,
        fromIndex: 0,
      },
      startDate: "",
      rules: {
        promotionName: [
          {
            required: true,
            message: "Please input Promotion Name",
            trigger: ["blur", "change"],
          },
        ],
        promotionCode: [
          {
            required: true,
            message: "Please input Promotion Code",
            trigger: ["blur", "change"],
          },
          {
            validator: validatorPromoCode,
            trigger: ["blur", "change"],
          },
        ],
        promotionType: [
          {
            required: true,
            message: "Please choose Promotion type",
            trigger: ["blur", "change"],
          },
        ],
        startDate: [
          {
            type: "date",
            required: true,
            message: "Please input Start date",
            trigger: "blur",
          },
        ],
        endDate: [{ validator: validateEndDate, trigger: "change" }],
        hourFilter: [
          {
            validator: validateTimeframe,
            trigger: "change",
          },
        ],
        dateFilter: [
          {
            validator: validateDateFilter,
            trigger: "change",
          },
        ],
      },
      hourFilterOptions: [],
      dateFilterOptions: [
        {
          value: Math.pow(2, 0),
          label: "Sunday",
        },
        {
          value: Math.pow(2, 1),
          label: "Monday",
        },
        {
          value: Math.pow(2, 2),
          label: "Tuesday",
        },
        {
          value: Math.pow(2, 3),
          label: "Wednesday",
        },
        {
          value: Math.pow(2, 4),
          label: "Thursday",
        },
        {
          value: Math.pow(2, 5),
          label: "Friday",
        },
        {
          value: Math.pow(2, 6),
          label: "Saturday",
        },
      ],
      pickerOptionsStartDate: {
        disabledDate(time) {
          return (
            time.getTime() <=
            new Date(new Date().setDate(new Date().getDate() - 1)).getTime()
          );
        },
      },
      actionType: [
        {
          value: "1",
          label: "Action for item",
        },
        {
          value: "2",
          label: "Action for order",
        },
        {
          value: "3",
          label: "Gift action",
        },
      ],
      promotionTypeParam: "1",
      isAuto: false,
      loading: false,
    };
  },
  methods: {
    changeTypeOption(value) {
      this.$refs["promotionTypeForm"].clearValidate("promotionCode");
      this.promotionTypeForm.promotionCode = "";
      switch (value) {
        case 1: {
          this.promotionTypeForm.hasVoucher = true;
          this.promotionTypeForm.isAuto = false;
          break;
        }
        case 2: {
          this.promotionTypeForm.hasVoucher = false;
          this.promotionTypeForm.isAuto = false;
          break;
        }
        case 3: {
          this.promotionTypeForm.hasVoucher = false;
          this.promotionTypeForm.isAuto = true;
          break;
        }
      }
    },
    changeSelectVoucher(value) {
      let voucher = this.vouchers.find((o) => o.voucherGroupId == value);
      if (
        voucher.actionType != null &&
        voucher.actionType > this.$ENV.ACTION_TYPE.EMPTY
      ) {
        this.isActionType = true;
        this.promotionTypeForm.actionType = voucher.actionType;
        this.promotionTypeForm.postActionType = this.$ENV.POST_ACTION_TYPE.EMPTY;
      } else if (
        voucher.postActionType != null &&
        voucher.postActionType > this.$ENV.POST_ACTION_TYPE.EMPTY
      ) {
        this.isActionType = false;

        this.promotionTypeForm.actionType = this.$ENV.ACTION_TYPE.EMPTY;
        this.promotionTypeForm.postActionType = voucher.postActionType;
        console.log(this.promotionTypeForm.postActionType);
      }
      this.checkIndexInfo(value);
    },
    checkIndexInfo(id) {
      this.loading = true;
      this.$store.commit("voucher/setCheckIndexId", id);
      this.$store
        .dispatch("voucher/getIndexInfo")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              title: "Error",
              message: "Cannot get Voucher info",
              type: "danger",
            });
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            title: "Error",
            message: "Cannot get Voucher info",
            type: "danger",
          });
        });
    },
    changeActionType() {
      if (this.isActionType) {
        this.promotionTypeForm.postActionType = this.$ENV.POST_ACTION_TYPE.EMPTY;
        this.promotionTypeForm.actionType = this.$ENV.ACTION_TYPE.ORDER_AMOUNT;
      } else {
        this.promotionTypeForm.postActionType = this.$ENV.POST_ACTION_TYPE.GIFT_PRODUCT;
        this.promotionTypeForm.actionType = this.$ENV.ACTION_TYPE.EMPTY;
      }
    },
    changeHasVoucher(value) {
      this.promotionTypeForm.voucherGroupId = null;
      this.promotionTypeForm.isAuto = false;
      if (value) {
        this.promotionTypeForm.postActionType = this.$ENV.POST_ACTION_TYPE.EMPTY;
        this.promotionTypeForm.actionType = this.$ENV.ACTION_TYPE.EMPTY;
      } else {
        this.promotionTypeForm.postActionType = this.$ENV.POST_ACTION_TYPE.EMPTY;
        this.promotionTypeForm.actionType = this.$ENV.ACTION_TYPE.ORDER_AMOUNT;
      }
      if (this.promotionTypeForm == "") {
        this.$refs["promotionTypeForm"].clearValidate("promotionCode");
      }
    },
    getVoucherList() {
      this.$store
        .dispatch("voucher/getVoucherListForPromo")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              title: "Error",
              message: "Cannot get Voucher",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.$notify({
            title: "Error",
            message: "Cannot get Voucher",
            type: "danger",
          });
        });
    },
    async checkPromoCodeExisting(value) {
      if (value) {
        this.$store.commit("promotion/setPromoCode", value);
        await this.$store.dispatch("promotion/CheckExistPromoCode");
      }
    },
    changeAuto() {
      this.promotionTypeForm.promotionCode = "";
      this.$refs["promotionTypeForm"].clearValidate("promotionCode");
    },
    changeUnlimited(value) {
      this.$refs["promotionTypeForm"].clearValidate("endDate");
      if (!value && this.promotionTypeForm.startDate != null) {
        this.promotionTypeForm.endDate = new Date(
          this.promotionTypeForm.startDate.getTime() + 24 * 60 * 60 * 1000
        );
      }
    },
    changeStartDate() {
      if (!this.promotionTypeForm.isUnlimited) {
        if (this.promotionTypeForm.endDate != "") {
          if (
            this.promotionTypeForm.endDate.getTime() <=
            this.promotionTypeForm.startDate.getTime()
          ) {
            this.promotionTypeForm.endDate = new Date(
              this.promotionTypeForm.startDate.getTime() + 24 * 60 * 60 * 1000
            );
          }
        } else {
          this.promotionTypeForm.endDate = new Date(
            this.promotionTypeForm.startDate.getTime() + 24 * 60 * 60 * 1000
          );
        }
      }
    },
    handleDueDate(date) {
      let startDate = new Date(this.promotionTypeForm.startDate);
      return !(date.getTime() > startDate.getTime());
    },
    handleAutoType(val) {
      let promotion = this.promotionTypeForm;
      if (val) {
        promotion.promotionType = "2";
      } else {
        this.handlePromotionType(this.promotionTypeParam);
      }
    },
    handlePromotionType(val) {
      let promotion = this.promotionTypeForm;
      promotion.promotionType = "2";
      switch (val) {
        case "1": {
          if (!this.isAuto) {
            promotion.promotionType = "1";
          }
          promotion.actionType = "1";
          promotion.discountType = "1";
          break;
        }
        case "2": {
          if (!this.isAuto) {
            promotion.promotionType = "1";
          }
          promotion.actionType = "2";
          promotion.discountType = "1";
          break;
        }
        case "3": {
          if (!this.isAuto) {
            promotion.promotionType = "3";
          }
          promotion.actionType = "3";
          promotion.discountType = "8";
          break;
        }
        case "4": {
          if (!this.isAuto) {
            promotion.promotionType = "4";
          }
          promotion.actionType = "4";
          promotion.discountType = "10";
          break;
        }
      }
    },
    handleCheckAllChangeDF(val) {
      console.log("handleCheckAllChangeDF val :>> ", val);
      var dateFilterAll = [];
      for (const date of this.dateFilterOptions) {
        dateFilterAll.push(date.value);
      }
      this.promotionTypeForm.dateFilter = val ? dateFilterAll : [];
      this.isIndeterminateDF = !this.isIndeterminateDF;
    },
    handleCheckAllChangeTF(val) {
      var hourFilterAll = [];
      for (const hour of this.hourFilterOptions) {
        hourFilterAll.push(hour.value);
      }
      this.promotionTypeForm.hourFilter = val ? hourFilterAll : [];
      this.isIndeterminateTF = !this.isIndeterminateTF;
    },
    addDateFilterOptions() {
      for (let index = 0; index < 24; index++) {
        if (index < 10) {
          this.hourFilterOptions.push({
            value: Math.pow(2, index),
            label: "0" + index + ":00",
          });
        } else {
          this.hourFilterOptions.push({
            value: Math.pow(2, index),
            label: index + ":00",
          });
        }
      }
    },
    switchDay(value) {
      if (!value) {
        this.promotionTypeForm.dateFilter = [];
      }
    },
    switchHour(value) {
      if (!value) {
        this.promotionTypeForm.hourFilter = [];
      }
    },
    nextStep(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleSubmitForm();
          this.$store.commit(
            "promotion/setPromotionTypeForm",
            this.promotionTypeForm
          );
          this.$emit("change-page", 1);
          console.log(this.promotionTypeForm.dateFilterNum);
          console.log(this.promotionTypeForm.hourFilterNum);
        } else {
          this.$message.error("Please input required fields");
          return false;
        }
      });
    },
    handleSubmitForm() {
      //Hour Filter
      console.log(this.promotionTypeForm.hourFilter);
      console.log(this.promotionTypeForm.dateFilter);
      this.promotionTypeForm.hourFilterNum = 0;
      this.promotionTypeForm.hourFilterNum = this.promotionTypeForm.hourFilter.reduce(
        function(a, b) {
          return a + b;
        },
        0
      );
      if (this.promotionTypeForm.hourFilterNum == 0) {
        this.promotionTypeForm.hourFilterNum = 16777215;
      }
      //Day filter
      this.promotionTypeForm.dateFilterNum = 0;
      this.promotionTypeForm.dateFilterNum = this.promotionTypeForm.dateFilter.reduce(
        function(a, b) {
          return a + b;
        },
        0
      );
      if (this.promotionTypeForm.dateFilterNum == 0) {
        this.promotionTypeForm.dateFilterNum = 127;
      }
    },
    async getConditions() {
      this.loading = true;
      await this.$store
        .dispatch("voucher/getConditions")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get Condition error !",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get Condition error !",
            type: "danger",
          });
        });
    },
  },
  created() {
    this.addDateFilterOptions();
    // this.getVoucherList();
    // this.getConditions();
  },
};
</script>

<style scoped>
.description {
  display: block;
  widows: 100%;
  white-space: pre-wrap;
  word-wrap: break-word; /* IE 5.5-7 */
  white-space: -moz-pre-wrap; /* Firefox 1.0-2.0 */
}
#promotionType .el-form-item__error {
  margin-left: 1.5rem !important;
}
#startDateCheckBox .el-checkbox__label {
  padding-left: 0.5vw;
}
.timeframe .el-form-item__label {
  float: left;
}
#promotionType .el-radio-group {
  width: 100%;
}
</style>
<style>
#promotionTypeCustom .el-radio-button__inner {
  width: 18vw;
  /* height: 7vh; */
  text-align: center;
  font-size: 1.25rem !important;
  margin-right: 0.75vw;
  margin-bottom: 5px;
  padding-top: 2.25vh;
  padding-bottom: 2.25vh;
}

#kindGroup .el-radio-button__inner {
  margin-right: 0px;
  width: 10vw;
}
</style>
