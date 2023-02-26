<template>
  <div id="promoConfig" style="font-size: 18px" v-loading="loading">
    <div class="card-body">
      <el-form
        :show-message="true"
        :inline-message="true"
        ref="configForm"
        :model="promotion"
        label-width="9.5vw"
        label-position="left"
        :rules="formRule"
      >
        <el-card shadow="never" class="custom-card">
          <el-row justify="space-between">
            <el-col :span="8">
              <label> <b> CONFIGURATION </b></label>
            </el-col>
            <el-col :span="16">
              <div class="float-right">
                <label style="font-size: 0.95vw"
                  >Last update: <b>{{ promotion.updDate | formatDate }}</b>
                </label>
                <span v-if="!publishBlock && !expiredBlock">
                  <el-divider direction="vertical"></el-divider>
                  <el-button
                    size="mini"
                    icon="el-icon-edit"
                    type="primary"
                    v-if="!isEdit"
                    @click="editMode"
                    >Edit</el-button
                  >
                  <el-button size="mini" type="text" v-if="isEdit" @click="editMode"
                    >Cancel</el-button
                  >
                  <el-button
                    size="mini"
                    icon="el-icon-document"
                    type="primary"
                    @click="updateInfo"
                    v-if="isEdit"
                    >Save</el-button
                  >
                </span>
              </div>
            </el-col>
            <el-col :span="24">
              <el-divider class="mt-1 mb-1"></el-divider>
            </el-col>
          </el-row>
          <el-row v-if="!isEdit">
            <el-col :span="24" class="mt-3">
              <el-col :span="10">
                <label
                  ><b>Exclusive: </b> {{ promotion.exclusive | exclusiveFilter }}
                </label>
              </el-col>
              <el-col :span="8">
                <label
                  ><b>Payment: </b>{{ promotion.paymentMethod | paymentFilter }}
                </label>
              </el-col>
            </el-col>
            <el-col :span="24" class="mt-3">
              <el-col :span="10">
                <label
                  ><b>Sale mode: </b> {{ promotion.saleMode | saleModeFilter }}
                </label>
              </el-col>
              <el-col :span="8">
                <label><b>Apply by: </b>{{ promotion.applyBy | applyFilter }} </label>
              </el-col>
            </el-col>
            <el-col :span="24" class="mt-3">
              <el-col :span="10">
                <label
                  ><b>Customer type: </b>{{ promotion.forMembership | memberTypeFilter }}
                </label>
              </el-col>
              <el-col :span="8">
                <label><b>Gender: </b>{{ promotion.gender | genderFilter }} </label>
              </el-col>
            </el-col>

            <el-col v-if="membershipBlock" :span="24" class="mt-3">
              <label><b>Member Levels: </b> {{ selectedLevels }} </label>
            </el-col>
          </el-row>
          <div v-if="isEdit">
            <el-row class="mt-3 mb-0">
              <el-col class="mb-0" style="height: 55px" :span="24">
                <el-form-item label="Exclusive">
                  <el-select
                    :disabled="!isEdit"
                    v-model="promotion.exclusive"
                    placeholder="Select"
                    size="small"
                    style="width: 10vw"
                  >
                    <el-option
                      v-for="item in exclusives"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item class="mb-1 mt-0" prop="saleMode" label="Sale mode">
                <el-checkbox-group
                  fill="#67C23A"
                  :disabled="!isEdit"
                  v-model="saleModes"
                  @change="changeSaleMode"
                  size="medium"
                >
                  <el-checkbox
                    value="Eat-in"
                    label="Eat-in"
                    name="salesMode"
                  ></el-checkbox>
                  <el-checkbox
                    value="Take-away"
                    label="Take-away"
                    name="salesMode"
                  ></el-checkbox>
                  <el-checkbox
                    value="Delivery"
                    label="Delivery"
                    name="salesMode"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item class="mb-1" prop="applyBy" label="Apply by">
                <el-checkbox-group
                  size="medium"
                  fill="#67C23A"
                  :disabled="!isEdit"
                  v-model="appliesBy"
                  @change="changeApplyBy"
                >
                  <el-checkbox label="Online" value="Online" name="applyBy"></el-checkbox>
                  <el-checkbox label="Store" value="Store" name="applyBy"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item class="mb-1" prop="forMembership" label="Target customer">
                  <el-checkbox-group
                    size="medium"
                    fill="#67C23A"
                    :disabled="!isEdit"
                    v-model="forMembership"
                    @change="changeMembership"
                  >
                    <el-checkbox
                      label="Membership"
                      value="Membership"
                      name="forMembership"
                    ></el-checkbox>
                    <el-checkbox
                      label="Guest"
                      value="Guest"
                      name="forMembership"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col class="" :span="24">
                <el-form-item class="mb-1 p-0" prop="gender" label="Customer gender">
                  <el-checkbox-group
                    size="medium"
                    fill="#67C23A"
                    :disabled="!isEdit"
                    v-model="genders"
                    @change="changeGender"
                  >
                    <el-checkbox label="Male" value="Male" name="gender"></el-checkbox>
                    <el-checkbox
                      label="Female"
                      value="Female"
                      name="gender"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item class="mb-1 p-0" prop="paymentMethod" label="Payment">
                  <el-checkbox-group
                    size="medium"
                    fill="#67C23A"
                    :disabled="!isEdit"
                    v-model="paymentMethods"
                    @change="changePayment"
                  >
                    <el-checkbox label="Cash" value="Cash" name="payment"></el-checkbox>
                    <el-checkbox
                      label="Credit Cards"
                      value="Credit Cards"
                      name="payment"
                    ></el-checkbox>
                    <el-checkbox
                      label="Bank Transfers"
                      value="Bank Transfers"
                      name="payment"
                    ></el-checkbox>
                    <el-checkbox
                      label="eWallets"
                      value="eWallets"
                      name="payment"
                    ></el-checkbox>
                    <el-checkbox
                      label="Mobile Banking"
                      value="Mobile Banking"
                      name="payment"
                    ></el-checkbox>
                    <el-checkbox label="COD" value="COD" name="payment"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
                <el-form-item
                  prop="isHolidayApply"
                  class="mb-1"
                  label="Available on holidays"
                >
                  <el-radio-group
                    size="medium"
                    fill="#67C23A"
                    :disabled="!isEdit"
                    @change="changeHoliday"
                    v-model="forHoliday"
                  >
                    <el-radio label="Yes"></el-radio>
                    <el-radio label="No"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->
              <el-col v-if="membershipBlock" :span="24">
                <el-form-item
                  prop="memberLevelMapping"
                  class="mb-1"
                  label="Member Levels"
                >
                  <el-select
                    :disabled="!isEdit"
                    v-model="promotion.memberLevelMapping"
                    placeholder="Select"
                    size="small"
                    style="width: 20vw"
                    multiple=""
                    collapse-tags=""
                  >
                    <el-option
                      v-for="(level, index) in memberLevels"
                      :key="index"
                      :label="level.name"
                      :value="level.memberLevelId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form>
      <el-row>
        <el-card shadow="never" class="mt-3 custom-card">
          <el-row>
            <el-col :span="24">
              <label> <b> TIMEFRAME SETTING</b></label>
            </el-col>
            <el-col :span="24">
              <el-divider class="mt-1 mb-1"></el-divider>
            </el-col>
            <el-col class="card card-body mt-3" :span="24">
              <label>
                <i class="el-icon-date"></i> <b> Particular days in week </b>
              </label>
              <el-row :gutter="20" class="mt-2">
                <el-checkbox-group v-model="dayFilterArray" @change="dayFilterChange">
                  <el-col :span="3" v-for="item in dayFilterOptions" :key="item.value">
                    <el-checkbox :label="item.value">
                      {{ item.label }}
                    </el-checkbox>
                  </el-col>
                </el-checkbox-group>
              </el-row>
              <el-col :span="24">
                <el-button
                  v-if="!publishBlock && !expiredBlock"
                  @click="updateDayFilter(dayFilterParam)"
                  class="float-right"
                  size="mini"
                  type="primary"
                  >Save</el-button
                >
              </el-col>
            </el-col>
            <el-col :span="24" class="card card-body mt-3">
              <label>
                <i class="el-icon-time"></i> <b> Specificed hours in day </b></label
              >
              <el-row :gutter="20" class="mt-2">
                <el-checkbox-group v-model="hourFilterArray" @change="hourFilterChange">
                  <el-col :span="4" v-for="item in hourFilterOptions" :key="item.value">
                    <el-checkbox :label="item.value">
                      {{ item.label }}
                    </el-checkbox>
                  </el-col>
                </el-checkbox-group>
              </el-row>
              <el-col :span="24">
                <el-button
                  v-if="!publishBlock && !expiredBlock"
                  @click="updateHourFilter(hourFilterParam)"
                  class="float-right"
                  size="mini"
                  type="primary"
                  >Save</el-button
                >
              </el-col>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
      <el-form ref="mediaForm" :rules="mediaRule" :model="promotion" label-position="top">
        <el-card shadow="never" class="mt-3 custom-card">
          <el-row>
            <el-col :span="10">
              <label> <b> MEDIA</b></label>
            </el-col>
            <el-col :span="14">
              <label class="float-right" style="font-size: 0.95vw"
                >Last update: <b>{{ promotion.updDate | formatDate }}</b>
              </label>
            </el-col>

            <el-col :span="24">
              <el-divider class="mt-1 mb-1"></el-divider>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-row class="mt-3">
                <el-col :span="12">
                  <label>
                    <i class="el-icon-chat-dot-round"></i> <b> Description </b></label
                  >
                </el-col>
                <el-col :span="12">
                  <span v-if="!expiredBlock" class="float-right">
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      v-if="!isEditDescription"
                      @click="editDescriptionMode"
                      >Edit</el-button
                    >
                    <el-button
                      size="mini"
                      type="text"
                      v-if="isEditDescription"
                      @click="editDescriptionMode"
                      >Cancel</el-button
                    >
                    <el-button
                      v-if="isEditDescription"
                      @click="updateDescription"
                      type="primary"
                      size="mini"
                      >Save</el-button
                    >
                  </span>
                </el-col>
              </el-row>
              <el-card v-if="!isEditDescription" shadow="never">
                <el-row>
                  <el-col :span="24">
                    <pre style="min-height: 20vh">{{ promotion.description }}</pre>
                  </el-col>
                </el-row>
              </el-card>
              <el-row v-show="isEditDescription">
                <el-form-item prop="description" label-width="0px">
                  <el-input
                    type="textarea"
                    :rows="15"
                    resize="none"
                    placeholder="Please input"
                    v-model="promotion.description"
                    :maxlength="4000"
                  >
                  </el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <!-- <div class="rounded preview-icon align-middle align-center bg-info">
              <i class="el-icon-s-operation text-dark"></i>
            </div> -->

            <el-col :span="12">
              <el-row class="" :gutter="13">
                <el-col :span="24">
                  <el-col :span="24">
                    <label class="mt-3" style="color: black">
                      <i class="el-icon-picture-outline"></i> <b> Image</b></label
                    >
                  </el-col>
                  <el-col :span="24">
                    <el-aside v-if="promotion.imgUrl != '' || promotion.imgUrl != null">
                      <img
                        :src="promotion.imgUrl"
                        v-bind:alt="promotion.imgUrl"
                        width="300px"
                      />
                    </el-aside>
                    <label
                      style="color: grey"
                      v-if="promotion.imgUrl == '' || promotion.imgUrl == null"
                      >No data</label
                    >
                  </el-col>

                  <el-col :span="24">
                    <!-- v-if="!publishBlock && !expiredBlock" -->
                    <el-button
                      type="text primary"
                      style=""
                      size="mini"
                      @click="openUpload"
                      >Upload image</el-button
                    >
                  </el-col>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>
    <el-dialog
      title="Upload Image"
      :visible.sync="dialogUpload"
      width="80%"
      :before-close="dialogUploadClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div v-loading="loading">
        <el-row justify="center" align="center">
          <el-col :span="10">
            <center>
              <el-upload
                drag
                action=""
                :multiple="false"
                :http-request="uploadImage"
                :show-file-list="false"
                accept="image/png, image/jpeg"
              >
                <center>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                  </div>
                </center>
              </el-upload>
            </center>
          </el-col>
          <el-col v-loading="imgLoading" :span="14">
            <center>
              <img v-if="image" width="35%" :src="image" />
            </center>
          </el-col>
          <el-col :span="24">
            <div class="float-right">
              <el-button @click="cancelImage">Cancel</el-button>
              <el-button @click="updateImageOfPromotion">Save</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import moment from "moment";
