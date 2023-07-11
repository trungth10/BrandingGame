<template>
  <div class="pd-5">
    <el-row class="mt-2">
      <el-col :span="22">
        <h1>USAGE INFOMATION</h1>
      </el-col>

      <el-col class="mt-2 mb-2" :span="24">
        <label class="custom-tag">
          <i class="el-icon-warning-outline mr-1"></i> Promotion can be used at
          <b>{{ storeAppliedId.length }} </b> store(s)
        </label>
      </el-col>
    </el-row>

    <!-- //# After press edit button -->
    <el-row :gutter="20">
      <el-col :span="promotion.hasVoucher ? 10 : 24">
        <el-card>
          <el-row class="mb-2">
            <el-col :span="12">
              <h3>STORES</h3>
            </el-col>
            <el-col :span="12">
              <el-button
                icon="el-icon-folder-checked"
                class="float-right"
                type="success"
                size="small"
                @click="saveStore"
                >Save changes</el-button
              >
            </el-col>
          </el-row>
          <el-card
            shadow="never"
            class="mb-3 pb-2"
            v-for="(group, index) in groupStoreList"
            :key="index"
          >
            <label class="mb-3">Group {{ group.group }}</label>
            <el-checkbox-group v-model="storeAppliedId">
              <el-col :span="12" v-for="store in group.stores" :key="store.storeId">
                <el-checkbox :label="store.storeId" size="medium">
                  <span class="mb-0 store-name-size">
                    <small>
                      {{ store.storeName | storeNameFilter }}
                    </small>
                  </span>
                </el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-card>
        </el-card>
      </el-col>
      <el-col v-if="promotion.hasVoucher" :span="14">
        <el-card class="mt-0">
          <h3>VOUCHER USAGE</h3>
          <label class="mr-2">Select Store </label>
          <el-select
            style="width: 20vw"
            placeholder="Select store to view usage"
            @change="selectStore"
            v-model="selectedStoreId"
          >
            <el-option
              v-for="(channel, index) in allStores"
              :key="index"
              :value="channel.storeId"
              :label="channel.storeName"
            >
            </el-option>
          </el-select>

          <el-table
            class="mt-3"
            height="400"
            v-loading="tableLoading"
            :data="checkVouchers"
            header-row-class-name="custom-table"
            cell-class-name="custom-table"
            border=""
          >
            <el-table-column label="No." type="index" />
            <el-table-column label="Code">
              <template slot-scope="scope">
                <el-tag class="tag-custom" effect="dark" size="medium" type="success">
                  {{ scope.row.voucherCode }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="Customer">
              <template slot-scope="scope">
                <label v-if="scope.row.membership == null">Guest</label>
                <label v-if="scope.row.membership != null">{{
                  scope.row.membership.fullname
                }}</label>
              </template>
            </el-table-column>

            <el-table-column label="Detail">
              <template slot-scope="scope">
                <el-button type="primary" @click="checkVoucher(scope.row)"
                  >View Detail</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-2 d-flex justify-content-end">
            <base-pagination
              :page-count="pageCount"
              v-model="pagination.default"
              @input="changePage"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- //# get isActive store -->
    <!-- <el-row :gutter="5">
      <el-col :span="24">
        <el-card
          shadow="never"
          class="mb-3 pb-2"
          v-for="(group, index) in groupStoreList"
          :key="index"
        >
          <label class="mb-3">Group {{ group.group }}</label>
          <el-checkbox-group v-model="storeAppliedId">
            <el-col
              :span="6"
              v-for="store in group.stores"
              :key="store.storeId"
            >
              <el-checkbox v-if="store.isCheck" :label="store.storeId" size="medium">
                {{ store.storeCode }}
              </el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-card>
      </el-col>
    </el-row> -->
    <el-dialog title="Voucher Information" :visible.sync="dialogVisible" width="70%">
      <check-voucher-info />
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import CheckVoucherInfo from "../../Voucher/CheckVoucherInfo.vue";
Vue.use(VueClipboard);
export default {
  components: { CheckVoucherInfo },
  name: "promotion-store",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  filters: {
    storeNameFilter(value) {
      let max = 30;
      if (value.length > max) {
        return value.substring(0, max - 3) + "...";
      }
      return value;
    },
  },
  props: {
    voucherGroupParam: Object,
    promotionDetail: Object,
  },
  created() {
    this.$store
      .dispatch("promotion_detail/getStoreOfPromotion")
      .then(() => {
        this.setupStoreData();
      })
      .catch((err) => {
        this.loading = false;
        this.$message({
          message: err.message + ", please try again.",
          type: "error",
        });
      });

    this.$forceUpdate();
  },
  computed: {
    promotion() {
      return this.promotionDetail;
    },
    checkVouchers() {
      return this.$store.state.promotion_detail.checkStoreVouchers;
    },
    groupStoreList() {
      return this.$store.state.promotion_detail.storeOfPromo;
    },
    storeRedempVoucher() {
      return this.$store.state.promotion_detail.storeVouchers;
    },
    voucherQuantityParam() {
      return this.voucherGroupParam;
    },
  },
  watch: {},
  data() {
    return {
      dialogVisible: false,
      allStores: [],
      tableLoading: false,
      storeAppliedId: [],
      isEditInfo: false,
      redemped: 0,
      quantity: 0,
      pageCount: 1,
      pagination: {
        default: 1,
      },
      selectedStoreId: "",
    };
  },

  methods: {
    checkVoucher(voucher) {
      this.loading = true;
      this.$store.commit("voucher/setCheckCode", voucher.voucherCode);
      this.$store.commit("voucher/setVoucherGroupId", voucher.voucherGroupId);
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
    format(percentage) {
      return percentage
        ? `${percentage}` + "/" + this.voucherQuantityParam.quantity
        : `${percentage}` + "/" + this.voucherQuantityParam.quantity;
    },
    editMode() {
      console.log("cliked!");
      this.isEditInfo = !this.isEditInfo;
      if (!this.isEditInfo) {
        this.setupStoreData();
      }
    },
    saveStore() {
      this.$emit("loadingStatus", true);
      let updateStore = {
        listStoreId: this.storeAppliedId,
        promotionId: "",
        brandId: "",
      };
      this.$store.commit("promotion_detail/setUpdateStore", updateStore);
      this.$store
        .dispatch("promotion_detail/updateStoreOfPromotion")
        .then(() => {
          this.isEditInfo = !this.isEditInfo;
          this.setupStoreData();
          this.$emit("loadingStatus", false);
          this.$message({
            message: "Update successful",
            type: "success",
          });
        })
        .catch(() => {
          this.$emit("loadingStatus", false);
          this.$message({
            message: "Update failed",
            type: "error",
          });
        });
    },
    setupStoreData() {
      this.storeAppliedId = [];
      this.allStores = [];
      this.groupStoreList.forEach((group) => {
        let stores = group.stores;
        stores.forEach((store) => {
          if (store.isCheck) {
            this.storeAppliedId.push(store.storeId);
          }
          this.allStores.push(store);
        });
      });
    },
    selectStore(value) {
      this.$store.commit("promotion_detail/setCheckStoreId", value);
      this.pagination.default = 1;
      this.changePage(1);
    },
    changePage(value) {
      this.tableLoading = true;
      this.$store.commit("promotion_detail/setCheckStorePageIndex", value);
      this.getVoucherList();
    },
    setPageCount() {
      let pageSize = this.$store.state.promotion_detail.checkStorePageSize;
      this.pageCount = Math.ceil(
        this.$store.state.promotion_detail.checkStoreCounter / pageSize
      );
    },

    getVoucherList() {
      this.tableLoading = true;
      this.$store.commit("promotion_detail/setPromotionId", this.$route.params.id);
      this.$store
        .dispatch("promotion_detail/checkStoreOfVoucher")
        .then((result) => {
          this.tableLoading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error when checking store",
              type: "danger",
            });
          } else {
            this.setPageCount();
          }
        })
        .catch(() => {
          this.tableLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error when checking store",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style>
.store-name-size {
  font-size: 1.2rem;
  font-weight: 800;
}
.custom-tag {
  font-size: 17px;
  background-color: #faecd8;
  color: #e6a23c;
  padding: 10px;
  width: 100%;
}
</style>
