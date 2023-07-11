<template>
  <div class="card shadow pl-3 pr-3" id="voucher-group-table">
    <div class="card-header border-0 pt-3 pb-2 pr-2 mr-1">
      <div class="row align-items-center">
        <!--//# Search Voucher -->
        <div class="col-12 pl-1 pr-1">
          <el-input
            class="float-right"
            style="width: 30vw"
            size="medium"
            placeholder="Search by name"
            v-model="search"
            prefix-icon="fa fa-search "
          />
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <el-table
        ref="filterTable"
        v-loading="loading"
        class="voucher-group-table"
        :data="voucherGroupList.data"
        style="width: 100%; color: #525f7f"
        :header-cell-style="{
          color: '#696969',
          'font-weight': '600',
          'font-size': '1rem !important',
          'background-color': '#f4f4f4',
          'padding-bottom': '1vh',
          'padding-top': '1.2vh',
        }"
        :cell-style="{
          'padding-top': '1.3vh',
          'padding-bottom': '1.3vh',
          'padding-left': '0px',
          'padding-right': '0px',
          'font-size': '1.05rem !important',
          height: '5.5vh',
        }"
      >
        <!-- //# No. -->
        <el-table-column
          label="NO"
          type="index"
          :index="indexMethod"
          class="col"
          :min-width="40"
        />

        <!-- //# Voucher Name -->
        <el-table-column
          prop="voucherName"
          label="NAME"
          column-key="date"
          class="col"
          :min-width="220"
        >
          <template slot-scope="scope">
            <router-link
              style="word-break: break-word"
              class="text-body"
              :to="{
                name: 'Voucher Group Detail',
                params: { id: scope.row.voucherGroupId },
              }"
            >
              {{ scope.row.voucherName }}
            </router-link>
          </template>
        </el-table-column>

        <!-- //# Action Name -->
        <el-table-column label="ACTION NAME" :min-width="200">
          <template slot-scope="scope">
            <span
              style="word-break: break-word"
              v-if="scope.row.action"
              class="mb-0"
            >
              {{ scope.row.action.name }}
            </span>
            <span
              style="word-break: break-word"
              v-if="scope.row.gift"
              class="mb-0"
            >
              {{ scope.row.gift.name }}
            </span>
          </template>
        </el-table-column>

        <!-- //# Total -->
        <el-table-column label="TOTAL" :min-width="100">
          <template slot-scope="scope">
            <span class="mb-0" style="word-break: break-word">
              <i class="fas fa-tags mr-1"></i>
              {{ scope.row.quantity }}
            </span>
          </template>
        </el-table-column>

        <!-- //# Redemped -->
        <el-table-column
          prop="redempedQuantity"
          label="REDEMPED"
          :min-width="100"
        >
          <template slot-scope="scope">
            <span class="mb-0" style="word-break: break-word">
              <i class="fas fa-tags mr-1"></i>
              {{ scope.row.redempedQuantity }} / {{ scope.row.quantity }}
            </span>
          </template>
        </el-table-column>

        <!-- //# Used Quantity -->
        <el-table-column prop="usedQuantity" label="USED" :min-width="100">
          <template slot-scope="scope">
            <span class="mb-0" style="word-break: break-word">
              <i class="fas fa-tags mr-1"></i>
              {{ scope.row.usedQuantity }} / {{ scope.row.quantity }}
            </span>
          </template>
        </el-table-column>

        //# Actions
        <el-table-column align="center" :min-width="70" class="pt-0 pb-0">
          <template slot-scope="scope">
            <el-button
              style="outline: none; border: 0px"
              :disabled="scope.row.promotion != null"
              icon="el-icon-delete-solid"
              class="p-0 m-0 action-button bg-transparent"
              @click="deleteVoucherGroup(scope.row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- //# Pagination -->
    <div
      class="d-flex justify-content-end align-items-center mr-2 mb-2 mt-2"
      :class="type === 'dark' ? 'bg-transparent' : ''"
    >
      <base-pagination
        class="mb-0"
        :page-count="pageCount"
        v-model="pagination.default"
        @input="changePage"
      ></base-pagination>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { debounce } from "debounce";
