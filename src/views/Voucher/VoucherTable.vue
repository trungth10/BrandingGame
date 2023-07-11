<template>
  <div id="voucher-table">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="">
          <el-row class="">
            <el-col :span="24">
              <span>
                <el-input v-model="checkCode" placeholder="Type to check voucher code">
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    type="primary text-dark"
                    @click="checkVoucher"
                    >Check</el-button
                  >
                </el-input>
              </span>
            </el-col>
            <el-col class="mt-2" :span="24">
              <el-input
                class="input-with-select text-dark"
                placeholder="Type to search code"
                v-model="search"
              >
                <el-select
                  class="text-dark"
                  slot="prepend"
                  @change="changeStatus"
                  v-model="filterOption"
                >
                  <el-option
                    style="text-dark"
                    v-for="(option, index) in filterOptions"
                    :key="index"
                    :value="option.id"
                    :label="option.value"
                  >
                  </el-option>
                </el-select>
              </el-input>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="10">
        <add-more-voucher
          :voucherGroupId="voucherGroupDetail.voucherGroupId"
          :quantity="voucherGroupDetail.total"
          v-on:getVoucherGroupDetail="getVoucherGroupDetail"
        />
      </el-col>
    </el-row>

    <el-table
      height="350"
      class="mt-4"
      border=""
      ref="filterTable"
      v-loading="loading"
      :data="vouchers"
      cell-class-name="custom-table"
    >
      <el-table-column label="No." type="index" />

      <el-table-column prop="voucherName" label="Code" column-key="date" width="250">
        <template slot-scope="scope">
          <el-tag class="tag-custom" effect="dark" size="medium" type="success">
            {{ scope.row.voucherCode }}
          </el-tag>
          <!-- <el-tag
            v-if="scope.row.promotion != null"
            class="tag-custom"
            size="medium"
            effect="dark"
            type="success"
          >
            {{ scope.row.promotion.promotionCode + "-" + scope.row.voucherCode }}
          </el-tag> -->
        </template>
      </el-table-column>
      <el-table-column prop="redempedQuantity" label="Number" width="100">
        <template slot-scope="scope">
          <el-tag class="tag-custom" size="small" effect="dark" type="info">
            {{ scope.row.index }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Promotion">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.promotion != null && !scope.row.promotion.delFlg"
            style="word-break: break-word"
            type="primary"
            :to="{
              name: 'Promotion detail',
              params: { id: scope.row.promotion.promotionId },
            }"
          >
            {{ scope.row.promotion.promotionName }}
          </router-link>
          <label v-if="scope.row.promotion != null && scope.row.promotion.delFlg">
            {{ scope.row.promotion.promotionName }}</label
          >
          <label v-if="scope.row.promotion == null">N/A</label>
        </template>
      </el-table-column>
      <el-table-column label="Customer" class="col">
        <template slot-scope="scope">
          <label v-if="scope.row.membership == null">N/A</label>
          <label v-if="scope.row.membership != null">{{
            scope.row.membership.fullname
          }}</label>
        </template>
      </el-table-column>
      <el-table-column label="Redemped">
        <template slot-scope="scope">
          <label v-if="!scope.row.isRedemped">No</label>
          <label v-if="scope.row.isRedemped">{{ scope.row.channel.channelName }}</label>
        </template>
      </el-table-column>
      <el-table-column label="Redemp Date">
        <template slot-scope="scope">
          <label v-if="scope.row.isRedemped">{{
            scope.row.redempedDate | formatDate
          }}</label>
        </template>
      </el-table-column>

      <el-table-column prop="usedQuantity" label="Used">
        <template slot-scope="scope">
          {{ scope.row.isUsed | FiltersYesNo }}
        </template>
      </el-table-column>
      <el-table-column label="Used Date">
        <template slot-scope="scope">
          <label v-if="scope.row.isUsed">{{ scope.row.usedDate | formatDate }}</label>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer d-flex justify-content-end">
      <base-pagination
        :page-count="pageCount"
        v-model="pagination.default"
        @input="changePage"
      />
    </div>
    <el-dialog title="Voucher Information" :visible.sync="dialogVisible" width="70%">
      <check-voucher-info />
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from "debounce";
import AddMoreVoucher from "../Promotion/PromotionDetail/AddMoreVoucher.vue";
import CheckVoucherInfo from "./CheckVoucherInfo.vue";
import moment from "moment";
export default {
  components: { AddMoreVoucher, CheckVoucherInfo },
  name: "voucher-list-table",
  props: {},
  filters: {
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY");
    },
    FiltersYesNo(value) {
      if (value) {
        return "Yes";
      }
      return "No";
    },
  },
  data() {
    return {
      dialogVisible: false,
      checkCode: "",
      filterOptions: [
        {
          id: 1,
          value: "All",
        },
        {
          id: 2,
          value: "Unused",
        },
        {
          id: 3,
          value: "Used",
        },
        {
          id: 4,
          value: "Redemped",
        },
      ],
      filterOption: 1,
      voucherGroupParam: "",
      dialogVouchers: false,
      radio: {
        default: 3,
      },
      pagination: {
        default: 1,
      },
      search: "",
      loading: false,
      pageCount: 1,
    };
  },
  computed: {
    voucherGroupDetail() {
      return this.$store.state.voucher.voucherGroupDetail;
    },
    vouchers() {
      this.setPageCount();
      return this.$store.state.voucher.detailVoucher;
    },
    promoCode() {
      return this.$store.state.voucher.detailPromoCode;
    },
  },
  created() {
    this.getVoucherList();
    // this.getSearch();
  },
  watch: {
    search() {
      this.loading = true;
      this.getSearch();
    },
  },
  methods: {
    checkVoucher() {
      if (!this.checkCode || this.checkCode == "") {
        return;
      }
      this.loading = true;
      this.$store.commit("voucher/setCheckCode", this.checkCode);
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      this.$store
        .dispatch("voucher/checkVoucher")
        .then((result) => {
          this.loading = false;
          if (result.status == 200) {
            this.dialogVisible = true;
          } else if (result.status == 204) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Voucher not found",
              type: "warning",
            });
          } else {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Cannot get vouchers",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Cannot get vouchers",
            type: "danger",
          });
        });
    },
    changeStatus() {
      this.loading = true;
      this.pagination.default = 1;
      this.getSearch();
    },
    getSearch: debounce(function () {
      this.$store.commit("voucher/setDetailPageIndex", this.pagination.default);
      if (this.search != "") {
        this.$store.commit("voucher/setSearchCode", this.search);
      } else {
        this.$store.commit("voucher/setSearchCode", null);
      }

      this.$store.commit("voucher/setVoucherStatus", this.filterOption);
      this.$store.commit("voucher/setPromotionId", null);
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      this.$store
        .dispatch("voucher/searchVoucherList")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Cannot get vouchers",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Cannot get vouchers",
            type: "danger",
          });
        });
    }, 1000),
    getVoucherGroupDetail() {
      this.$emit("getVoucherGroupDetail");
      this.getVoucherList();
    },
    setPageCount() {
      let pageSize = this.$store.state.voucher.detailPageSize;
      this.pageCount = Math.ceil(this.$store.state.voucher.detailCounter / pageSize);
    },
    changePage(index) {
      this.loading = true;
      this.$store.commit("voucher/setDetailPageIndex", index);
      this.getSearch();
    },
    getVoucherList() {
      this.loading = true;
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      this.$store
        .dispatch("voucher/getVoucherDetailList")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Cannot get vouchers",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Cannot get vouchers",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style>
.el-dropdown-menu .el-button {
  border: 0px;
}
.custom-table {
  min-height: 3vh;
}
#voucher-table .el-select .el-input {
  width: 8vw;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
<style scoped>
.tag-custom {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: lighter;
  font-size: 14px;
  margin: 0px;
}
</style>
