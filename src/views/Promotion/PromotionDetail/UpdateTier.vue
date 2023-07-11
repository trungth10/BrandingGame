<template>
  <div class="m-0" id="update-tier">
    <div v-loading="loading">
      <el-form :model="promotionTier" :rules="rule" ref="updateTierForm">
        <!-- <el-card shadow=""> -->
        <el-row :gutter="20">
          <el-col :span="promotionDetail.hasVoucher ? 12 : 24">
            <el-row :gutter="10">
              <el-card shadow="never" class="pb-3">
                <h2>TIER SETTING</h2>
                <el-divider class="mt-2 mb-4"></el-divider>
                <el-col
                  class="vertical-split"
                  :span="promotionDetail.hasVoucher ? 11 : 8"
                >
                  <h3>
                    Condition
                    <i
                      v-if="promotionTier.conditionRule.delFlg"
                      class="el-icon-warning-outline text-danger"
                    ></i>
                  </h3>
                  <label v-if="publishBlock || promotionTier.conditionRule.delFlg">
                    {{ conditionName }}
                  </label>
                  <el-form-item
                    v-if="!publishBlock || promotionTier.conditionRule.delFlg"
                    prop="conditionId"
                  >
                    <el-select
                      v-loading="conditionLoading"
                      v-model="promotionTier.conditionRuleId"
                    >
                      <el-option
                        v-for="(condition, index) in conditions"
                        :key="index"
                        :label="condition.ruleName"
                        :value="condition.conditionRuleId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  class="vertical-split"
                  v-if="promotionDetail.actionType > $ENV.ACTION_TYPE.EMPTY"
                  :span="promotionDetail.hasVoucher ? 11 : 8"
                >
                  <h3>
                    Action
                    <i
                      v-if="dispIconAction"
                      class="el-icon-warning-outline text-danger"
                    ></i>
                  </h3>
                  <p style="word-break: break-word">
                    {{ actionName }}
                  </p>
                  <el-form-item v-if="dispSelectAction" prop="actionId">
                    <el-select v-loading="actionLoading" v-model="promotionTier.actionId">
                      <el-option
                        v-for="(action, index) in actions"
                        :key="index"
                        :label="action.name"
                        :value="action.actionId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  class="vertical-split"
                  v-if="promotionDetail.postActionType > $ENV.POST_ACTION_TYPE.EMPTY"
                  :span="promotionDetail.hasVoucher ? 11 : 8"
                >
                  <h3>Action</h3>
                  <p style="word-break: break-word">
                    {{ giftName }}
                  </p>
                  <el-form-item v-if="dispSelectGift" prop="giftId">
                    <el-select v-loading="giftLoading" v-model="promotionTier.giftId">
                      <el-option
                        v-for="(gift, index) in gifts"
                        :key="index"
                        :label="gift.name"
                        :value="gift.giftId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  class="vertical-split"
                  :span="promotionDetail.hasVoucher ? 24 : 8"
                >
                  <h3>Priority</h3>
                  <el-form-item prop="priority">
                    <el-select
                      v-model="promotionTier.priority"
                      placeholder="Select priority"
                    >
                      <el-option
                        v-for="(number, index) in numbers"
                        :key="index"
                        :label="number"
                        :value="number"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-card>
            </el-row>
          </el-col>

          <el-col v-if="promotionDetail.hasVoucher" :span="12">
            <el-row :gutter="20">
              <el-card :class="promotionDetail.hasVoucher ? 'pb-3 ' : ''" shadow="never">
                <h2>Voucher Configuration</h2>
                <el-divider class="mt-2 mb-4"></el-divider>
                <el-col class="vertical-split" style="min-height: 23vh" :span="12">
                  <h3>Voucher Group</h3>
                  <el-form-item prop="voucherGroupId">
                    <el-select
                      v-if="!publishBlock"
                      :disabled="!promotionDetail.hasVoucher"
                      @change="changeSelectVoucher"
                      v-loading="voucherLoading"
                      v-model="promotionTier.voucherGroupId"
                      placeholder="Select Voucher Group"
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
                  <label v-if="publishBlock"> {{ conditionName }} </label>
                  <div class="mt-3" v-if="isChangeNewVoucher">
                    <h3>Quantity of voucher</h3>
                    <el-form-item prop="voucherQuantity">
                      <el-input-number
                        :disabled="!promotionDetail.hasVoucher"
                        :max="maxVoucherQuantity"
                        :min="minVoucherQuantity"
                        v-model="newQuantity"
                      ></el-input-number
                    ></el-form-item>
                  </div>
                  <div class="mt-3" v-if="!isChangeNewVoucher">
                    <h3>Add more voucher for tier</h3>
                    <el-input-number
                      class="mb-0"
                      :disabled="!promotionDetail.hasVoucher"
                      v-model="moreQuantity"
                      :max="maxVoucherQuantity"
                      :min="minVoucherQuantity"
                    ></el-input-number>
                  </div>
                </el-col>
                <el-col class="vertical-split" style="min-height: 23vh" :span="12">
                  <h3>Voucher information</h3>
                  <p>Name: {{ selectedVoucher.voucherName | voucherNameFilter }}</p>
                  <p>
                    Total: {{ selectedVoucher.quantity | voucherNameFilter }} voucher(s)
                  </p>
                  <p>Remain: {{ maxVoucherQuantity }} voucher(s)</p>
                  <p v-if="!isChangeNewVoucher">
                    The tier has {{ promotionTier.voucherQuantity }} voucher(s)
                  </p>
                </el-col>
              </el-card>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button
              class="float-right mt-3"
              type="primary"
              size="medium"
              icon="el-icon-plus"
              @click="updateTier"
              >Update Tier</el-button
            >
          </el-col>
        </el-row>
        <!-- </el-card> -->
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "update-promotion-tier",
  created() {
    this.setupData();
  },
  filters: {
    voucherNameFilter(value) {
      if (!value) {
        return "No data";
      }
      return value;
    },
  },
  watch: {
    minVoucherQuantity() {
      this.promotionTier.fromIndex = this.voucherIndexInfo.fromIndex;
      this.promotionTier.quantity = this.minVoucherQuantity;
    },
  },
  beforeDestroy() {
    this.$store.commit("voucher/setIndexInfo", {});
    this.$store.commit("voucher/setVoucherList", []);
    this.$store.commit("voucher/setActions", []);
    this.$store.commit("voucher/setPostActions", []);
    this.$store.commit("voucher/setConditions", []);
    this.$store.commit("promotion_detail/setTierUpdate", {});
  },
  computed: {
    publishBlock() {
      console.log("publish block");
      let detail = this.$store.state.promotion_detail.promotionDetail;
      let status = detail.status;
      return (
        status == this.$ENV.PROMOTION_STATUS.PUBLISH ||
        status == this.$ENV.PROMOTION_STATUS.UNPUBLISH
      );
    },
    dispIconAction() {
      if (this.tierUpdate.action) {
        return this.tierUpdate.action.delFlg;
      } else {
        return false;
      }
    },
    dispLabelAction() {
      if (this.promotionDetail.hasVoucher) {
        return true;
      } else {
        return true;
      }
    },
    dispSelectAction() {
      if (this.promotionDetail.hasVoucher) {
        return false;
      } else {
        if (this.tierUpdate.action) {
          return this.tierUpdate.action.delFlg;
        } else {
          return false;
        }
      }
    },
    dispSelectGift() {
      if (this.promotionDetail.hasVoucher) {
        return false;
      } else {
        if (this.tierUpdate.gift) {
          return this.tierUpdate.gift.delFlg;
        } else {
          return false;
        }
      }
    },
    promotionDetail() {
      return this.$store.state.promotion_detail.promotionDetail;
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
      return 0;
    },
    vouchers() {
      return this.$store.state.voucher.voucherList.data;
    },
    actions() {
      return this.$store.state.voucher.actions;
    },
    gifts() {
      return this.$store.state.voucher.gifts;
    },
    conditions() {
      return this.$store.state.voucher.conditions;
    },
    tierUpdate() {
      return this.$store.state.promotion_detail.tierUpdate;
    },
  },

  props: {
    actionType: Number,
    postActionType: Number,
    tierIndex: Number,
    // promotionDetail: Object,
  },
  data() {
    var conditionRuleIdValidator = (rule, value, callback) => {
      if (this.promotionTier.conditionRuleId == "") {
        callback(new Error("Please select condition"));
      } else {
        callback();
      }
    };
    var actionIdValidator = (rule, value, callback) => {
      if (this.promotionTier.actionId == "") {
        callback(new Error("Please select discount action"));
      } else {
        callback();
      }
    };
    var giftIdValidator = (rule, value, callback) => {
      if (this.promotionTier.giftId == "") {
        callback(new Error("Please select gift action"));
      } else {
        callback();
      }
    };
    var voucherGroupIdValidator = (rule, value, callback) => {
      if (this.promotionTier.voucherGroupId == "") {
        callback(new Error("Please select voucher group"));
      } else {
        callback();
      }
    };
    var priorityValidator = (rule, value, callback) => {
      if (this.promotionTier.priority == 0) {
        callback(new Error("Please select priority"));
      }
      if (
        this.promotionDetail.promotionTier.some(
          (el) =>
            el.priority == this.promotionTier.priority &&
            el.promotionTierId != this.promotionTier.promotionTierId
        )
      ) {
        callback(new Error("Priority is not the same between each tier"));
      }
      callback();
    };
    var voucherQuantityValidator = (rule, value, callback) => {
      if (this.newQuantity == 0) {
        callback(new Error("Please input quantity"));
      } else {
        callback();
      }
    };

    return {
      rule: {
        voucherQuantity: [
          {
            validator: voucherQuantityValidator,
            trigger: ["blur", "change"],
            message: "Please input quantity",
          },
        ],
        conditionId: [
          {
            validator: conditionRuleIdValidator,
            trigger: ["blur", "change"],
            message: "Please select condition",
          },
        ],
        priority: [
          {
            validator: priorityValidator,
            trigger: ["blur", "change"],
          },
        ],
        actionId: [
          {
            validator: actionIdValidator,
            trigger: ["blur", "change"],
            message: "Please select discount action",
          },
        ],
        giftId: [
          {
            validator: giftIdValidator,
            trigger: ["blur", "change"],
            message: "Please select gift action",
          },
        ],
        voucherGroupId: [
          {
            validator: voucherGroupIdValidator,
            trigger: ["blur", "change"],
            message: "Please select voucherd",
          },
        ],
      },
      validateFields: [
        "conditionRuleId",
        "voucherGroupId",
        "giftId",
        "actionId",
        "priority",
        "conditionRuleId",
      ],
      currentVoucherGroup: "",
      isChangeNewVoucher: false,
      numbers: [],
      loading: false,
      actionLoading: false,
      conditionLoading: false,
      giftLoading: false,
      voucherLoading: false,
      promotionTier: {
        promotionId: "",
        fromIndex: 0,
        toIndex: 0,
        quantity: 0,
        tierIndex: 0,
        voucherGroupId: "",
        conditionRuleId: "",
        actionId: "",
        conditionRule: {},
        giftId: "",
      },
      newQuantity: 0,
      moreQuantity: 0,
      giftName: this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text,
      actionName: this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text,
      selectedVoucher: {},
      conditionName: this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text,
      voucherGroupName: this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text,
    };
  },
  methods: {
    clearData() {
      this.promotionTier = {
        promotionId: "",
        fromIndex: 0,
        toIndex: 0,
        quantity: 0,
        tierIndex: 0,
        voucherGroupId: "",
        conditionRuleId: "",
        conditionRule: {},
        actionId: "",
        giftId: "",
      };
      this.giftName = this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text;
      this.actionName = this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text;
      this.conditionName = this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text;
      this.voucherGroupName = this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text;
      this.moreQuantity = 0;
      this.currentVoucherGroup = "";
      this.isChangeNewVoucher = false;
      this.selectedVoucher = {};
      this.$refs["updateTierForm"].clearValidate(this.validateFields);
    },
    async setupData() {
      this.loading = true;
      this.numbers = [];
      for (let i = 1; i <= 100; i++) {
        this.numbers.push(i);
      }
      await this.getVoucherGroups();
      await this.getConditions();
      await this.getActions();
      await this.getPostActions();
      this.promotionTier = this.tierUpdate;
      this.currentVoucherGroup = this.promotionTier.voucherGroupId;
      this.setActionName();
      if (this.promotionDetail.hasVoucher) {
        this.selectedVoucher = this.promotionTier.voucherGroup;
        if (
          this.vouchers.some(
            (el) => el.voucherGroupId == this.promotionTier.voucherGroupId
          )
        ) {
          this.checkIndexInfo(this.promotionTier.voucherGroupId);
        }

        this.setVoucherGroupName();
      }
      this.setConditionName();

      this.loading = false;
    },
    setVoucherGroupName() {
      let id = this.promotionTier.voucherGroupId;
      let name = this.vouchers.find((o) => o.voucherGroupId == id);
      if (name) {
        this.voucherGroupName = name.voucherGroupName;
      } else {
        this.promotionTier.voucherGroupId = "";
      }
    },
    setConditionName() {
      let id = this.promotionTier.conditionRuleId;
      let name = this.conditions.find((o) => o.conditionRuleId == id);
      if (name) {
        this.conditionName = name.ruleName;
      } else {
        this.conditionName = this.tierUpdate.conditionRule.ruleName;
        this.promotionTier.conditionRuleId = "";
      }
    },
    updateTier() {
      this.$refs["updateTierForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.promotionDetail.hasVoucher && !this.isChangeNewVoucher) {
            this.promotionTier.moreQuantity = this.moreQuantity;
          } else {
            this.promotionTier.voucherQuantity = this.newQuantity;
          }

          this.$store.commit(
            "promotion_detail/setUpdatePromotionTierParam",
            this.promotionTier
          );
          this.$store
            .dispatch("promotion_detail/updatePromotionTier")
            .then((result) => {
              this.loading = false;
              if (result.status == 200) {
                if (!result.data) {
                  this.$emit("getPromotionDetail");
                  this.$notify({
                    title: "Error",
                    message: "Error when update, please try again",
                    type: "danger",
                  });
                } else {
                  this.$notify({
                    title: "Success",
                    message: "Update successful",
                    type: "success",
                  });
                  this.$emit("closeDialog");
                }
              } else {
                this.$notify({
                  title: "Error",
                  message: "Error when update, please try again",
                  type: "danger",
                });
              }
            })
            .catch(() => {
              this.loading = false;
              this.$notify({
                title: "Error",
                message: "Error when update, please try again",
                type: "danger",
              });
            });
        }
      });
    },
    checkIndexInfo(id) {
      this.voucherLoading = true;
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
          } else {
            let indexInfo = this.voucherIndexInfo;
            this.promotionTier.fromIndex = indexInfo.fromIndex;
          }

          this.voucherLoading = false;
        })
        .catch(() => {
          this.voucherLoading = false;
          this.$notify({
            title: "Error",
            message: "Cannot get Voucher info",
            type: "danger",
          });
        });
    },
    setActionName() {
      if (this.promotionDetail.postActionType > this.$ENV.POST_ACTION_TYPE.EMPTY) {
        this.giftName = this.promotionTier.gift.name;
        if (this.promotionTier.gift.delFlg) {
          this.promotionTier.giftId = "";
        }
      }
      if (this.promotionDetail.actionType > this.$ENV.ACTION_TYPE.EMPTY) {
        this.actionName = this.promotionTier.action.name;
        if (this.promotionTier.action.delFlg) {
          this.promotionTier.actionId = "";
        }
      }
    },
    changeSelectVoucher(value) {
      let voucher = this.vouchers.find((o) => o.voucherGroupId == value);
      if (voucher.gift) {
        this.giftName = voucher.gift.name;
      }
      if (voucher.action) {
        this.actionName = voucher.action.name;
      }
      this.selectedVoucher = voucher;
      this.promotionTier.actionId = voucher.actionId;
      this.promotionTier.giftId = voucher.giftId;
      if (value == this.currentVoucherGroup) {
        this.moreQuantity = 0;
        this.newQuantity = 0;
        this.isChangeNewVoucher = false;
      } else {
        this.moreQuantity = 0;
        this.isChangeNewVoucher = true;
      }
      this.checkIndexInfo(value);
    },
    async getVoucherGroups() {
      this.voucherLoading = true;
      this.$store.commit("voucher/setActionType", this.actionType);
      this.$store.commit("voucher/setPostActionType", this.postActionType);
      this.$store.commit("voucher/setPageSize", 0);
      this.$store.commit("voucher/setPageIndex", 0);
      await this.$store
        .dispatch("voucher/getVoucherList")
        .then((result) => {
          this.voucherLoading = false;
          this.$store.commit("voucher/setPageSize", 10);
          this.$store.commit("voucher/setPageIndex", 1);

          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get Voucher error !",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.$store.commit("voucher/setPageSize", 10);
          this.$store.commit("voucher/setPageIndex", 1);
          this.voucherLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get Voucher error !",
            type: "danger",
          });
        });
    },

    async getConditions() {
      this.conditionLoading = true;
      await this.$store
        .dispatch("voucher/getConditions")
        .then((result) => {
          this.conditionLoading = false;
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
          this.conditionLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get Condition error !",
            type: "danger",
          });
        });
    },
    async getPostActions() {
      this.giftLoading = true;
      let postActionType = this.discountType;
      this.$store.commit("voucher/setPostActionType", postActionType);
      await this.$store
        .dispatch("voucher/getPostAction")
        .then((result) => {
          this.giftLoading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get Gift error !",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.giftLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get Gift error !",
            type: "danger",
          });
        });
    },
    async getActions() {
      this.actionLoading = true;
      let actionType = this.actionType;
      this.$store.commit("voucher/setActionType", actionType);
      await this.$store
        .dispatch("voucher/getAction")
        .then((result) => {
          this.actionLoading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get Action error !",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.actionLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get Action error !",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style>
#update-tier .el-input-number__increase {
  display: none;
  width: 0px;
}
#update-tier .el-input-number__decrease {
  display: none;
  width: 0px;
}
#update-tier .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
#update-tier .el-input-number {
  width: 90%;
}
</style>
<style scoped>
.vertical-split {
  border-left: 0.3vw solid #2dce89;
  min-height: 8vh;
  padding-left: 10px;
  margin: 0px;
}
</style>
