<template>
  <div v-loading="loading">
    <base-header type="gradient-success" class="pb-6 mb-3 pt-1"> </base-header>
    <div class="container-fluid">
      <el-card shadow="never">
        <h2>GENERAL INFORMATION</h2>
        <el-divider class="mt-3 mb-3"></el-divider>
        <el-row :gutter="20" justify="start">
          <el-col :span="12">
            <el-card class="my-card" shadow="never">
              <el-row>
                <el-col :span="24">
                  <label style="font-size: 18px">
                    <b> Name: </b> {{ voucherGroupDetail.voucherName }}</label
                  >
                </el-col>
              </el-row>
              <el-row :gutter="20" class="mt-2">
                <el-col
                  v-if="voucherGroupDetail.actionType > $ENV.ACTION_TYPE.EMPTY"
                  :span="12"
                >
                  <span>
                    <label>
                      <b> Action type: </b
                      >{{ voucherGroupDetail.actionType | actionTypeFilter }}
                    </label>
                  </span>
                  <h2>{{ voucherGroupDetail.action.name }}</h2>
                  <el-tag
                    style="font-size: 0.95rem"
                    v-if="voucherGroupDetail.action.delFlg"
                    type="danger"
                  >
                    <i class="el-icon-warning-outline"></i> This action is no longer
                    existed. Please select another action
                  </el-tag>
                  <el-select
                    class="mt-2"
                    v-loading="actionLoading"
                    v-model="voucherGroupDetail.actionId"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(action, index) in actions"
                      :key="index"
                      :label="action.name"
                      :value="action.actionId"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col
                  v-if="voucherGroupDetail.postActionType > $ENV.POST_ACTION_TYPE.EMPTY"
                  :span="12"
                >
                  <span>
                    <label>
                      <b> Action type: </b
                      >{{ voucherGroupDetail.postActionType | postActionTypeFilter }}
                    </label>
                  </span>

                  <h2>{{ voucherGroupDetail.gift.name }}</h2>
                  <el-tag
                    style="font-size: 0.95rem"
                    v-if="voucherGroupDetail.gift.delFlg"
                    type="danger"
                  >
                    <i class="el-icon-warning-outline"></i> This action is no longer
                    existed. Please select another action
                  </el-tag>
                  <el-select
                    class="mt-2"
                    v-loading="giftLoading"
                    v-model="voucherGroupDetail.giftId"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="(gift, index) in gifts"
                      :key="index"
                      :label="gift.name"
                      :value="gift.giftId"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-button type="success" @click="updateGroup" class="float-right"
                    >Update</el-button
                  ></el-col
                >
              </el-row>
              <el-row class="mt-2"> </el-row>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never" class="my-card">
              <el-row>
                <el-col :span="24">
                  <label style="font-size: 18px">
                    <b> Total voucher: </b
                    >{{ voucherGroupDetail.total }} voucher(s)</label
                  >
                </el-col>
              </el-row>
              <el-row class="mt-3">
                <el-col :span="8">
                  <center>
                    <el-progress
                      color="#67C23A"
                      type="circle"
                      :percentage="usedPercent"
                    ></el-progress
                    ><br />
                    <label style="font-size: 17px" class="mt-2"
                      ><b> Used: </b> {{ voucherGroupDetail.usedQuantity }}</label
                    >
                  </center>
                </el-col>
                <el-col :span="8">
                  <center>
                    <el-progress type="circle" :percentage="redempedPercent"></el-progress
                    ><br />
                    <label style="font-size: 17px" class="mt-2"
                      ><b> Redemped: </b> {{ voucherGroupDetail.redempedQuantity }}</label
                    >
                  </center>
                </el-col>
                <el-col :span="8">
                  <center>
                    <el-progress
                      color="#EBB563"
                      type="circle"
                      :percentage="remainPercent"
                    ></el-progress
                    ><br />
                    <label style="font-size: 17px" class="mt-2"
                      ><b> Remain: </b> {{ voucherGroupDetail.remain }}</label
                    >
                  </center>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never" class="mt-3">
        <h2>DETAIL INFORMATION</h2>
        <el-divider class="mt-3 mb-3"></el-divider>
        <el-tabs type="border-card">
          <el-tab-pane label="Voucher List">
            <voucher-table v-on:getVoucherGroupDetail="getVoucherGroupDetail" />
          </el-tab-pane>
          <el-tab-pane label="Promotions">
            <voucher-promo-check :promoListParam="promoList" />
          </el-tab-pane>
          <el-tab-pane label="Distribution">
            <voucher-channel-check />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import VoucherChannelCheck from "./VoucherChannelCheck.vue";
