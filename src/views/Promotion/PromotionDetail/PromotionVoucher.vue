<template>
  <div v-loading="loading" class="card-body">
    <el-row type="flex" class="" justify="space-between">
      <el-col :span="18">
        <label>VOUCHER INFOMATION</label>
      </el-col>
      <el-col :span="6">
        <span class="float-right">
          <el-button
            icon="el-icon-paperclip"
            size="small"
            type="primary"
            :disabled="voucherBlock || statusBlock"
            @click="openAvailVoucher"
            >Assign Voucher
          </el-button>
          <el-button
            type="success"
            size="small"
            :disabled="
              voucherGroup !== null || doingTask > 0 || voucherBlock || statusBlock
            "
            @click="createVoucher"
            icon="el-icon-plus"
            >New Voucher
          </el-button>
        </span>
      </el-col>
    </el-row>
    <!-- Progress bar -->
    <el-row type="flex" class="mb-1" v-if="doingTask > 0">
      <el-col :span="24">
        <div class="progress">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            aria-valuenow="75"
            aria-valuemin="0"
            aria-valuemax="100"
            style="width: 100%"
          ></div>
        </div>
      </el-col>
    </el-row>
    <el-card
      shadow="never"
      class="custom-card mb-3 mt-3"
      v-if="voucherGroup === undefined || voucherGroup === null"
    >
      <center>
        <label style="color: grey">No data</label>
      </center>
    </el-card>
    <el-card
      shadow="never"
      class="custom-card mb-3 mt-3"
      v-if="voucherGroup !== undefined && voucherGroup !== null"
    >
      <el-row class="ml-3 mr-3">
        <el-col :span="19">
          <label v-if="voucherGroup !== undefined && voucherGroup !== null">
            <b> Name:</b>
            {{ voucherGroup.voucherName }}</label
          >
        </el-col>
      </el-row>
      <el-row class="ml-3 mt-3 mr-3">
        <el-col :span="12"
          ><label
            ><b>Type:</b>
            <el-tag effect="dark" type="success" class="ml-2">
              {{ voucherGroup.voucherType | typeName }}
            </el-tag>
          </label>
        </el-col>
        <el-col :span="12">
          <label><b>Total:</b> {{ voucherGroup.quantity }} voucher(s)</label>
          <el-button
            class="ml-2"
            icon="el-icon-plus"
            style="border: 0px"
            type="text"
            size="mini"
            :disabled="quantityBlock || voucherTypeBlock"
            @click="openAddMore"
            >Add more</el-button
          >
        </el-col>

        <el-col :span="24" class="mt-3">
          <el-row type="flex" justify="space-between">
            <label>Redemption</label>
            <label>{{ voucherGroup.redempedQuantity }} voucher(s)</label>
          </el-row>
          <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="redempedPercentage"
            status="success"
          ></el-progress>
        </el-col>
        <el-col :span="24" class="mt-3">
          <el-row type="flex" justify="space-between">
            <label>Used</label>
            <label>{{ voucherGroup.usedQuantity }} voucher(s)</label>
          </el-row>
          <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="usedPercentage"
            status="warning"
          ></el-progress>
        </el-col>
        <el-col class="mt-3" :span="24">
          <div class="float-right">
            <el-button
              type="success"
              @click="viewVoucherList"
              :disabled="doingTask > 0"
              size="small"
              >View detail</el-button
            >
            <el-button
              type="info"
              :disabled="statusBlock"
              @click="rejectVoucher"
              icon="el-icon-close"
              size="small"
              >Reject</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- Dialog view voucher list -->
    <el-dialog
      title="Vouchers"
      :visible.sync="dialogVouchers"
      width="80%"
      :before-close="dialogVouchersClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div v-loading="ruleListLoading">
        <el-card shadow="never" class="custom-card">
          <!-- Table vouchers -->
          <template>
            <el-table :data="vouchers" style="width: 100%">
              <el-table-column label="No." type="index" width="80"> </el-table-column>
              <el-table-column label="Voucher code" width="180">
                <template slot-scope="scope">
                  <span>
                    <label class="mr-2">
                      <el-tag size="medium" type="info text-dark">
                        {{ promotionCode + "-" + scope.row.voucherCode }}
                      </el-tag>
                    </label>

                    <el-button
                      size="medium"
                      type="text"
                      v-clipboard:copy="promotionCode + '-' + scope.row.voucherCode"
                      v-clipboard:success="onCopy"
                      :icon="copyIcon"
                    >
                    </el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Redemped">
                <template slot-scope="scope">
                  {{ scope.row.isRedemped | redempAndUseFilter }}
                </template>
              </el-table-column>
              <el-table-column label="Use">
                <template slot-scope="scope">
                  {{ scope.row.isUsed | redempAndUseFilter }}
                </template>
              </el-table-column>
              <el-table-column label="Redemped date">
                <template slot-scope="scope">
                  {{ scope.row.redempedDate }}
                </template>
              </el-table-column>

              <el-table-column label="Use date">
                <template slot-scope="scope">
                  {{ scope.row.usedDate }}
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-row
            v-if="voucherGroup !== undefined && voucherGroup !== null"
            type="flex"
            justify="end"
            class="mt-3"
          >
            <el-col :span="24" v-if="doingTask == 0">
              <base-pagination
                class="float-right"
                :page-count="pageCount"
                v-model="pagination.default"
                @input="changePage"
              ></base-pagination>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-dialog>
    <!-- Dialog create voucher -->
    <el-dialog
      title="Create voucher"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <voucher-type
        ref="voucherType"
        v-show="formIndex == 0"
        :promotionId="promotionId"
        v-on:reload="
          {
            dialogVisible = false;
          }
        "
      />
      <el-row class="mt-3">
        <el-col :span="24">
          <div class="float-right">
            <el-button type="info" size="small" @click="handleClose">Cancel</el-button>
            <el-button size="small" @click="finish" type="primary">
              Save & Finish
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- Dialog chọn voucher có sẵn -->

    <el-dialog
      :visible.sync="availVoucherDlg"
      :before-close="afterAssign"
      width="80%"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <available-voucher-table
        ref="voucherTable"
        v-on:afterAssign="afterAssign"
        :promotionId="promotionId"
      />
    </el-dialog>
    <el-dialog
      title="Add Voucher"
      :visible.sync="addMoreDlg"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <add-more-voucher
        v-on:closeAddMore="closeAddMore"
        :voucherGroupId="voucherGroup != undefined ? voucherGroup.voucherGroupId : ''"
        :quantity="voucherGroup != undefined ? voucherGroup.quantity : 0"
      />
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import VoucherType from "../../Voucher/VoucherForm/VoucherBuilder";
import AvailableVoucherTable from "./AvailableVoucherTable.vue";
import AddMoreVoucher from "./AddMoreVoucher.vue";
const MAX_VOUCHER_QUANTITY = 10000;
Vue.use(VueClipboard);
export default {
  name: "promotion-voucher",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  props: {
    voucherGroupParam: Object,
    vouchers: Array,
    promotionId: String,
    loadingParam: Boolean,
    promotionParam: Object,
    promotionCode: String,
  },
  components: {
    VoucherType,
    AvailableVoucherTable,
    AddMoreVoucher,
  },
  computed: {
    quantityBlock() {
      return this.voucherGroup.quantity >= MAX_VOUCHER_QUANTITY;
    },
    voucherTypeBlock() {
      return this.voucherGroup.voucherType == 2;
    },
    statusBlock() {
      return this.promotionParam.status != "1";
    },
    voucherBlock() {
      return this.voucherGroupParam != undefined;
    },
    promotion() {
      return this.promotionParam;
    },
    insertTask() {
      let tasks = this.$store.state.notify.doingTasks.filter(
        (task) =>
          !task.isDone &&
          task.type == "INSERT_VOUCHERS" &&
          task.promotionId == this.promotionId
      );
      // Lấy task trong doneTasks list
      let doneTasks = this.$store.state.notify.doneTasks.filter(
        (task) =>
          task.isDone &&
          task.type == "INSERT_VOUCHERS" &&
          task.promotionId == this.promotionId
      );
      if (doneTasks.length > 0) {
        this.$store.commit("notify/popDoneTasks", doneTasks[0]);
        this.$emit("refeshDetail");
        this.$message({
          message: "Create vouchers successful",
          type: "success",
        });
      }
      return tasks.length;
    },
    deleteTask() {
      // Lấy task trong doingTasks list
      let tasks = this.$store.state.notify.doingTasks.filter(
        (task) =>
          !task.isDone &&
          task.type == "DELETE_VOUCHERS" &&
          task.promotionId == this.promotionId
      );
      // Lấy task trong doneTasks list
      let doneTasks = this.$store.state.notify.doneTasks.filter(
        (task) =>
          task.isDone &&
          task.type == "DELETE_VOUCHERS" &&
          task.promotionId == this.promotionId
      );
      if (doneTasks.length > 0) {
        this.$store.commit("notify/popDoneTasks", doneTasks[0]);
        this.$store.commit("promotion_detail/clearVoucherGroup");
        this.$store.commit("voucher/clearVouchers");
        this.$message({
          message: "Delete vouchers successful",
          type: "success",
        });
      }

      return tasks.length;
    },
    doingTask() {
      let amount = this.insertTask + this.deleteTask;
      if (amount == 0) {
        if (
          this.vouchers.length == 0 &&
          this.voucherGroupParam != {} &&
          this.voucherGroupParam != null
        ) {
          console.log("doingTask");
          // this.$emit("loadingVouchers");
        }
      }
      return amount;
    },
    voucherGroup() {
      return this.voucherGroupParam;
    },
    redempedPercentage() {
      return Math.round(
        (this.voucherGroup.redempedQuantity / this.voucherGroup.quantity) * 100
      );
    },
    usedPercentage() {
      return Math.round(
        (this.voucherGroup.usedQuantity / this.voucherGroup.quantity) * 100
      );
    },
    // loading() {
    //   return this.loadingParam;
    // },
  },
  mounted() {
    if (this.voucherGroup != null) {
      this.isActive = this.voucherGroup.isActive;
    }
  },
  data() {
    return {
      addMoreDlg: false,
      loading: false,
      availVoucherDlg: false,
      copyIcon: "el-icon-document-copy",
      dialogVisible: false,
      dialogVouchers: false,
      ruleListLoading: false,
      formIndex: 0,
      pageCount: 1,
      pagination: {
        default: 1,
      },
      dayFilterParam: 0,
      dayFilterArray: [],
      hourFilterArray: [],
      hourFilterParam: 0,
      hourFilterOptions: [],
      dayFilterOptions: [
        {
          value: Math.pow(2, 0),
          label: "Sunday",
        },
        {
          value: Math.pow(2, 1),
          label: "Monday",
        },
        {
          value: Math.pow(2, 2),
          label: "Tuesday",
        },
        {
          value: Math.pow(2, 3),
          label: "Wednesday",
        },
        {
          value: Math.pow(2, 4),
          label: "Thursday",
        },
        {
          value: Math.pow(2, 5),
          label: "Friday",
        },
        {
          value: Math.pow(2, 6),
          label: "Saturday",
        },
      ],
    };
  },
  filters: {
    dayFilter(value) {
      let result = "";
      if (value == 0 || value == 127) {
        result += "All days in week";
      } else {
        if ((value & Math.pow(2, 0)) > 0) {
          result += "Sunday";
        }
        if ((value & Math.pow(2, 1)) > 0) {
          if (result == "") {
            result += "Monday";
          } else {
            result += ", Monday";
          }
        }
        if ((value & Math.pow(2, 2)) > 0) {
          if (result == "") {
            result += "Tuesday";
          } else {
            result += ", Tuesday";
          }
        }
        if ((value & Math.pow(2, 3)) > 0) {
          if (result == "") {
            result += "Wednesday";
          } else {
            result += ", Wednesday";
          }
        }
        if ((value & Math.pow(2, 4)) > 0) {
          if (result == "") {
            result += "Thursday";
          } else {
            result += ", Thursday";
          }
        }
        if ((value & Math.pow(2, 5)) > 0) {
          if (result == "") {
            result += "Friday";
          } else {
            result += ", Friday";
          }
        }
        if ((value & Math.pow(2, 6)) > 0) {
          if (result == "") {
            result += "Saturday";
          } else {
            result += ", Saturday";
          }
        }
      }
      return result;
    },
    hourFilter(value) {
      let result = "";
      if (value == 0 || value == Math.pow(2, 24)) {
        result += "All hours in day";
      } else {
        for (let i = 0; i <= 24; i++) {
          if ((value & Math.pow(2, i)) > 0) {
            let hour = "";
            if (i < 10) {
              hour += "0" + i + ":00";
            } else {
              hour += i + ":00";
            }
            if (result == "") {
              result += hour;
            } else {
              result += ", " + hour;
            }
          }
        }
      }
      return result;
    },
    typeName(value) {
      if (value == 1) {
        return "Bulk Code";
      } else {
        return "Stand-alone Code";
      }
    },
    redempAndUseFilter(val) {
      if (val) {
        return "Yes";
      }
      return "No";
    },
  },
  methods: {
    closeAddMore() {
      this.addMoreDlg = false;
    },
    openAddMore() {
      this.addMoreDlg = true;
    },
    afterAssign() {
      this.availVoucherDlg = false;
      // this.loading = true;
      this.$emit("refeshDetail");
      // this.loading = false;
    },
    rejectVoucher() {
      this.$confirm("Do you want to reject this voucher?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.loading = true;
        let promotionId = this.promotionId;
        let voucherGroupId = this.voucherGroupParam.voucherGroupId;
        this.$store.commit("voucher/setAssignPromoId", promotionId);
        this.$store.commit("voucher/setAssignVoucherId", voucherGroupId);
        this.$store
          .dispatch("voucher/rejectVoucher")
          .then((response) => {
            this.loading = false;
            this.$emit("refeshDetail");
            if (response.status == 200) {
              this.$notify({
                icon: "el-icon-circle-check",
                title: "Success",
                message: "Reject voucher successfully",
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
    },
    openAvailVoucher() {
      if (this.$refs["voucherTable"] != null) {
        this.$refs["voucherTable"].getAvailableVouchers();
      }
      this.availVoucherDlg = true;
    },
    onCopy() {
      this.copyIcon = "el-icon-check";
      setInterval(function () {
        this.copyIcon = "el-icon-document-copy";
      }, 3000);
    },

    saveTaskToStore(task) {
      this.$store.commit("promotion_detail/addTask", task);
    },
    removeTaskToStore(task) {
      this.$store.commit("promotion_detail/removeTask", task);
    },
    deleteVoucher() {
      this.$confirm("Do you want to delete ?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        // this.$emit("loadingStatus", true);
        this.loading = true;
        let voucherGroupId = this.voucherGroup.voucherGroupId;
        this.$store.commit("promotion_detail/setVoucherGroupId", voucherGroupId);
        this.$store
          .dispatch("promotion_detail/deleteVoucherGroup")
          .then(() => {
            this.$message("Deleting vouchers, please wait");
            // this.$emit("loadingStatus", false);
            this.loading = false;
            this.refeshPage();
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
    },
    changePage(index) {
      // this.$emit("loadingStatus", true);
      this.loading = true;
      this.$store.commit("voucher/setPageIndex", index);
      this.getVouchers();
    },
    getVouchers() {
      this.ruleListLoading = true;
      this.$store.commit("voucher/setPageIndex", 1);
      this.$store
        .dispatch("voucher/getVouchers")
        .then(() => {
          this.setPageCount();
          this.ruleListLoading = false;
        })
        .catch((err) => {
          this.ruleListLoading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: err.message,
            type: "danger",
          });
        });
    },
    setPageCount() {
      let pageSize = this.$store.state.voucher.PageSize;
      this.pageCount = Math.ceil(this.$store.state.voucher.counter / pageSize);
    },
    finish() {
      this.$refs.voucherType.saveVoucher("voucherForm");
      this.setDefaultForm();
      this.dialogVisible = false;
      this.refeshPage();
    },
    reload() {
      this.$emit("refeshDetail");
      this.dialogVisible = false;
      this.refeshPage();
    },
    createVoucher() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.setDefaultForm();
      this.dialogVisible = false;
    },
    dialogVouchersClose() {
      this.dialogVouchers = false;
      this.pagination.default = 1;
    },
    viewVoucherList() {
      console.log("voucherGroup :>> ", this.voucherGroup);
      this.getVouchers();
      this.dialogVouchers = true;
    },
    setDefaultForm() {
      this.$refs.voucherType.setDefault();
    },

    refeshPage() {
      this.pagination.default = 1;
    },
  },
};
</script>
<style></style>
