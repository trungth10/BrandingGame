<template>
  <div style="font-size: 17px" v-loading="loading">
    <el-card shadow="never" class="custom-card">
      <el-row class="mb-3">
        <el-col :span="12">
          <h2>GENERAL INFORMATION</h2>
        </el-col>
        <el-col :span="12">
          <span class="float-right">
            <label style="font-size: 0.95vw"
              >Last update: <b>{{ promotion.updDate | formatDate }}</b>
            </label>
            <span>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                v-if="!isEditInfo"
                @click="editMode"
                >Edit</el-button
              >
              <el-button size="mini" type="text" v-if="isEditInfo" @click="editMode"
                >Cancel</el-button
              >
              <el-button
                size="mini"
                icon="el-icon-document"
                type="primary"
                @click="updateInfo"
                v-if="isEditInfo"
                >Save</el-button
              >
            </span>
          </span>
        </el-col>
        <el-col :span="24">
          <el-divider class="mt-1 mb-1"></el-divider>
        </el-col>
      </el-row>
      <el-row v-if="!isEditInfo">
        <el-col :span="16">
          <!-- <i class="el-icon-postcard mr-2"></i> -->
          <label> <b> Name </b>{{ promotion.promotionName }} </label>
        </el-col>
        <el-col :span="8">
          <el-col :span="12">
            <span>
              <label class="mr-2"> <b> PUBLISH </b></label>
              <el-switch
                :disabled="expiredBlock || tierBlock"
                v-model="statusToggle"
                @change="changeToggle"
              >
              </el-switch>
            </span>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-col>

        <el-col :span="24" class="mt-3">
          <el-col :span="8">
            <i class="el-icon-time mr-2"></i>
            <label><b>Start </b>{{ promotion.startDate | formatDate }} </label>
          </el-col>
          <el-col :span="8">
            <label
              ><b>Status </b>

              <el-tag
                effect="dark"
                type="info"
                v-if="promotion.status == $ENV.PROMOTION_STATUS.DRAFT"
              >
                <b> {{ promotion.status | statusFilter }} </b></el-tag
              >
              <el-tag
                effect="dark"
                type="success"
                v-if="
                  promotion.status == $ENV.PROMOTION_STATUS.PUBLISH ||
                  promotion.status == $ENV.PROMOTION_STATUS.UNPUBLISH
                "
              >
                <b> {{ promotion.status | statusFilter }} </b></el-tag
              >
              <el-tag
                effect="dark"
                type="danger"
                v-if="promotion.status == $ENV.PROMOTION_STATUS.EXPIRED"
              >
                <b> {{ promotion.status | statusFilter }} </b></el-tag
              >
            </label>
          </el-col>
          <el-col :span="8">
            <el-button
              :disabled="expiredBlock"
              type="danger"
              @click="expirePromo"
              plain
              size="medium"
              icon="el-icon-check"
            >
              EXPIRE</el-button
            >
          </el-col>
        </el-col>
        <el-col :span="24" class="mt-3">
          <el-col :span="8">
            <i class="el-icon-time mr-2"></i>
            <label><b> End </b>{{ promotion.endDate | formatDate }} </label>
          </el-col>
          <el-col :span="8">
            <label v-if="!promotion.isAuto">
              <b>Promo Code </b>
              <el-tag style="font-size: 16px" effect="dark" type="warning text-white">
                <b> {{ promotion.promotionCode }}</b>
              </el-tag>
            </label>
          </el-col>
          <el-col :span="8">
            <el-tag v-if="promotion.isAuto" effect="dark" type="warning">
              <p style="font-size: 1.1rem">Automatic promotion</p>
            </el-tag>
            <el-tag type="success" v-if="promotion.hasVoucher" effect="dark">
              <p style="font-size: 1.1rem">Promotion using voucher code</p>
            </el-tag>
            <el-tag v-if="!promotion.hasVoucher && !promotion.isAuto" effect="dark">
              <p style="font-size: 1.1rem">Promotion using promo code</p>
            </el-tag>
          </el-col>
        </el-col>
      </el-row>

      <el-form
        v-if="isEditInfo && !publishBlock && !expiredBlock"
        ref="generalInfo"
        :rules="generalRule"
        :model="promotion"
        label-width="5.5vw"
        label-position="left"
      >
        <el-row class="mt-3">
          <el-col :span="12">
            <el-form-item label="Name" prop="promotionName">
              <el-input
                type="text"
                :maxlength="100"
                :readonly="!isEditInfo"
                placeholder="Please input"
                v-model="promotion.promotionName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="Start date" prop="startDate">
              <el-date-picker
                @change="changeStartDate"
                :readonly="!isEditInfo"
                format="dd-MM-yyyy"
                type="date"
                placeholder="Pick a date"
                v-model="promotion.startDate"
                :picker-options="pickerOptionsStartDate"
                :clearable="false"
                class="custom-datepicker"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-time-picker
                @change="changeStartDate"
                :readonly="!isEditInfo"
                placeholder="Pick a time"
                :clearable="false"
                format="HH:mm"
                v-model="promotion.startDate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="End date">
              <el-date-picker
                v-if="promotion !== undefined"
                :readonly="!isEditInfo"
                format="dd-MM-yyyy"
                type="date"
                placeholder="Pick a date"
                v-model="promotion.endDate"
                :picker-options="pickerOptionEndDate"
                :clearable="false"
                :disabled="isUnlimited"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-time-picker
                v-if="promotion !== undefined"
                :readonly="!isEditInfo"
                placeholder="Pick a time"
                format="HH:mm"
                v-model="promotion.endDate"
                :clearable="false"
                :disabled="isUnlimited"
                :default-value="
                  promotion.startDate != null && promotion.startDate != ''
                    ? promotion.startDate + 1
                    : new Date()
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-checkbox
              :disabled="!isEditInfo"
              v-model="isUnlimited"
              @change="unlimitHandle"
              id="startDateCheckBox"
            >
              Unlimited
            </el-checkbox>
          </el-col>
        </el-row>
      </el-form>

      <el-form
        v-if="isEditInfo && (publishBlock || expiredBlock)"
        ref="generalInfo"
        :rules="generalRule"
        :model="promotion"
        label-width="5.5vw"
        label-position="left"
      >
        <el-row class="mt-3">
          <el-col :span="16">
            <!-- <i class="el-icon-postcard mr-2"></i> -->
            <label> <b> Name </b>{{ promotion.promotionName }} </label>
          </el-col>
        </el-row>

        <el-row class="mt-3">
          <el-col :span="8">
            <i class="el-icon-time mr-2"></i>
            <label><b>Start </b>{{ promotion.startDate | formatDate }} </label>
          </el-col>
          <el-col :span="6">
            <label
              ><b>Status </b>

              <el-tag
                effect="dark"
                type="info"
                v-if="promotion.status == $ENV.PROMOTION_STATUS.DRAFT"
              >
                <b> {{ promotion.status | statusFilter }} </b></el-tag
              >
              <el-tag
                effect="dark"
                type="success"
                v-if="
                  promotion.status == $ENV.PROMOTION_STATUS.PUBLISH ||
                  promotion.status == $ENV.PROMOTION_STATUS.UNPUBLISH
                "
              >
                <b> {{ promotion.status | statusFilter }} </b></el-tag
              >
              <el-tag
                effect="dark"
                type="danger"
                v-if="promotion.status == $ENV.PROMOTION_STATUS.EXPIRED"
              >
                <b> {{ promotion.status | statusFilter }} </b></el-tag
              >
            </label>
          </el-col>
          <el-col :span="10">
            <el-tag v-if="promotion.isAuto" effect="dark" type="warning">
              <p style="font-size: 1.1rem">Automatic promotion</p>
            </el-tag>
            <el-tag type="success" v-if="promotion.hasVoucher" effect="dark">
              <p style="font-size: 1.1rem">Promotion using voucher code</p>
            </el-tag>
            <el-tag v-if="!promotion.hasVoucher && !promotion.isAuto" effect="dark">
              <p style="font-size: 1.1rem">Promotion using promo code</p>
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="mt-3">
          <el-col :span="6">
            <el-form-item label="End date">
              <el-date-picker
                v-if="promotion !== undefined"
                :readonly="!isEditInfo"
                format="dd-MM-yyyy"
                type="date"
                placeholder="Pick a date"
                v-model="promotion.endDate"
                :picker-options="pickerOptionEndDate"
                :clearable="false"
                :disabled="isUnlimited"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-time-picker
                v-if="promotion !== undefined"
                :readonly="!isEditInfo"
                placeholder="Pick a time"
                format="HH:mm"
                v-model="promotion.endDate"
                :clearable="false"
                :disabled="isUnlimited"
                :default-value="
                  promotion.startDate != null && promotion.startDate != ''
                    ? promotion.startDate + 1
                    : new Date()
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-checkbox
              :disabled="!isEditInfo"
              v-model="isUnlimited"
              @change="unlimitHandle"
              id="startDateCheckBox"
            >
              Unlimited
            </el-checkbox>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import moment from "moment";