import VoucherPromoCheck from "./VoucherPromoCheck.vue";
import VoucherTable from "./VoucherTable.vue";
export default {
  name: "voucher-detail",
  components: {
    VoucherTable,
    VoucherPromoCheck,
    VoucherChannelCheck,
  },
  data() {
    return {
      pagination: {
        default: 1,
      },
      loading: false,
      actionLoading: false,
      conditionLoading: false,
      giftLoading: false,
      pageCount: 1,
    };
  },
  beforeDestroy() {
    this.$store.commit("voucher/setVoucherGroupDetail", {});
    this.$store.commit("voucher/setCheckVoucherInfo", {});
  },
  computed: {
    voucherGroupDetail() {
      return this.$store.state.voucher.voucherGroupDetail;
    },
    promoList() {
      let result = this.voucherGroupDetail.promoList;
      if (result) {
        return result;
      }
      return [];
    },
    usedPercent() {
      let total = this.voucherGroupDetail.total;
      let used = this.voucherGroupDetail.usedQuantity;
      let result = Math.ceil((used / total) * 100);
      if (result) {
        return result;
      }
      return 0;
    },
    redempedPercent() {
      let total = this.voucherGroupDetail.total;
      let redemped = this.voucherGroupDetail.redempedQuantity;
      let result = Math.ceil((redemped / total) * 100);
      if (result) {
        return result;
      }
      return 0;
    },

    remainPercent() {
      let total = this.voucherGroupDetail.total;
      let remain = this.voucherGroupDetail.remain;
      let result = Math.ceil((remain / total) * 100);
      if (result) {
        return result;
      }
      return 0;
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
  async created() {
    this.loading = true;
    await this.getVoucherGroupDetail();
    await this.getActions();
    await this.getPostActions();
    this.checkDeleteAction();
  },
  methods: {
    updateGroup() {
      this.loading = true;
      this.$store.commit("voucher/setUpdateVoucherGroupParam", this.voucherGroupDetail);
      this.$store
        .dispatch("voucher/updateVoucherGroup")
        .then((result) => {
          this.loading = false;
          if (result.status == 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Success",
              message: "Update successful",
              type: "success",
            });
            this.getVoucherGroupDetail();
          } else {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Update error !",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;

          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Update error !",
            type: "danger",
          });
        });
    },
    checkDeleteAction() {
      if (this.voucherGroupDetail.action != null) {
        let id = this.voucherGroupDetail.actionId;
        if (!this.actions.some((el) => el.actionId == id)) {
          this.voucherGroupDetail.actionId = "";
        }
      } else {
        let id = this.voucherGroupDetail.giftId;
        if (!this.gifts.some((el) => el.giftId == id)) {
          this.voucherGroupDetail.giftId = "";
        }
      }
    },
    async getPostActions() {
      this.giftLoading = true;
      let postActionType = this.voucherGroupDetail.postActionType;
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
      let actionType = this.voucherGroupDetail.actionType;
      console.log("action type:", actionType);
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
    async getVoucherGroupDetail() {
      this.loading = true;
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      await this.$store
        .dispatch("voucher/getVoucherGroupDetail")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get Voucher Detail error !",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get Voucher Detail error !",
            type: "danger",
          });
        });
    },
  },
  filters: {
    actionTypeFilter(value) {
      switch (value) {
        case 1: {
          return "Discount amount of order";
        }
        case 2: {
          1;
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
    redempAndUseFilter(val) {
      if (val) {
        return "Yes";
      }
      return "No";
    },
  },
};
</script>
<style>
.el-dropdown-menu .el-button {
  border: 0px;
}
.my-card {
  height: 35vh;
}
</style>
