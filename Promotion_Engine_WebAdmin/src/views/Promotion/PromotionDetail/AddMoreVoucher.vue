<template>
  <div v-loading="loading" id="addMoreVoucher">
    <el-card shadow="">
      <el-row>
        <el-col :span="24">
          <span>
            <el-input-number
              style="width: 10vw"
              v-model="addQuantity"
              :max="maxQuantity"
              :min="minQuantity"
            >
            </el-input-number>
            <el-button
              icon="el-icon-plus"
              :disabled="maxQuantity == 0"
              @click="addMore"
              type="primary"
              class="ml-3"
              >Add Voucher</el-button
            >
          </span>
        </el-col>
        <el-col class="mt-3" :span="24">
          <label>
            Maximum quantity of voucher is
            <b>{{ maxQuantity }}</b> voucher(s)
          </label>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";

Vue.use(VueClipboard);
export default {
  name: "add-more-voucher",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  props: {
    voucherGroupId: String,
    quantity: Number,
  },
  data() {
    return {
      loading: false,
      addQuantity: 1,
    };
  },
  computed: {
    beforeAddInfo() {
      return this.$store.state.voucher.beforeAddInfo;
    },
    maxQuantity() {
      return this.beforeAddInfo.availableQuantity;
    },
    minQuantity() {
      if (this.maxQuantity == 0) {
        return 0;
      }
      return 1;
    },
    groupId() {
      return this.voucherGroupId;
    },
  },
  created() {
    this.checkBeforeAdd();
  },
  methods: {
    async checkBeforeAdd() {
      this.loading = true;
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      this.$store
        .dispatch("voucher/checkBeforeAdd")
        .then((res) => {
          this.loading = false;
          if (res.status != 200) {
            this.loading = false;
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get voucher quantity error",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get voucher quantity error",
            type: "danger",
          });
        });
    },
    addMore() {
      this.loading = true;
      this.$store.commit("voucher/setMoreQuantity", this.addQuantity);
      this.$store.commit("voucher/setVoucherGroupId", this.groupId);
      this.$store
        .dispatch("voucher/addMore")
        .then((res) => {
          if (res.status == 200) {
            this.loading = false;
            this.addQuantity = 1;
            this.$emit("getVoucherGroupDetail");
            this.checkBeforeAdd();
            this.$notify({
              icon: "el-icon-circle-check",
              title: "Success",
              message: "Add voucher successfully",
              type: "success",
            });
          } else {
            this.loading = false;
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: res.data.message,
              type: "danger",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: err.message,
            type: "danger",
          });
        });
    },
  },
};
</script>
<style>
#addMoreVoucher .el-input-number__increase {
  display: none;
  width: 0px;
}
#addMoreVoucher .el-input-number__decrease {
  display: none;
  width: 0px;
}
#addMoreVoucher .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
</style>