import firebase from "firebase";
Vue.use(VueClipboard);
export default {
  name: "promotion-config",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  computed: {
    membershipBlock() {
      if (this.promotion.forMembership <= 1) {
        return true;
      }
      if (this.forMembership.some((el) => el == "Membership")) {
        return true;
      }
      return false;
    },
    exclusives() {
      return this.$store.state.promotion.exclusives;
    },

    memberLevels() {
      return this.$store.state.condition.levels;
    },
    promotion() {
      return this.promotionParam;
    },
    publishBlock() {
      let status = this.promotionParam.status;
      if (status == 2 || status == 3) {
        return true;
      }
      return false;
    },
    expiredBlock() {
      let status = this.promotionParam.status;
      if (status == 4) {
        return true;
      }
      return false;
    },
  },
  props: {
    promotionParam: Object,
    paymentVariable: Object,
  },
  components: {},
  data() {
    var validatorGender = (rule, value, callback) => {
      if (this.genders.length == 0) {
        callback(new Error("Please select Gender"));
      } else {
        callback();
      }
    };
    var validatorSaleMode = (rule, value, callback) => {
      if (this.saleModes.length == 0) {
        callback(new Error("Please select Sale Mode"));
      } else {
        callback();
      }
    };
    var validatorApplyBy = (rule, value, callback) => {
      if (this.appliesBy.length == 0) {
        callback(new Error("Please select Apply By"));
      } else {
        callback();
      }
    };
    var validatorForMember = (rule, value, callback) => {
      if (this.forMembership.length == 0) {
        callback(new Error("Please select Target Customer"));
      } else {
        callback();
      }
    };
    var validatorPayment = (rule, value, callback) => {
      if (this.paymentMethods.length == 0) {
        callback(new Error("Please select Payment Method"));
      } else {
        callback();
      }
    };
    var validateLevelMapp = (rule, value, callback) => {
      if (this.promotion.memberLevelMapping.length == 0) {
        callback(new Error("Please select Level"));
      } else {
        callback();
      }
    };

    return {
      imgLoading: false,
      mediaRule: {
        description: [
          {
            required: true,
            message: "Please input Description",
            trigger: ["blur", "change"],
          },
        ],
      },
      formRule: {
        memberLevelMapping: [
          {
            validator: validateLevelMapp,
            message: "Please select Level",
          },
        ],
        paymentMethod: [
          {
            validator: validatorPayment,
            message: "Please select Payment Method",
            trigger: ["blur", "change"],
          },
        ],
        Exclusive: [
          {
            require: true,
            message: "Please select exclusive",
          },
        ],
        gender: [
          {
            validator: validatorGender,
            message: "Please select Gender",
            trigger: ["blur", "change"],
          },
        ],
        saleMode: [
          {
            validator: validatorSaleMode,
            message: "Please select Sale Mode",
            trigger: ["blur", "change"],
          },
        ],
        applyBy: [
          {
            validator: validatorApplyBy,
            message: "Please select Apply By",
            trigger: ["blur", "change"],
          },
        ],
        forMembership: [
          {
            validator: validatorForMember,
            message: "Please select Target Customer",
            trigger: ["blur", "change"],
          },
        ],
      },

      dayFilterOptions: [
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
      exclusive: 0,
      dayFilterParam: 0,
      dayFilterArray: [],
      hourFilterArray: [],
      hourFilterParam: 0,
      hourFilterOptions: [],
      currentLevelIdList: [],
      image: "",
      imageName: "",
      dialogUpload: false,
      isEdit: false,
      isEditDescription: false,
      oldDate: {},
      oldDescription: "",
      saleModes: [],
      appliesBy: [],
      forMembership: [],
      genders: [],
      paymentMethods: [],
      forHoliday: "",
      loading: false,
      selectedLevels: "",
    };
  },
  watch: {
    promotion() {
      // Sale mode
      let saleMode = this.promotion.saleMode;
      this.handleSaleMode(saleMode);
      // Apply by
      let applyBy = this.promotion.applyBy;
      this.handleApplyBy(applyBy);
      // Membership
      let membership = this.promotion.forMembership;
      this.handleMembership(membership);
      // Gender
      let gender = this.promotion.gender;
      this.handleGender(gender);
      // Payment methods
      let payment = this.promotion.paymentMethod;
      this.handlePayment(payment);
      // Holiday
      let forHoliday = this.promotion.forHoliday;
      this.handleHoliday(forHoliday);

      this.setupDayFilterData(this.promotion.dayFilter);
      this.setupHourFilterData(this.promotion.hourFilter);
      this.setupData();
    },
  },

  mounted() {
    // Sale mode
    let saleMode = this.promotion.saleMode;
    this.handleSaleMode(saleMode);
    // Apply by
    let applyBy = this.promotion.applyBy;
    this.handleApplyBy(applyBy);
    // Membership
    let membership = this.promotion.forMembership;
    this.handleMembership(membership);
    // Gender
    let gender = this.promotion.gender;
    this.handleGender(gender);
    // Payment methods
    let payment = this.promotion.paymentMethod;
    this.handlePayment(payment);
    // Holiday
    let forHoliday = this.promotion.forHoliday;
    this.handleHoliday(forHoliday);
  },
  async created() {
    this.addDateFilterOptions();
    // await this.setupData();
  },

  methods: {
    setSelectedLevels() {
      this.currentLevelIdList = this.promotion.memberLevelMapping;
      this.selectedLevels = "";
      let levels = Array.from(this.promotion.memberLevelMapping);
      levels.forEach((id) => {
        let level = this.memberLevels.find((el) => el.memberLevelId == id);
        if (this.selectedLevels == "") {
          this.selectedLevels += level.name;
        } else {
          this.selectedLevels += ", " + level.name;
        }
      });
    },
    async setupData() {
      await this.getMemberLevels();
    },
    async getMemberLevels() {
      await this.$store
        .dispatch("condition/getBrandLevel")
        .then((result) => {
          if (result.status == 200) {
            this.setSelectedLevels();
          } else {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error when get level of member. Code: " + result.status,
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error when get level of member",
            type: "warning",
          });
        });
    },
    updateHourFilter(value) {
      this.loading = true;
      this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
      let promotionDetailUpdate = {
        promotionId: "",
        hourFilter: value,
        updDate: new Date().toLocaleString("vn", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
      };
      this.$store.commit(
        "promotion_detail/setPromotionDetailUpdate",
        promotionDetailUpdate
      );
      this.$store
        .dispatch("promotion_detail/updatePromotionDetail")
        .then(() => {
          this.loading = false;
          this.$message({
            message: "Update successful",
            type: "success",
          });
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
    updateDayFilter(value) {
      this.loading = true;
      this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
      let promotionDetailUpdate = {
        promotionId: "",
        dayFilter: value,
        updDate: new Date().toLocaleString("vn", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
      };
      this.$store.commit(
        "promotion_detail/setPromotionDetailUpdate",
        promotionDetailUpdate
      );
      this.$store
        .dispatch("promotion_detail/updatePromotionDetail")
        .then(() => {
          this.loading = false;
          this.$message({
            message: "Update successful",
            type: "success",
          });
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },

    setupHourFilterData(num) {
      let options = this.hourFilterOptions;
      this.hourFilterArray = [];
      this.hourFilterParam = 0;
      options.forEach((o) => {
        if ((o.value & num) > 0) {
          this.hourFilterArray.push(o.value);
          this.hourFilterParam += o.value;
        }
      });
    },
    setupDayFilterData(num) {
      let options = this.dayFilterOptions;
      this.dayFilterArray = [];
      this.dayFilterParam = 0;
      options.forEach((o) => {
        if ((o.value & num) > 0) {
          this.dayFilterArray.push(o.value);
          this.dayFilterParam += o.value;
        }
      });
    },
    dayFilterChange(value) {
      if (value.length == 0 || value.length == 7) {
        this.setupDayFilterData(127);
      } else {
        this.dayFilterParam = 0;
        value.forEach((v) => {
          this.dayFilterParam += v;
        });
      }
    },
    hourFilterChange(value) {
      if (value.length == 0) {
        let num = 0;
        for (let i = 0; i < 24; i++) {
          num += Math.pow(2, i);
        }
        this.setupHourFilterData(num);
      } else {
        this.hourFilterParam = 0;
        value.forEach((v) => {
          this.hourFilterParam += v;
        });
      }
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
    updateDescription() {
      this.$refs["mediaForm"].validate((valid) => {
        if (valid) {
          // this.loading = true;
          this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
          let promotionDetailUpdate = this.promotion;
          promotionDetailUpdate.memberLevelMapping = null;
          promotionDetailUpdate.promotionStoreMapping = null;
          this.currentLevelIdList.forEach((id) => {
            let map = {
              memberLevelId: id,
              promotionId: this.promotion.promotionId,
            };
            promotionDetailUpdate.memberLevelMapping.push(map);
          });
          this.$store.commit(
            "promotion_detail/setPromotionDetailUpdate",
            promotionDetailUpdate
          );
          this.$store
            .dispatch("promotion_detail/updatePromotionDetail")
            .then((result) => {
              this.loading = false;
              this.oldData = {};
              if (this.isEditDescription) {
                this.isEditDescription = !this.isEditDescription;
              }
              this.promotion.updDate = new Date().toLocaleString("vn", {
                timeZone: "Asia/Ho_Chi_Minh",
              });
              this.dialogUpload = false;
              if (result.status == 200) {
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Success",
                  message: "Update successful",
                  type: "success",
                });
              } else {
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Error",
                  message: "Update error, please try again",
                  type: "warning",
                });
              }
              this.$emit("getPromotionDetail");
            })
            .catch((err) => {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: err,
                type: "warning",
              });
              this.loading = false;
              this.editDescriptionMode();

              this.dialogUpload = false;
            });
        }
      });
    },
    updateInfo() {
      this.$refs["configForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          // Clear store data
          this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
          // Setup update data
          let promotionDetailUpdate = {
            promotionId: "",
            saleMode: this.promotion.saleMode,
            applyBy: this.promotion.applyBy,
            forMembership: this.promotion.forMembership,
            gender: this.promotion.gender,
            paymentMethod: this.promotion.paymentMethod,
            forHoliday: this.promotion.forHoliday,
            exclusive: this.promotion.exclusive,
            endDate: this.promotion.endDate,
            memberLevelMapping: [],
            updDate: new Date().toLocaleString("vn", {
              timeZone: "Asia/Ho_Chi_Minh",
            }),
            isAuto: this.promotion.isAuto,
            hasVoucher: this.promotion.hasVoucher,
          };
          // Setup member level mapping
          this.promotion.memberLevelMapping.forEach((id) => {
            let map = {
              memberLevelId: id,
              promotionId: this.promotion.promotionId,
            };
            promotionDetailUpdate.memberLevelMapping.push(map);
          });

          // Commit data
          this.$store.commit(
            "promotion_detail/setPromotionDetailUpdate",
            promotionDetailUpdate
          );
          this.$store
            .dispatch("promotion_detail/updatePromotionDetail")
            .then((result) => {
              this.loading = false;
              this.oldData = {};
              if (this.isEdit) {
                this.isEdit = !this.isEdit;
              }
              this.promotion.updDate = new Date().toLocaleString("vn", {
                timeZone: "Asia/Ho_Chi_Minh",
              });
              this.dialogUpload = false;
              if (result.status == 200) {
                this.setupData();
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Success",
                  message: "Update successful",
                  type: "success",
                });
              } else {
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Error",
                  message: "Update error, please try again",
                  type: "warning",
                });
              }
            })
            .catch(() => {
              this.loading = false;
              this.editMode();
              this.dialogUpload = false;
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Update error, please try again",
                type: "warning",
              });
            });
        }
      });
    },
    updateImageOfPromotion() {
      this.loading = true;
      this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
      let promotionDetailUpdate = this.promotion;
      promotionDetailUpdate.imgUrl = this.image;
      promotionDetailUpdate.promotionStoreMapping = null;
      this.$store.commit(
        "promotion_detail/setPromotionDetailUpdate",
        promotionDetailUpdate
      );
      this.$store
        .dispatch("promotion_detail/updatePromotionDetail")
        .then((result) => {
          this.loading = false;
          this.oldData = {};
          if (this.isEdit) {
            this.isEdit = !this.isEdit;
          }
          this.promotion.updDate = new Date().toLocaleString("vn", {
            timeZone: "Asia/Ho_Chi_Minh",
          });
          this.promotion.imgUrl = this.image;
          this.dialogUpload = false;
          this.image = {};
          if (result.status == 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Success",
              message: "Update successful",
              type: "success",
            });
            this.$emit("getPromotionDetail");
          }
        })
        .catch(() => {
          this.loading = false;
          this.editMode();
          this.dialogUpload = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Update error, please try again",
            type: "warning",
          });
        });
    },
    editDescriptionMode() {
      this.isEditDescription = !this.isEditDescription;
      if (this.isEditDescription) {
        this.oldDescription = this.promotion.description;
      } else {
        this.promotion.description = this.oldDescription;
        this.oldDescription = "";
      }
      console.log(this.promotion.description);
    },
    editMode() {
      this.isEdit = !this.isEdit;
      if (this.isEdit) {
        this.oldData = {
          saleMode: this.promotion.saleMode,
          applyBy: this.promotion.applyBy,
          forMembership: this.promotion.forMembership,
          gender: this.promotion.gender,
          paymentMethod: this.promotion.paymentMethod,
          forHoliday: this.promotion.forHoliday,
          exclusive: this.promotion.exclusive,
          memberLevelMapping: this.promotion.memberLevelMapping,
          // isForGame: this.promotion.isForGame,
        };
      } else {
        this.handleSaleMode(this.oldData.saleMode);
        this.promotion.saleMode = this.oldData.saleMode;
        this.handleApplyBy(this.oldData.applyBy);
        this.promotion.applyBy = this.oldData.applyBy;
        this.handleMembership(this.oldData.forMembership);
        this.promotion.forMembership = this.oldData.forMembership;
        this.handleGender(this.oldData.gender);
        this.promotion.gender = this.oldData.gender;
        this.handlePayment(this.oldData.paymentMethod);
        this.promotion.paymentMethod = this.oldData.paymentMethod;
        this.handleHoliday(this.oldData.forHoliday);
        this.promotion.forHoliday = this.oldData.forHoliday;
        this.promotion.exclusive = this.oldData.exclusive;
        this.promotion.memberLevelMapping = this.oldData.memberLevelMapping;
        this.oldData = {};
      }
    },
    changeHoliday(value) {
      if (value == "Yes") {
        this.promotion.forHoliday = 1;
      } else {
        this.promotion.forHoliday = 0;
      }
    },
    handleHoliday(value) {
      if (value) {
        this.forHoliday = "Yes";
      } else {
        this.forHoliday = "No";
      }
    },
    changeGender(values) {
      console.log("change gender");
      this.promotion.gender = 0;
      values.forEach((e) => {
        switch (e) {
          case "Male":
            this.promotion.gender += 1;
            break;
          case "Female":
            this.promotion.gender += 2;
            break;
        }
      });
    },
    handleGender(value) {
      this.genders = [];
      if ((value & 1) > 0) {
        this.genders.push("Male");
      }
      if ((value & 2) > 0) {
        this.genders.push("Female");
      }
    },
    changePayment(values) {
      this.promotion.paymentMethod = 0;
      values.forEach((e) => {
        switch (e) {
          case "Cash":
            this.promotion.paymentMethod += this.$ENV.PAYMENT.CASH;
            break;
          case "Credit Cards":
            this.promotion.paymentMethod += this.$ENV.PAYMENT.CREDIT_CARDS;
            break;
          case "Bank Transfers":
            this.promotion.paymentMethod += this.$ENV.PAYMENT.BANK_TRANSFERS;
            break;
          case "eWallets":
            this.promotion.paymentMethod += this.$ENV.PAYMENT.EWALLETS;
            break;
          case "Mobile Banking":
            this.promotion.paymentMethod += this.$ENV.PAYMENT.MOBILE_BANKING;
            break;
          case "COD":
            this.promotion.paymentMethod += this.$ENV.PAYMENT.COD;
            break;
        }
      });
    },
    handlePayment(value) {
      this.paymentMethods = [];
      if ((value & 1) > 0) {
        this.paymentMethods.push("Cash");
      }
      if ((value & 2) > 0) {
        this.paymentMethods.push("Credit Cards");
      }
      if ((value & 4) > 0) {
        this.paymentMethods.push("Bank Transfers");
      }
      if ((value & 8) > 0) {
        this.paymentMethods.push("eWallets");
      }
      if ((value & 16) > 0) {
        this.paymentMethods.push("Mobile Banking");
      }
      if ((value & 32) > 0) {
        this.paymentMethods.push("COD");
      }
    },
    changeSaleMode(values) {
      this.promotion.saleMode = 0;
      values.forEach((e) => {
        switch (e) {
          case "Eat-in":
            this.promotion.saleMode += 1;
            break;
          case "Take-away":
            this.promotion.saleMode += 2;
            break;
          case "Delivery":
            this.promotion.saleMode += 4;
            break;
        }
      });
    },
    handleSaleMode(value) {
      this.saleModes = [];
      if ((value & 1) > 0) {
        this.saleModes.push("Eat-in");
      }
      if ((value & 2) > 0) {
        this.saleModes.push("Take-away");
      }
      if ((value & 4) > 0) {
        this.saleModes.push("Delivery");
      }
    },
    changeMembership(values) {
      this.promotion.forMembership = 0;
      if (values.length != 2) {
        values.forEach((e) => {
          switch (e) {
            case "Membership":
              this.promotion.forMembership = 1;
              break;
            case "Guest":
              this.promotion.forMembership = 2;
              break;
          }
        });
      }
    },
    handleMembership(value) {
      this.forMembership = [];
      if (value == 0) {
        this.forMembership.push("Membership");
        this.forMembership.push("Guest");
      }
      if (value == 1) {
        this.forMembership.push("Membership");
      }
      if (value == 2) {
        this.forMembership.push("Guest");
      }
    },
    changeApplyBy(values) {
      this.promotion.applyBy = 0;
      values.forEach((e) => {
        switch (e) {
          case "Store":
            this.promotion.applyBy += 1;
            break;
          case "Online":
            this.promotion.applyBy += 2;
            break;
        }
      });
    },
    handleApplyBy(value) {
      this.appliesBy = [];
      if ((value & 1) > 0) {
        this.appliesBy.push("Store");
      }
      if ((value & 2) > 0) {
        this.appliesBy.push("Online");
      }
    },

    openUpload() {
      this.dialogUpload = true;
    },
    dialogUploadClose() {
      this.dialogUpload = false;
    },
    expired() {
      this.promotion.status = this.$ENV.PROMOTION_STATUS.EXPIRED;
    },
    publish() {
      this.promotion.status = this.$ENV.PROMOTION_STATUS.PUBLISH;
    },
    cancelImage() {
      if (this.imageData != undefined) {
        this.deleteOldPic();
      }

      this.dialogUpload = false;
    },
    deleteOldPic() {
      const storageRef = firebase.storage().ref(`${this.imageData.name}`);
      storageRef
        .delete()
        .then(() => {
          this.dialogUpload = false;
        })
        .catch(() => {
          this.dialogUpload = false;
          this.$message({
            showClose: true,
            message: "Something was wrong, please try again",
            type: "error",
          });
        });
      this.imageName = "";
      this.image = "";
    },
    async uploadImage(file) {
      this.imgLoading = true;
      if (this.image != "" && this.image != null) {
        this.deleteOldPic();
      }
      this.image = null;
      this.imageData = file.file;

      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.image = url;
            this.imageName = this.imageData.name;
            this.imgLoading = false;
          });
        }
      );
    },
  },
  filters: {
    saleModeFilter(val) {
      let result = "";
      if ((val & 1) > 0) {
        if (result.length == 0) {
          result += "Eat-in";
        } else {
          result += ", Eat-in";
        }
      }
      if ((val & 2) > 0) {
        if (result.length == 0) {
          result += "Take-away";
        } else {
          result += ", Take-away";
        }
      }
      if ((val & 4) > 0) {
        if (result.length == 0) {
          result += "Delivery";
        } else {
          result += ", Delivery";
        }
      }
      return result;
    },
    memberTypeFilter(val) {
      if (val == 0) {
        return "Guest, Membership";
      }
      if (val == 2) {
        return "Guest";
      }
      if (val == 1) {
        return "Membership";
      }
    },

    applyFilter(val) {
      let result = "";
      if ((val & 1) > 0) {
        if (result.length == 0) {
          result += "Store";
        } else {
          result += ", Store";
        }
      }
      if ((val & 2) > 0) {
        if (result.length == 0) {
          result += "Online";
        } else {
          result += ", Online";
        }
      }
      return result;
    },
    paymentFilter(val) {
      let result = "";
      if ((val & 1) > 0) {
        if (result.length == 0) {
          result += "Cash";
        } else {
          result += ", Cash";
        }
      }
      if ((val & 2) > 0) {
        if (result.length == 0) {
          result += "Credit cards";
        } else {
          result += ", Credit cards";
        }
      }
      if ((val & 4) > 0) {
        if (result.length == 0) {
          result += "Bank transfers";
        } else {
          result += ", Bank transfers";
        }
      }
      if ((val & 8) > 0) {
        if (result.length == 0) {
          result += "eWallets";
        } else {
          result += ", eWallets";
        }
      }
      if ((val & 16) > 0) {
        if (result.length == 0) {
          result += "Mobile banking";
        } else {
          result += ", Mobile banking";
        }
      }
      if ((val & 32) > 0) {
        if (result.length == 0) {
          result += "COD";
        } else {
          result += ", COD";
        }
      }
      return result;
    },
    genderFilter(val) {
      let result = "";
      if ((val & 1) > 0) {
        if (result.length == 0) {
          result += "Male";
        } else {
          result += ", Male";
        }
      }
      if ((val & 2) > 0) {
        if (result.length == 0) {
          result += "Female";
        } else {
          result += ", Female";
        }
      }
      return result;
    },
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY HH:mm");
    },

    exclusiveFilter(value) {
      switch (value) {
        case 0: {
          return "None";
        }
        case 1: {
          return "Global";
        }
        case 2: {
          return "Level Order";
        }
        case 3: {
          return "Level Product";
        }
        case 4: {
          return "Level Shipping";
        }
        case 5: {
          return "Level Gift";
        }
      }
    },
  },
};
</script>
<style>
.preview-icon {
  width: 2vw;
  height: 2vw;
}
.custom-card-column {
  border-right: 2px solid rgb(155, 155, 155);
  border-left: 0px;
  border-bottom: 0px;
  border-top: 0px;
  border-radius: 0px;
}
.el-upload-dragger {
  width: 30vw;
  height: 15vw;
  /* background-color: blue; */
}
.el-upload-dragger .el-icon-upload {
  font-size: 4.5vw;
  margin: 4vw 0 1vh;
}
.el-upload-dragger .el-upload__text {
  font-size: 1.2vw;
}
.el-checkbox-button.is-checked .el-checkbox-button__inner {
  color: white;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: white;
}
pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  font-size: 1vw;
  font-family: Arial, Helvetica, sans-serif;
}

#promoConfig .el-form-item__label {
  font-size: 1rem;
  color: black;
}

#promoConfig .el-checkbox__label {
  font-size: 1rem;
}
</style>
