<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card style="height: 12vh" class="pb-3">
          <el-row>
            <el-col :span="5">
              <el-select
                style="width: 95%"
                class="text-dark"
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
            </el-col>
            <el-col :span="19">
              <el-select
                style="width: 100%"
                @change="changeCheckPromo"
                class="mr-3"
                v-model="promoSelectId"
                placeholder="Select Promotion"
              >
                <el-option
                  v-for="(promo, index) in promoListParam"
                  :key="index"
                  :label="promo.promoName"
                  :value="promo.promotionId"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="countLoading" style="height: 12vh">
          <el-row>
            <el-col :span="12">
              <label> <b>Total: </b> {{ countInfo.total }} </label>
            </el-col>
            <el-col :span="12">
              <label> <b>Unused: </b> {{ countInfo.unused }} </label>
            </el-col>
            <el-col :span="12">
              <label> <b>Used: </b> {{ countInfo.used }} </label>
            </el-col>
            <el-col :span="12">
              <label> <b>Redemped: </b> {{ countInfo.redemped }} </label>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="mt-4">
      <el-col :span="24">
        <el-table
          height="400"
          v-loading="loading"
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
          <el-table-column label="Number" width="100">
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
          <el-table-column label="Redemped">
            <template slot-scope="scope">
              <label v-if="!scope.row.isRedemped">No</label>
              <label v-if="scope.row.isRedemped">{{
                scope.row.channel.channelName
              }}</label>
            </template>
          </el-table-column>
          <el-table-column label="Customer">
            <template slot-scope="scope">
              <label v-if="scope.row.membership == null">N/A</label>
              <label v-if="scope.row.membership != null">{{
                scope.row.membership.fullname
              }}</label>
            </template>
          </el-table-column>

          <el-table-column label="Used">
            <template slot-scope="scope">
              <label v-if="!scope.row.isUsed">No</label>
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "voucher-check-promotion",
  filters: {},
  data() {
    return {
      countLoading: false,
      pagination: {
        default: 1,
      },
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
      loading: false,
      pageCount: 1,
      promoSelectId: "",
      promoCode: "",
    };
  },
  computed: {
    promoIdList() {
      return this.promoListParam;
    },
    checkVouchers() {
      return this.$store.state.voucher.checkVouchers;
    },
    countInfo() {
      return this.$store.state.voucher.promoVoucherCount;
    },
  },
  props: {
    promoListParam: Array,
  },
  created() {},
  beforeDestroy() {
    this.$store.commit("voucher/setCheckIndexId", "");
    this.$store.commit("voucher/setCheckPageSize", 10);
    this.$store.commit("voucher/setCheckPageIndex", 1);
    this.$store.commit("voucher/setCheckCounter", 0);
    this.$store.commit("voucher/setCheckVoucher", []);
    this.$store.commit("voucher/setPromoVoucherCount", {
      total: 0,
      redemped: 0,
      unused: 0,
      used: 0,
    });
  },
  methods: {
    changeStatus(value) {
      this.$store.commit("voucher/setCheckStatus", value);
      if (this.promoSelectId != "") {
        this.pagination.default = 1;
        this.changePage(this.pagination.default);
      }
    },
    changeCheckPromo(promotionId) {
      this.loading = true;
      this.promoCode = this.promoIdList.find(
        (o) => o.promotionId == promotionId
      ).promoCode;
      this.$store.commit("voucher/setCheckPageIndex", 1);
      this.$store.commit("voucher/setCheckIndexId", promotionId);
      this.getVoucherList();
      this.getPromoVoucherCount();
      this.pagination.default = 1;
    },
    setPageCount() {
      let pageSize = this.$store.state.voucher.checkPageSize;
      this.pageCount = Math.ceil(this.$store.state.voucher.checkCounter / pageSize);
    },
    getPromoVoucherCount() {
      this.countLoading = true;
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      this.$store
        .dispatch("voucher/getPromoVoucherCount")
        .then((result) => {
          this.countLoading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Check Promotion Error",
              type: "danger",
            });
          } else {
            this.setPageCount();
          }
        })
        .catch(() => {
          this.countLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Check Promotion Error",
            type: "danger",
          });
        });
    },
    changePage(index) {
      if (this.promoSelectId != "") {
        this.loading = true;
        this.$store.commit("voucher/setCheckPageIndex", index);
        this.$store.commit("voucher/setCheckIndexId", this.promoSelectId);
        this.getVoucherList();
      }
    },
    getVoucherList() {
      this.loading = true;
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      this.$store
        .dispatch("voucher/checkPromoOfVoucher")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Check Promotion Error",
              type: "danger",
            });
          } else {
            this.setPageCount();
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Check Promotion Error",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style>
.custom-table {
  height: 4vh;
}
.tag-custom {
  font-size: 15px;
}
</style>
<style scoped></style>