export default {
  name: "voucher-group-table",
  props: {
    type: {
      type: String,
    },
    title: String,
  },
  data() {
    return {
      voucherGroupParam: "",
      dialogVouchers: false,
      radio: {
        default: 3,
      },
      pagination: {
        default: 1,
      },
      search: "",
      loading: true,
      pageCount: 1,
    };
  },
  computed: {
    detailId() {
      return this.voucherGroupParam;
    },
    voucherGroupList() {
      this.setPageCount();
      return this.$store.state.voucher.voucherList;
    },
  },
  beforeDestroy() {
    this.$store.commit("voucher/setVoucherList", []);
  },
  watch: {
    search() {
      if (this.search !== null) {
        this.$store.commit("voucher/setSearchContent", this.search);
        this.loading = true;
        this.getSearch();
      } else {
        this.getVoucherGroupList();
      }
    },
  },
  methods: {
    openDetail(voucherGroup) {
      // console.log(voucherGroupId);
      let voucherGroupId = voucherGroup.voucherGroupId;
      let promo = voucherGroup.promotion;
      if (promo != null) {
        this.$store.commit("voucher/setDetailPromoCode", promo.promotionCode);
      }
      this.$store.commit("voucher/setVoucherGroupId", voucherGroupId);
      if (this.$refs["voucherDetail"] != undefined) {
        this.$refs["voucherDetail"].getDetailVoucher();
      }
      this.dialogVouchers = true;
    },
    dialogVouchersClose() {
      this.$store.commit("voucher/setDetailPromoCode", "");
      this.$store.commit("voucher/setVoucherGroupId", "");
      this.dialogVouchers = false;
    },

    deleteVoucherGroup(group) {
      let voucherGroupId = group.voucherGroupId;
      if (group.promotionTier.length == 0) {
        this.$confirm("Do you want to delete voucher ?", "Warning", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }).then(() => {
          // this.$emit("loadingStatus", true);
          this.loading = true;
          this.$store.commit("voucher/setVoucherGroupId", voucherGroupId);
          this.$store
            .dispatch("voucher/deleteVoucherGroup")
            .then((response) => {
              this.loading = false;
              if (response.status == 200) {
                this.getVoucherGroupList();
                this.$notify({
                  icon: "el-icon-circle-check",
                  title: "Success",
                  message: "Deleting vouchers, please wait",
                  type: "success",
                });
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
        });
      } else {
        this.$confirm(
          "Sorry, this voucher is being used by some promotions.",
          "Warning",
          {
            confirmButtonText: "OK",
            type: "warning",
          }
        );
      }
    },
    changePage(index) {
      if (this.search !== "") {
        this.$store.commit("voucher/setPageIndex", index);
        this.loading = true;
        this.getSearch();
      } else {
        this.$store.commit("voucher/setPageIndex", index);
        this.loading = true;
        this.getVoucherGroupList();
      }
    },
    setPageCount() {
      let pageSize = this.$store.state.voucher.PageSize;
      this.pageCount = Math.ceil(this.$store.state.voucher.counter / pageSize);
    },
    indexMethod(index) {
      let PageSize = this.$store.state.voucher.PageSize;
      let PageIndex = this.$store.state.voucher.PageIndex;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    //# Search by Voucher Name
    getSearch: debounce(function () {
      this.$store
        .dispatch("voucher/getVoucherList")
        .then(() => {
          this.loading = false;
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
    }, 1000),
    //# Get voucherGroup
    getVoucherGroupList() {
      this.loading = true;
      this.$store.commit("voucher/setActionType", 0);
      this.$store.commit("voucher/setPostActionType", 0);
      this.$store
        .dispatch("voucher/getVoucherList")
        .then(() => {
          this.loading = false;
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
  created() {
    //# Get Voucher Groups
    this.getVoucherGroupList();
  },
  destroyed() {
    this.$store.commit("voucher/setPageIndex", 1);
    this.$store.commit("voucher/setSearchContent", "");
    this.$store.commit("voucher/setVoucherType", "");
  },
  filters: {
    nameFilter(value) {
      if (value.promotion == null) {
        return "";
      }
      return value.promotion.promotionName;
    },
    type: function (type) {
      switch (type) {
        case "1":
          return "Bulk code";
        case "2":
          return "Standalone code";
      }
    },
    dateFormat(value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY, HH:mm:ss");
      }
    },
  },
};
</script>
<style>
#voucher-group-table .el-dropdown-menu .el-button {
  border: 0px;
}
#voucher-group-table .el-table th > .cell {
  display: inline-block !important;
}
#voucher-group-table .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #87d5ff33 !important;
}
#voucher-group-table .voucher-group-table {
  min-height: 63vh;
}
#voucher-group-table .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#voucher-group-table .action-button:hover {
  color: #ff4254;
}
</style>
<style scoped></style>
