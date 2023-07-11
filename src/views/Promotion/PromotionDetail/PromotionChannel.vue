<template>
  <div v-loading="loading" class="pd-5">
    <el-row class="mt-2">
      <el-col :span="20">
        <h1>DISTRIBUTION INFOMATION</h1>
      </el-col>

      <el-col class="mt-2 mb-2" :span="24">
        <label class="custom-tag">
          <i class="el-icon-warning-outline mr-1"></i> Promotion is distributed to
          <b>{{ channelApply.length }} </b> channel(s)
        </label>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="promotion.hasVoucher ? 10 : 24">
        <el-card>
          <el-row>
            <el-col :span="12">
              <h3>CHANNELS</h3>
            </el-col>

            <el-col :span="12">
              <div class="float-right">
                <!-- <el-button
                  size="small"
                  style="outline: none; border: 0px"
                  type="text text-muted"
                  @click="editMode"
                  >Cancel</el-button
                > -->
                <el-button
                  icon="el-icon-folder-checked"
                  type="success"
                  size="small"
                  @click="saveChannel"
                  >Save changes</el-button
                >
              </div>
            </el-col>
          </el-row>
          <el-row class="mt-2" :gutter="5">
            <el-col :span="24">
              <el-card
                shadow="never"
                class="mb-3 pb-2"
                v-for="(group, index) in groupChannelList"
                :key="index"
              >
                <label class="mb-3">Group {{ group.group }}</label>
                <el-checkbox-group v-model="channelApply">
                  <el-col
                    :span="12"
                    v-for="channel in group.channels"
                    :key="channel.channelId"
                  >
                    <el-checkbox class="mb-3" :label="channel.channelId" size="medium">
                      <span class="mb-0 channel-name-size">
                        <small>
                          {{ channel.channelName }}
                        </small>
                      </span>
                    </el-checkbox>
                  </el-col>
                </el-checkbox-group>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col v-if="promotion.hasVoucher" :span="14">
        <el-card class="mt-0">
          <h3>VOUCHER DISTRIBUTION</h3>
          <label class="mr-2">Select Channel </label>
          <el-select
            style="width: 20vw"
            placeholder="Select channel to view distribution"
            @change="selectChannel"
            v-model="selectedChannelId"
          >
            <el-option
              v-for="(channel, index) in allChannels"
              :key="index"
              :value="channel.channelId"
              :label="channel.channelName"
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
            <!-- <el-table-column label="Number" width="100">
              <template slot-scope="scope">
                <el-tag class="tag-custom" size="small" effect="dark" type="info">
                  {{ scope.row.index }}
                </el-tag>
              </template>
            </el-table-column> -->

            <el-table-column label="Date">
              <template slot-scope="scope">
                <label v-if="scope.row.isRedemped">{{
                  scope.row.redempedDate | formatDate
                }}</label>
              </template>
            </el-table-column>
            <el-table-column label="Game">
              <template slot-scope="scope">
                <div v-if="scope.row.isRedemped">
                  <label v-if="scope.row.gameCampaign">
                    {{ scope.row.gameCampaign.name }}
                  </label>
                  <label v-if="!scope.row.gameCampaign"> N/A </label>
                </div>
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
                <label v-if="!scope.row.isUsed">N/A</label>
                <div v-if="scope.row.isUsed">
                  <label v-if="scope.row.store">
                    {{ scope.row.store.storeName }}
                  </label>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="Used Date">
              <template slot-scope="scope">
                <label v-if="!scope.row.isUsed">No</label>
                <label v-if="scope.row.isUsed">{{
                  scope.row.usedDate | formatDate
                }}</label>
              </template>
            </el-table-column> -->
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
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import moment from "moment";
Vue.use(VueClipboard);
export default {
  name: "promotion-channel",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  filters: {
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY HH:mm");
    },
  },
  props: {
    voucherGroupParam: Object,
    promotionDetail: Object,
  },
  created() {
    this.$emit("loadingStatus", true);
    this.$store
      .dispatch("promotion_detail/getChannelOfPromotion")
      .then(() => {
        this.setupChannelData();
        this.$emit("loadingStatus", false);
      })
      .catch((err) => {
        this.loading = false;
        this.$message({
          message: "PROMOTIONCHANNEL.VUE: " + err.message + ", please try again.",
          type: "error",
        });
      });

    this.$forceUpdate();
  },
  beforeDestroy() {
    this.$store.commit("promotion_detail/setCheckChannelId", "");
    this.$store.commit("promotion_detail/setCheckChannelPageSize", 10);
    this.$store.commit("promotion_detail/setCheckChannelPageIndex", 1);
    this.$store.commit("promotion_detail/setCheckChannelCounter", 0);
    this.$store.commit("promotion_detail/setCheckChannelVoucher", []);
  },
  computed: {
    promotion() {
      return this.promotionDetail;
    },

    checkVouchers() {
      return this.$store.state.promotion_detail.checkChannelVouchers;
    },
    groupChannelList() {
      return this.$store.state.promotion_detail.channelOfPromo;
    },
    channelRedempVoucher() {
      return this.$store.state.promotion_detail.channelVouchers;
    },
    voucherQuantityParam() {
      return this.voucherGroupParam;
    },
  },
  data() {
    return {
      loading: false,
      tableLoading: false,
      channelApply: [],
      isEditInfo: false,
      pageCount: 1,
      pagination: {
        default: 1,
      },
      allChannels: [],
      selectedChannelId: "",
    };
  },

  methods: {
    format(percentage) {
      return percentage
        ? `${percentage}` + "/" + this.voucherQuantityParam.quantity
        : `${percentage}` + "/" + this.voucherQuantityParam.quantity;
    },
    editMode() {
      this.setupChannelData();
    },
    saveChannel() {
      this.loading = true;
      let updateChannel = {
        listChannelId: this.channelApply,
        promotionId: "",
        brandId: "",
      };
      this.$store.commit("promotion_detail/setUpdateChannel", updateChannel);
      this.$store
        .dispatch("promotion_detail/updateChannelOfPromotion")
        .then((result) => {
          this.loading = false;
          if (result.status == 200) {
            this.setupChannelData();
            this.$notify({
              icon: "el-icon-warning",
              title: "Success",
              message: "Update successful",
              type: "success",
            });
          } else {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Update failed, please try again",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Update failed, please try again",
            type: "danger",
          });
        });
    },
    setupChannelData() {
      this.channelApply = [];
      this.allChannels = [];
      this.groupChannelList.forEach((group) => {
        let channels = group.channels;
        channels.forEach((channel) => {
          if (channel.isCheck) {
            this.channelApply.push(channel.channelId);
          }
          this.allChannels.push(channel);
        });
      });
    },
    selectChannel(value) {
      this.$store.commit("promotion_detail/setCheckChannelId", value);
      this.pagination.default = 1;
      this.changePage(1);
    },
    changePage(value) {
      this.tableLoading = true;
      this.$store.commit("promotion_detail/setCheckChannelPageIndex", value);
      this.getVoucherList();
    },
    setPageCount() {
      let pageSize = this.$store.state.promotion_detail.checkChannelPageSize;
      this.pageCount = Math.ceil(
        this.$store.state.promotion_detail.checkChannelCounter / pageSize
      );
    },

    getVoucherList() {
      this.tableLoading = true;
      this.$store.commit("promotion_detail/setPromotionId", this.$route.params.id);
      this.$store
        .dispatch("promotion_detail/checkChannelOfVoucher")
        .then((result) => {
          this.tableLoading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error when checking channel",
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
            message: "Error when checking channel",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style scoped>
.channel-name-size {
  font-size: 1.3rem;
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
