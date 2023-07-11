<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card style="height: 12vh" class="pb-3">
          <el-row>
            <el-select
              style="width: 60%"
              class="mr-3"
              v-model="channelSelectId"
              @change="selectChannel"
              placeholder="Select Channel"
            >
              <el-option
                v-for="(channel, index) in channels"
                :key="index"
                :label="channel.channelName"
                :value="channel.channelId"
              >
              </el-option>
            </el-select>
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
          <el-table-column label="Redemped Date">
            <template slot-scope="scope">
              <label v-if="scope.row.isRedemped">{{
                scope.row.redempedDate | formatDate
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
import moment from "moment";
export default {
  name: "voucher-check-channel",
  filters: {
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY HH:mm");
    },
  },
  data() {
    return {
      pagination: {
        default: 1,
      },
      loading: false,
      pageCount: 1,
      channelSelectId: "",
      channelLoading: false,
    };
  },
  computed: {
    checkVouchers() {
      return this.$store.state.voucher.checkChannelVouchers;
    },
    channels() {
      return this.$store.state.channel.channelForVoucher;
    },
  },
  props: {
    promoListParam: Array,
  },
  created() {
    this.getChannels();
  },
  beforeDestroy() {
    this.$store.commit("voucher/setCheckChannelId", "");
    this.$store.commit("voucher/setCheckChannelPageSize", 10);
    this.$store.commit("voucher/setCheckChannelPageIndex", 1);
    this.$store.commit("voucher/setCheckChannelCounter", 0);
    this.$store.commit("voucher/setCheckChannelVoucher", []);
  },
  methods: {
    selectChannel(value) {
      this.$store.commit("voucher/setCheckChannelId", value);
      this.pagination.default = 1;
      this.changePage(1);
    },

    setPageCount() {
      let pageSize = this.$store.state.voucher.checkChannelPageSize;
      this.pageCount = Math.ceil(
        this.$store.state.voucher.checkChannelCounter / pageSize
      );
    },

    changePage(value) {
      this.loading = true;
      this.$store.commit("voucher/setCheckChannelPageIndex", value);
      this.getVoucherList();
    },
    getChannels() {
      this.channelLoading = true;
      this.$store
        .dispatch("channel/getChannelForVoucher")
        .then((result) => {
          this.channelLoading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get channel Error",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.channelLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get channel Error",
            type: "danger",
          });
        });
    },
    getVoucherList() {
      this.loading = true;
      this.$store.commit("voucher/setVoucherGroupId", this.$route.params.id);
      this.$store
        .dispatch("voucher/checkChannelOfVoucher")
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
