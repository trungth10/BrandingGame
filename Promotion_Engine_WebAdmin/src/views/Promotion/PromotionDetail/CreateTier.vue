<template>
  <div id="create-tier">
    <div v-loading="loading">
      <el-form :model="promotionTier" :rules="rule" ref="createTierForm">
        <el-card>
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
                    <h3>Condition</h3>
                    <el-form-item prop="conditionRuleId">
                      <el-select
                        style="width: 90%"
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
                    v-if="promotionDetail.actionType > $ENV.ACTION_TYPE.EMPTY"
                    class="vertical-split"
                    :span="promotionDetail.hasVoucher ? 11 : 8"
                  >
                    <h3>Discount action</h3>
                    <p style="word-break: break-word" v-if="promotionDetail.hasVoucher">
                      {{ actionName }}
                    </p>
                    <el-form-item v-if="!promotionDetail.hasVoucher" prop="actionId">
                      <el-select
                        v-loading="actionLoading"
                        v-model="promotionTier.actionId"
                        style="width: 90%"
                      >
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
                    :span="promotionDetail.hasVoucher ? 12 : 8"
                  >
                    <h3>Gift action</h3>
                    <p style="word-break: break-word" v-if="promotionDetail.hasVoucher">
                      {{ giftName }}
                    </p>
                    <el-form-item v-if="!promotionDetail.hasVoucher" prop="giftId">
                      <el-select
                        v-loading="giftLoading"
                        v-model="promotionTier.giftId"
                        style="width: 90%"
                      >
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
                    :class="
                      promotionDetail.hasVoucher
                        ? 'vertical-split mt-2'
                        : 'vertical-split'
                    "
                    :span="promotionDetail.hasVoucher ? 24 : 8"
                  >
                    <h3>Priority of tier</h3>
                    <el-form-item prop="priority">
                      <el-select
                        v-model="promotionTier.priority"
                        placeholder="Select priority"
                        :style="promotionDetail.hasVoucher ? 'width: 40%' : 'width:80%'"
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
            <el-col :span="12">
              <el-row :gutter="20" v-if="promotionDetail.hasVoucher">
                <el-card class="pb-4" shadow="never">
                  <h2>Voucher Configuration</h2>
                  <el-divider class="mt-2 mb-4"></el-divider>
                  <el-col class="vertical-split" style="min-height: 22.5vh" :span="12">
                    <h3>Voucher Group</h3>
                    <el-form-item prop="voucherGroupId">
                      <el-select
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
                    <h3>Quantity of voucher</h3>
                    <el-form-item class="mb-0" prop="voucherQuantity">
                      <el-input-number
                        size="medium"
                        style="width: 80%"
                        v-model="promotionTier.voucherQuantity"
                        :min="minVoucherQuantity"
                        :max="maxVoucherQuantity"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col class="vertical-split" style="min-height: 22.5vh" :span="12">
                    <h3>Voucher information</h3>
                    <p>Name: {{ selectedVoucher.voucherName | voucherNameFilter }}</p>
                    <p>
                      Total: {{ selectedVoucher.quantity | voucherNameFilter }} voucher(s)
                    </p>
                    <p>Remain: {{ maxVoucherQuantity }} voucher(s)</p>
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
                @click="createTier"
                >New Tier</el-button
              >
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "create-promotion-tier",
  created() {
    this.setupData();
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
  },
  props: {
    actionType: Number,
    postActionType: Number,
    tierIndex: Number,
    promotionDetail: Object,
  },
  filters: {
    voucherNameFilter(value) {
      if (!value) {
        return "No data";
      }
      return value;
    },
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
      if (this.promotionTier.giftId == "") {
        callback(new Error("Please select gift action"));
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
          (el) => el.priority == this.promotionTier.priority
        )
      ) {
        callback(new Error("Priority is not the same between each tier"));
      }
      callback();
    };
    var voucherQuantityValidator = (rule, value, callback) => {
      if (this.promotionTier.voucherQuantity == 0) {
        callback(new Error("Please select priority"));
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
        conditionRuleId: [
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
        "voucherQuantity",
      ],
      numbers: [],
      loading: false,
      actionLoading: false,
      conditionLoading: false,
      giftLoading: false,
      voucherLoading: false,
      promotionTier: {
        promotionId: "",
        priority: 0,
        voucherQuantity: 0,
        tierIndex: 0,
        voucherGroupId: "",
        conditionRuleId: "",
        actionId: "",
        giftId: "",
      },
      selectedVoucher: {},
      giftName: this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text,
      actionName: this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text,
    };
  },
  methods: {
    clearData() {
      this.promotionTier = {
        promotionId: "",
        tierIndex: 0,
        priority: 0,
        voucherQuantity: 0,
        voucherGroupId: "",
        conditionRuleId: "",
        actionId: "",
        giftId: "",
      };
      this.selectedVoucher = {};
      this.giftName = this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text;
      this.actionName = this.$ENV.TEXT_EXPLAIN.Action_Welcome_Text;
      this.$refs["createTierForm"].clearValidate(this.validateFields);
    },
    setupData() {
      this.numbers = [];
      for (let i = 1; i <= 100; i++) {
        this.numbers.push(i);
      }
      this.getVoucherGroups();
      this.getConditions();
      this.getActions();
      this.getPostActions();
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
    createTier() {
      this.$refs["createTierForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          let fromIndex = this.promotionTier.fromIndex;
          let quantity = this.promotionTier.quantity;
          let toIndex = quantity - 1 + fromIndex;
          this.promotionTier.toIndex = toIndex > 0 ? toIndex : 0;
          this.promotionTier.tierIndex = this.tierIndex;
          this.promotionTier.promotionId = this.$route.params.id;
          this.$store.commit("promotion/setInsertTierParam", this.promotionTier);
          this.$store
            .dispatch("promotion/CreatePromotionTier")
            .then((result) => {
              this.loading = false;
              if (result.status == 200) {
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Success",
                  message: "Create successful !",
                  type: "success",
                });
                this.$store.commit("voucher/setIndexInfo", {
                  available: false,
                  remain: 0,
                  total: 0,
                });
                this.$emit("closeDialog");
              } else {
                this.loading = false;
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Error",
                  message: " error !",
                  type: "danger",
                });
              }
            })
            .catch(() => {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: " error !",
                type: "danger",
              });
            });
        }
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
      let postActionType = this.postActionType;
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
#create-tier .el-input-number__increase {
  display: none;
  width: 0px;
}
#create-tier .el-input-number__decrease {
  display: none;
  width: 0px;
}
#create-tier .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
#create-tier .el-input-number {
  width: 100%;
}
</style>
<style scoped>
.vertical-split {
  border-left: 0.3vw solid #2dce89;
  min-height: 10vh;
  padding-left: 10px;
  margin: 0px;
}
</style>
