<template>
  <div id="voucherForm" v-loading="loading">
    <base-header type="gradient-success" class="pb-6 mb-3 pt-1"> </base-header>
    <div class="container-fluid mt-3">
      <el-card>
        <el-row>
          <voucher-type
            ref="voucherType"
            v-show="formIndex == 0"
            :promotionId="promotionId"
          />
        </el-row>
        <el-row class="mt-2">
          <el-col :span="24">
            <el-button
              @click="finish"
              type="primary"
              class="mt-3 float-right"
              icon="el-icon-plus"
              >New Voucher
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import VoucherType from "./VoucherForm/VoucherBuilder.vue";
export default {
  name: "voucher-form",
  components: {
    VoucherType,
  },
  created() {
    this.getActionForVoucher();
    this.getPostActionForVoucher();
  },
  computed: {},
  data() {
    return {
      formIndex: 0,
      loading: false,
      promotionType: true,
      isSaved: false,
      promotionId: this.$route.params.promotionId,
    };
  },
  methods: {
    getPostActionForVoucher() {
      this.$store.commit("action/setPageIndexPost", 0);
      this.$store.commit("action/setPageSizePost", 0);
      this.$store.commit("action/setPostActionType", 0);
      this.$store
        .dispatch("gift/getPostActionList")
        .then((result) => {
          this.$store.commit("action/setPageIndexPost", 1);
          this.$store.commit("action/setPageSizePost", 10);
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Cannot get post action",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.$store.commit("action/setPageIndexPost", 1);
          this.$store.commit("action/setPageSizePost", 10);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Cannot get post action",
            type: "danger",
          });
        });
    },
    getActionForVoucher() {
      this.$store.commit("action/setPageIndexAction", 0);
      this.$store.commit("action/setPageSizeAction", 0);
      this.$store.commit("action/setNewActionType", 0);
      this.$store
        .dispatch("action/getAction")
        .then((result) => {
          if (result.status != 200) {
            this.$store.commit("action/setPageIndexAction", 1);
            this.$store.commit("action/setPageSizeAction", 10);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Cannot get action",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.$store.commit("action/setPageIndexAction", 1);
          this.$store.commit("action/setPageSizeAction", 10);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Cannot get action",
            type: "danger",
          });
        });
    },

    redirectVoucherTable() {},
    finish() {
      this.$refs.voucherType.saveVoucher("voucherForm");
    },
  },
};
</script>

<style>
#voucherForm .el-button--text:hover {
  border: unset;
}
</style>
