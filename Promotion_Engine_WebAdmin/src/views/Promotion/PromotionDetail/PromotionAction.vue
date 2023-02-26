<template>
  <div v-loading="loading">
    <div class="card-body">
      <el-row type="flex" justify="end">
        <el-col :span="24">
          <h2>PROMOTION TIER</h2>
        </el-col>
      </el-row>

      <el-row v-if="promotionTiers" class="mt-2">
        <el-col :span="24">
          <label class="custom-tag">
            <i class="el-icon-warning-outline mr-1"></i> Promotion has
            <b>{{ promotionTiers.length }}</b> tier(s)
          </label>
        </el-col>
        <el-col :span="10">
          <label
            v-if="actionType != $ENV.ACTION_TYPE.EMPTY"
            class="mt-2"
            style="color: black; font-size: 20x"
          >
            <b> Action Type: </b> {{ promotionDetailParam.actionType | actionTypeFilter }}
          </label>
          <label
            v-if="postActionType != $ENV.POST_ACTION_TYPE.EMPTY"
            class="mt-2"
            style="color: black; font-size: 20x"
          >
            <b> Gift Type: </b>
            {{ promotionDetailParam.postActionType | postActionTypeFilter }}
          </label>
        </el-col>
        <el-col :span="14">
          <span class="float-right">
            <el-button
              :disabled="publishBlock || expiredBlock"
              icon="el-icon-plus"
              class="float-right"
              type="success"
              @click="openDialog"
              >New Promotion Tier</el-button
            >
          </span>
        </el-col>
      </el-row>
      <el-card
        shadow="never"
        v-if="!promotionTiers || promotionTiers.length == 0"
        class="mb-4 mt-3 custom-card-2"
      >
        <center>
          <label style="color: grey">No data</label>
        </center>
      </el-card>
      <el-card
        shadow="never"
        v-for="(tier, tIndex) in promotionTiers"
        :key="tier.id"
        class="mb-4 mt-3 custom-card-2"
      >
        <el-row v-if="promotionTiers && promotionTiers.length > 0">
          <el-row>
            <el-col :span="8">
              <h3>PROMOTION TIER {{ tIndex + 1 }}</h3>
            </el-col>
            <el-col :span="11">
              <label class="float-right">
                <b> Priority: </b>
                {{ tier.priority }}
              </label>
            </el-col>
            <el-col v-if="!publishBlock && !expiredBlock" :span="5">
              <!-- :disabled="publishBlock || expiredBlock" -->
              <el-button
                class="float-right"
                type="info"
                size="mini"
                icon="el-icon-close"
                plain
                @click="deletePromotionTier(tier)"
              ></el-button>
            </el-col>
          </el-row>
          <el-col :span="24">
            <el-divider class="mt-2 mb-3"></el-divider>
          </el-col>

          <el-row class="ml-3">
            <el-col v-if="promotionDetail.hasVoucher" class="vertical-split" :span="8">
              <h3>
                VOUCHER GROUP
                <i
                  v-if="
                    (tier.action && tier.action.delFlg) || (tier.gift && tier.gift.delFlg)
                  "
                  class="el-icon-warning-outline text-danger"
                ></i>
              </h3>
              <router-link
                style="word-break: break-word"
                type="primary"
                :to="{
                  name: 'Voucher Group Detail',
                  params: { id: tier.voucherGroup.voucherGroupId },
                }"
              >
                {{ tier.voucherGroup.voucherName }}
              </router-link>
            </el-col>
            <el-col v-if="tier.conditionRule != null" class="vertical-split" :span="8">
              <h3>
                CONDITION
                <i
                  v-if="tier.conditionRule && tier.conditionRule.delFlg"
                  class="el-icon-warning-outline text-danger"
                ></i>
              </h3>
              <router-link
                v-if="tier.conditionRule && !tier.conditionRule.delFlg"
                style="word-break: break-word"
                type="primary"
                :to="{
                  name: 'Condition Detail',
                  params: { id: tier.conditionRule.conditionRuleId },
                }"
              >
                {{ tier.conditionRule.ruleName }}
              </router-link>
              <div v-if="tier.conditionRule && tier.conditionRule.delFlg">
                <p>{{ tier.conditionRule.ruleName }}</p>
              </div>
            </el-col>
            <el-col
              v-if="actionType > $ENV.ACTION_TYPE.EMPTY"
              class="vertical-split"
              :span="8"
            >
              <h3>
                ACTION
                <i
                  v-if="tier.action && tier.action.delFlg"
                  class="el-icon-warning-outline text-danger"
                ></i>
              </h3>
              <el-button
                v-if="tier.action && !tier.action.delFlg"
                @click="openActionDetail(tier.actionId)"
                type="text"
                style="font-size: 1rem"
                class="m-0 p-0 text-blue"
              >
                {{ tier.action.name }}</el-button
              >
              <div v-if="tier.action && tier.action.delFlg">
                <p>{{ tier.action.name }}</p>
              </div>
            </el-col>
            <el-col
              v-if="postActionType > $ENV.POST_ACTION_TYPE.EMPTY"
              class="vertical-split"
              :span="8"
            >
              <h3>
                GIFT
                <i
                  v-if="tier.gift && tier.gift.delFlg"
                  class="el-icon-warning-outline text-danger"
                ></i>
              </h3>

              <p>
                {{ tier.gift.name }}
              </p>
            </el-col>
          </el-row>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button
              style="outline: 0px; border: 0px"
              class="float-right p-0 m-0"
              type="text"
              size="medium"
              @click="viewCondUpd(tier)"
              >View detail</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-divider class="mt-1 mb-2"></el-divider>
          <el-tag
            v-if="tier.conditionRule && tier.conditionRule.delFlg"
            style="font-size: 0.95rem"
            type="danger"
          >
            <i class="el-icon-warning-outline"></i> Condition has been deleted. Please
            select another condition </el-tag
          ><br />
          <el-tag
            class="mt-1"
            v-if="tier.action && tier.action.delFlg"
            style="font-size: 0.95rem"
            type="danger"
          >
            <i class="el-icon-warning-outline"></i>
            Action has been deleted. Please select another action </el-tag
          ><br />
          <el-tag
            class="mt-1"
            v-if="tier.gift && tier.gift.delFlg"
            style="font-size: 0.95rem"
            type="danger"
          >
            <i class="el-icon-warning-outline"></i>
            Action has been deleted. Please select another action
          </el-tag>
        </el-row>
      </el-card>
    </div>
    <!-- Dialog update tier -->
    <el-dialog
      id="upd-condition"
      title="UPDATE PROMOTION TIER"
      :visible.sync="updCondDiaglog"
      width="80vw"
      :before-close="updateDialogClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <!-- :promotionDetail="promotionDetailParam" -->
      <update-tier
        ref="updateTier"
        :postActionType="promotionDetailParam.postActionType"
        :actionType="promotionDetailParam.actionType"
        :tierIndex="promotionTiers.length"
        v-on:closeDialog="updateDialogClose"
        v-on:getPromotionDetail="getPromotionDetail"
        v-on:viewCondUpd="viewCondUpd"
      />
    </el-dialog>

    <!-- Dialog tạo promotion tier -->
    <el-dialog
      custom-class="my-custom-dialog"
      title="CREATE PROMOTION TIER"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :before-close="createDialogClose"
      width="80vw"
    >
      <create-tier
        ref="createTier"
        :promotionDetail="promotionDetailParam"
        :postActionType="promotionDetailParam.postActionType"
        :actionType="promotionDetailParam.actionType"
        :tierIndex="promotionTiers.length"
        v-on:closeDialog="createDialogClose"
      />
    </el-dialog>
    <el-dialog title="UPDATE ACTION" width="55%" :visible.sync="dialogTableVisible">
      <action-detail ref="actionDetailDialog" />
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import CreateTier from "./CreateTier.vue";
import UpdateTier from "./UpdateTier.vue";
import ActionDetail from "../../Action/ActionDetail.vue";
Vue.use(VueClipboard);
export default {
  name: "promotion-action",
  directives: {
    "b-tooltip": BTooltipDirective,
  },

  props: {
    promotionDetail: Object,
    promotionTierParam: Array,
    promotionId: String,
  },
  components: {
    CreateTier,
    UpdateTier,
    ActionDetail,
  },
  data() {
    return {
      dialogTableVisible: false,
      actionIdUpdate: "",
      giftIdUpdate: "",
      voucherGroupIdUpdate: "",
      conditionRuleIdUpdate: "",
      createLoading: false,
      dlgLoading: false,
      dialogRuleVisible: false,
      updCondDiaglog: false,
      updActDiaglog: false,
      dialogVisible: false,
      loading: false,
      updateConditionRule: {},
      updateActionParam: {},
      updatePostActionParam: {},
    };
  },
  created() {},
  watch: {},
  computed: {
    promotionTiers() {
      if (this.promotionTierParam) {
        return this.promotionTierParam;
      } else {
        return [];
      }
    },
    actionType() {
      return this.promotionDetail.actionType;
    },
    postActionType() {
      return this.promotionDetail.postActionType;
    },
    hasVoucherBlock() {
      return this.promotionDetail.hasVoucher;
    },
    publishBlock() {
      let status = this.promotionDetailParam.status;

      if (
        status == this.$ENV.PROMOTION_STATUS.PUBLISH ||
        status == this.$ENV.PROMOTION_STATUS.UNPUBLISH
      ) {
        return true;
      }
      return false;
    },
    expiredBlock() {
      let status = this.promotionDetailParam.status;
      if (status == this.$ENV.PROMOTION_STATUS.EXPIRED) {
        return true;
      }
      return false;
    },
    updateConditionRuleParam() {
      return this.updateConditionRule;
    },
    conditionGroups() {
      return this.$store.state.condition.conditionGroups;
    },
    conditionRule() {
      return this.$store.state.condition.conditionRule;
    },
    action() {
      return this.$store.state.action.actionParam;
    },
    promotionDetailParam() {
      return this.promotionDetail;
    },
  },
  filters: {
    actionTypeFilter(value) {
      switch (value) {
        case 1: {
          return "Discount amount of order";
        }
        case 2: {
          return "Discount percent of order";
        }
        case 3: {
          return "Discount shipping fee of order";
        }
        case 4: {
          return "Discount amount of item";
        }
        case 5: {
          return "Discount percent of item";
        }
        case 6: {
          return "Discount unit of item";
        }
        case 7: {
          return "Fixed price of item";
        }
        case 8: {
          return "Ladder price of item";
        }
        case 9: {
          return "Bundle price of item";
        }
      }
    },

    postActionTypeFilter(value) {
      switch (value) {
        case 1: {
          return "Gift products";
        }
        case 2: {
          return "Gift vouchers";
        }
        case 3: {
          return "Gift points";
        }
        case 4: {
          return "Gift game code";
        }
      }
    },
  },
  methods: {
    openActionDetail(actionId) {
      this.$store.commit("action/setId", actionId);
      if (this.$refs["actionDetailDialog"]) {
        this.$refs["actionDetailDialog"].setupData();
      }
      this.dialogTableVisible = true;
    },
    openRuleDialog() {
      this.dialogRuleVisible = true;
      if (this.$refs["ruleTable"] != null) {
        this.$refs["ruleTable"].getAvailableRules();
      }
    },
    dialogRuleClose() {
      this.dialogRuleVisible = false;
      this.getPromotionTier();
    },
    getPromotionTier() {
      this.loading = true;
      this.$store
        .dispatch("promotion_detail/getPromotionTier")
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            title: "Warning",
            message: err.message + ", please try again.",
            type: "warning",
          });
        });
    },
    createDialogClose() {
      this.clearStoreData();
      this.getPromotionDetail();
      if (this.$refs["createTier"]) {
        this.$refs["createTier"].clearData();
      }
      this.dialogVisible = false;
    },
    clearStoreData() {
      this.$store.commit("voucher/setIndexInfo", {});
      this.$store.commit("voucher/setVoucherList", []);
      this.$store.commit("voucher/setActions", []);
      this.$store.commit("voucher/setPostActions", []);
      this.$store.commit("voucher/setConditions", []);
      this.$store.commit("promotion_detail/setTierUpdate", {});
    },
    updateDialogClose() {
      this.clearStoreData();
      this.getPromotionDetail();
      if (this.$refs["updateTier"]) {
        this.$refs["updateTier"].clearData();
      }
      this.updCondDiaglog = false;
    },
    getPromotionDetail() {
      this.$emit("getPromotionDetail");
    },
    updateTierFunc() {
      this.dlgLoading = true;
      let updatePromotionTierParam = this.$refs["update-tier-drag"].updateTier();
      if (updatePromotionTierParam != undefined) {
        this.$store.commit(
          "promotion_detail/setUpdatePromotionTierParam",
          updatePromotionTierParam
        );
        this.$store
          .dispatch("promotion_detail/updatePromotionTier")
          .then(() => {
            this.handleCloseUpdCond();
            this.$notify({
              title: "Success",
              message: "Update successful",
              type: "success",
            });
            this.dlgLoading = false;
            this.loading = true;
            this.getPromotionTier();
          })
          .catch((err) => {
            this.dlgLoading = false;
            this.$notify({
              title: "Warning",
              message: err.message + ", please try again.",
              type: "warning",
            });
          });
      } else {
        this.dlgLoading = false;
      }
    },
    handleCloseUpdCond() {
      this.updateActionParam = {};
      this.updatePostActionParam = {};
      this.updateConditionRule = {};
      if (this.$refs["update-tier-drag"] != undefined) {
        this.$refs["update-tier-drag"].resetData();
      }
      if (this.$refs["condition-drag"] != undefined) {
        this.$refs["condition-drag"].resetData();
      }

      this.updCondDiaglog = false;
    },
    viewCondUpd(tier) {
      this.$store.commit("promotion_detail/setTierUpdate", tier);
      if (this.$refs["updateTier"]) {
        this.$refs["updateTier"].setupData();
      }
      this.updCondDiaglog = true;
    },
    deletePromotionTier(tier) {
      this.$confirm("This will permanently delete the file. Continue?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.loading = true;
        let id = tier.promotionTierId;
        this.$store.commit("promotion_detail/setDeleteTierId", id);
        this.$store
          .dispatch("promotion_detail/deletePromotionTier")
          .then((result) => {
            this.loading = false;
            if (result.status == 200 && result.data == true) {
              this.$notify({
                title: "Success",
                message: "Delete successful",
                type: "success",
              });
              this.getPromotionDetail();
            } else {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Delete error !",
                type: "danger",
              });
            }
          })
          .catch(() => {
            this.loading = false;
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Delete error !",
              type: "danger",
            });
          });
      });
    },

    openDialog() {
      if (this.$refs["createTier"]) {
        this.$refs["createTier"].clearData();
        this.$refs["createTier"].setupData();
      }
      this.dialogVisible = true;
    },
  },
};
</script>
<style scoped>
/* .my-custom-dialog { */
/* background-color: white; */
/* } */

.custom-tag {
  font-size: 17px;
  background-color: #faecd8;
  color: #e6a23c;
  padding: 10px;
  width: 100%;
}
.vertical-split {
  border-left: 0.3vw solid #2dce89;
  min-height: 10vh;
  padding-left: 10px;
  margin: 0px;
}
</style>
<style>
.el-form--label-top .el-form-item__label {
  padding: 0px;
  margin: 0px 0px 3px 0px;
  font-size: 0.95rem;
  font-family: Arial, Helvetica, sans-serif;
  color: black;
}
/* .el-dialog__body {
  background-color: rgb(240, 240, 240);
  padding-top: 0px;
} */
/* .el-dialog__header {
  background-color: rgb(240, 240, 240);
  padding-bottom: 30px;
} */

/* .custom-collapse-title {
  font-size: 1.1vw;
  font-weight: 500;
} */
.el-dialog__wrapper {
  z-index: 20;
}
.v-modal {
  z-index: 22 !important;
}
</style>
