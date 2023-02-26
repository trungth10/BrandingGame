<template>
  <div class="pd-5">
    <el-row>
      <el-col :span="24">
        <el-card class="mt-0">
          <h3>TRANSACTION</h3>

          <el-table
            class="mt-3"
            height="400"
            v-loading="tableLoading"
            :data="trans"
            border=""
          >
            <el-table-column label="No." type="index" />
            <el-table-column label="Order ID">
              <template slot-scope="scope">
                <el-tag class="tag-custom" effect="dark" size="medium" type="success">
                  {{ scope.row.order.CustomerOrderInfo.Id }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="Date">
              <template slot-scope="scope">
                <label>
                  {{ scope.row.order.CustomerOrderInfo.BookingDate | formatDate }}</label
                >
              </template>
            </el-table-column>
            <el-table-column label="Discount">
              <template slot-scope="scope">
                <label> {{ scope.row.order.Discount }}</label>
              </template>
            </el-table-column>
            <el-table-column label="Total Amount">
              <template slot-scope="scope">
                <label> {{ scope.row.order.FinalAmount }}</label>
              </template>
            </el-table-column>

            <el-table-column label="Detail">
              <template slot-scope="scope">
                <el-button type="primary" @click="viewTransDetail(scope.row)"
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
    <el-dialog title="Transaction Detail" :visible.sync="dialogVisible" width="80%">
      <trans-detail />
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import moment from "moment";
import TransDetail from "./TransDetail.vue";
Vue.use(VueClipboard);
export default {
  components: { TransDetail },
  name: "promotion-trans",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  filters: {
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY HH:mm");
    },
  },
  props: {},
  created() {
    this.getTransaction();
  },
  computed: {
    trans() {
      return this.$store.state.transaction.transaction;
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
    viewTransDetail(trans) {
      this.$store.commit("transaction/setTransDetail", trans);
      this.dialogVisible = true;
    },
    changePage(value) {
      this.tableLoading = true;
      this.$store.commit("transaction/setPageIndex", value);
      this.getTransaction();
    },
    setPageCount() {
      let pageSize = this.$store.state.transaction.pageSize;
      this.pageCount = Math.ceil(this.$store.state.transaction.counter / pageSize);
    },

    getTransaction() {
      this.tableLoading = true;
      this.$store.commit("transaction/setPromotionId", this.$route.params.id);
      this.$store.commit("transaction/setPageIndex", this.pagination.default);
      this.$store
        .dispatch("transaction/getTransaction")
        .then((result) => {
          this.tableLoading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error when getting transaction",
              type: "danger",
            });
          } else {
            this.setPageCount();
          }
        })
        .catch((err) => {
          this.tableLoading = false;
          console.log(err);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error when getting transaction",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style></style>
