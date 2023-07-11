<template>
  <div v-loading="loading" class="p-3" style="background-color: white">
    <h2>Available Vouchers</h2>
    <el-card shadow="">
      <el-table
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="availableVouchers"
        style="width: 100vw"
        class="p-2"
      >
        <el-table-column label="#" type="index" width="100"> </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="scope"> {{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="Quantity">
          <template slot-scope="scope"> {{ scope.row.quantity }}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-row class="mt-3">
      <el-col :span="12">
        <base-pagination
          :page-count="pageCount"
          :value="tableIndex"
          @input="changePage"
        ></base-pagination>
      </el-col>
      <el-col :span="12">
        <el-button
          :disabled="currentRow == null"
          type="primary"
          size="small"
          @click="assignVoucher"
          icon="el-icon-paperclip"
          class="float-right m-2"
        >
          Select Voucher
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";

Vue.use(VueClipboard);
export default {
  name: "available-voucher-table",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  props: {
    promotionId: String,
  },
  data() {
    return {
      loading: false,
      pageCount: 10,
      pagination: {
        default: 1,
      },
      currentRow: null,
    };
  },
  computed: {
    availableVouchers() {
      this.setPageCount();
      return this.$store.state.voucher.availVouchers;
    },
    tableIndex() {
      return this.$store.state.voucher.availPageIndex;
    },
  },
  created() {
    this.getAvailableVouchers();
  },
  methods: {
    getAvailableVouchers() {
      this.loading = true;
      this.$store
        .dispatch("voucher/getAvailableVoucher")
        .then((response) => {
          this.loading = false;
          if (response.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: response.data.message,
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
    assignVoucher() {
      if (this.currentRow != null) {
        this.loading = true;
        this.$store.commit("voucher/setAssignPromoId", this.promotionId);
        this.$store.commit("voucher/setAssignVoucherId", this.currentRow.voucherGroupId);
        this.$store
          .dispatch("voucher/assginVoucher")
          .then((response) => {
            this.loading = false;
            if (response.status == 200) {
              this.$notify({
                icon: "el-icon-circle-check",
                title: "Success",
                message: "Assign voucher successfully",
                type: "success",
              });
              this.$emit("afterAssign");
            } else {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: response.data.message,
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
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    setPageCount() {
      let pageSize = this.$store.state.voucher.availPageSize;
      this.pageCount = Math.ceil(this.$store.state.voucher.availCounter / pageSize);
    },
    changePage(index) {
      this.loading = true;
      this.$store.commit("voucher/setAvailPageIndex", index);
      this.getAvailableVouchers();
    },
  },
};
</script>
<style></style>