Vue.use(VueClipboard);
export default {
  name: "promotion-info",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  computed: {
    publishBlock() {
      let status = this.promotionParam.status;
      if (
        status == this.$ENV.PROMOTION_STATUS.PUBLISH ||
        status == this.$ENV.PROMOTION_STATUS.UNPUBLISH
      ) {
        return true;
      }
      return false;
    },
    tierBlock() {
      let notExistTier = !this.promotionTiers || this.promotionTiers.length == 0;
      return notExistTier;
    },
    expiredBlock() {
      let status = this.promotionParam.status;
      if (status == "4") {
        return true;
      }
      return false;
    },
    promotion() {
      // return this.$store.state.promotion_detail.promotionInfo;
      return this.promotionParam;
    },
    isUnlimitedDate() {
      return this.promotion.endDate == null;
    },
    promotionStatus() {
      return this.promotionParam.status;
    },
  },
  props: {
    promotionParam: Object,
    paymentVariable: Object,
    promotionTiers: Array,
  },
  components: {},
  data() {
    return {
      pickerOptionEndDate: {
        disabledDate: this.handleDueDate,
      },
      pickerOptionsStartDate: {
        disabledDate(time) {
          return (
            time.getTime() <= new Date().getTime()
            // new Date(new Date().setDate(new Date().getDate() - 1)).getTime()
          );
        },
      },
      generalRule: {
        startDate: [
          {
            required: true,
            message: "Please select start date",
            trigger: ["blur", "change"],
          },
        ],
        promotionName: [
          {
            required: true,
            message: "Please input name",
            trigger: ["blur", "change"],
          },
        ],
      },
      loading: false,
      isUnlimited: false,
      isEditInfo: false,
      oldData: {},
      startTimeRange: "00:00:00" - "23:59:59",
      endTimeRange: "00:00:00" - "23:59:59",
      statusToggle: false,
    };
  },
  watch: {
    isUnlimitedDate() {
      this.isUnlimited = this.isUnlimitedDate;
    },
    promotionStatus() {
      this.statusToggle = this.promotion.status == this.$ENV.PROMOTION_STATUS.PUBLISH;
    },
  },
  created() {
    this.isUnlimited = this.isUnlimitedDate;
  },
  mounted() {},
  methods: {
    handleDueDate(date) {
      let startDate = new Date(this.promotion.startDate);
      return !(date.getTime() > startDate.getTime());
    },
    changeStartDate() {
      if (!this.isUnlimited) {
        if (this.promotion.endDate != "") {
          if (this.promotion.endDate.getTime() <= this.promotion.startDate.getTime()) {
            this.promotion.endDate = new Date(
              this.promotion.startDate.getTime() + 24 * 60 * 60 * 1000
            );
          }
        } else {
          this.promotion.endDate = new Date(
            this.promotion.startDate.getTime() + 24 * 60 * 60 * 1000
          );
        }
      }
    },
    expirePromo() {
      this.$confirm(
        "Do you want to expire promotion. After expired, you cannot publish it again. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        this.updateStatus(this.$ENV.PROMOTION_STATUS.EXPIRED);
      });
    },
    changeToggle(value) {
      if (this.promotion.status == this.$ENV.PROMOTION_STATUS.DRAFT) {
        this.$confirm(
          "After publishing promotion, you can only update end date. Continue?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            if (value) {
              this.updateStatus(this.$ENV.PROMOTION_STATUS.PUBLISH);
            } else {
              this.updateStatus(this.$ENV.PROMOTION_STATUS.UNPUBLISH);
            }
          })
          .catch(() => {
            this.statusToggle = false;
          });
      } else {
        if (value) {
          this.updateStatus(this.$ENV.PROMOTION_STATUS.PUBLISH);
        } else {
          this.updateStatus(this.$ENV.PROMOTION_STATUS.UNPUBLISH);
        }
      }
    },
    unlimitHandle(value) {
      if (value) {
        this.promotion.endDate = null;
      } else {
        this.promotion.endDate = new Date(
          new Date(this.promotion.startDate).getTime() + 24 * 60 * 60 * 1000
        );
      }
    },
    updateInfo() {
      this.$refs["generalInfo"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
          let promotionDetailUpdate = {
            promotionId: "",
            promotionName: this.promotion.promotionName,
            startDate: this.promotion.startDate.toLocaleString("vn", {
              timeZone: "Asia/Ho_Chi_Minh",
            }),
            endDate:
              this.promotion.endDate != null
                ? this.promotion.endDate.toLocaleString("vn", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })
                : this.promotion.endDate,
            updDate: new Date().toLocaleString("vn", {
              timeZone: "Asia/Ho_Chi_Minh",
            }),
            isAuto: this.promotion.isAuto,
            hasVoucher: this.promotion.hasVoucher,
            exlusive: -1,
          };
          this.$store.commit(
            "promotion_detail/setPromotionDetailUpdate",
            promotionDetailUpdate
          );
          this.$store
            .dispatch("promotion_detail/updatePromotionDetail")
            .then(() => {
              this.loading = false;
              this.oldData = {};
              this.isEditInfo = !this.isEditInfo;
              this.promotion.updDate = new Date().toLocaleString("vn", {
                timeZone: "Asia/Ho_Chi_Minh",
              });
              this.$message({
                message: "Update successful",
                type: "success",
              });
            })
            .catch((err) => {
              // this.$emit("loadingStatus", false);
              this.loading = false;
              this.editMode();
              this.$message({
                message: err.message + ", please try again.",
                type: "error",
              });
            });
        }
      });
    },

    editMode() {
      this.isEditInfo = !this.isEditInfo;
      if (this.isEditInfo) {
        this.oldData = {
          promotionName: this.promotion.promotionName,
          startDate: this.promotion.startDate,
          endDate: this.promotion.endDate,
        };
      } else {
        this.promotion.promotionName = this.oldData.promotionName;
        this.promotion.startDate = this.oldData.startDate;
        this.promotion.endDate = this.oldData.endDate;
        this.isUnlimited = this.promotion.endDate == null;
        this.oldData = {};
        this.reloadWhenCancel();
      }
    },
    reloadWhenCancel() {
      this.loading = true;
      this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
      let promotionDetailUpdate = {
        promotionId: "",
        promotionName: this.promotion.promotionName,
        startDate: this.promotion.startDate.toLocaleString("vn", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
        endDate:
          this.promotion.endDate != null
            ? this.promotion.endDate.toLocaleString("vn", {
                timeZone: "Asia/Ho_Chi_Minh",
              })
            : this.promotion.endDate,
        updDate: new Date().toLocaleString("vn", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
        isAuto: this.promotion.isAuto,
        hasVoucher: this.promotion.hasVoucher,
        exlusive: -1,
      };
      this.$store.commit(
        "promotion_detail/setPromotionDetailUpdate",
        promotionDetailUpdate
      );
      this.$store
        .dispatch("promotion_detail/updatePromotionDetail")
        .then(() => {
          this.loading = false;
          this.promotion.updDate = new Date().toLocaleString("vn", {
            timeZone: "Asia/Ho_Chi_Minh",
          });
        })
        .catch(() => {
          // this.$emit("loadingStatus", false);
          this.loading = false;
        });
    },
    deletePromotion() {
      this.$confirm("Do you want to delete promotion ?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.$message({
          type: "success",
          message: "Delete completed",
        });
      });
    },

    handleMemberLevelBeforeUpdate(promotionDetailUpdate) {
      let levels = promotionDetailUpdate.memberLevelMapping;
      let promotionId = promotionDetailUpdate.promotionId;
      console.log("promo id", promotionId);
      if (levels && levels.length > 0) {
        let mapp = [];
        levels.forEach((level) => {
          let obj = {
            memberLevelId: level,
            promotionId: promotionId,
          };
          mapp.push(obj);
        });
        promotionDetailUpdate.memberLevelMapping = mapp;
      }
      promotionDetailUpdate.promotionStoreMapping = null;
      return promotionDetailUpdate;
    },

    updateStatus(value) {
      let old = this.promotion.status;
      this.loading = true;
      this.$store.commit("promotion_detail/setPromotionDetailUpdate", {});
      let promotionDetailUpdate = this.promotion;
      promotionDetailUpdate.status = value;
      promotionDetailUpdate = this.handleMemberLevelBeforeUpdate(promotionDetailUpdate);
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
          this.promotion.updDate = new Date().toLocaleString("vn", {
            timeZone: "Asia/Ho_Chi_Minh",
          });
          this.$store.commit("promotion_detail/setStatus", value);
        })
        .catch((err) => {
          this.promotion.status = old;
          this.$store.commit("promotion_detail/setStatus", old);
          this.loading = false;
          this.statusToggle = !this.statusToggle;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
  },
  filters: {
    discountTypeFilter(value) {
      switch (value) {
        case "1": {
          return "Discount amount (VNĐ)";
        }
        case "2": {
          return "Discount percentage (%)";
        }
        case "3": {
          return "Discount unit";
        }
        case "4": {
          return "Discount shipping fee";
        }
        case "5": {
          return "Fixed price";
        }
        case "6": {
          return "Ladder price";
        }
        case "7": {
          return "Bundle price";
        }
        case "8": {
          return "Gift product";
        }
        case "9": {
          return "Gift voucher";
        }
      }
    },
    statusFilter(param) {
      switch (param) {
        case 1:
          return "DRAFT";
        case 2:
          return "PUBLISH";
        case 3:
          return "UNPUBLISH";
        case 4:
          return "EXPIRED";
      }
    },

    formatDate(value) {
      if (value != null) {
        return moment(value).format("DD/MM/YYYY HH:mm");
      }
      return "Unlimit";
    },
    promotionTypeName(value) {
      switch (value) {
        case "1": {
          return "Discount";
        }
        case "2": {
          return "Automatically";
        }
        case "3": {
          return "Gift";
        }
        case "4": {
          return "Bonus point";
        }
      }
      return value;
    },
  },
};
</script>
<style>
.custom-card-column {
  border-right: 2px solid rgb(155, 155, 155);
  border-left: 0px;
  border-bottom: 0px;
  border-top: 0px;
  border-radius: 0px;
}

.el-date-editor.el-input {
  width: 16.1vw;
}

.vertical-split {
  border-left: 0.3vw solid #2dce89;
  /* min-height: 20vh; */
  padding-left: 10px;
  margin: 0px;
}
.vertical-split-right {
  border-right: 0.3vw solid #2dce89;
  /* min-height: 20vh; */
  padding-left: 10px;
  margin: 0px;
}
</style>
