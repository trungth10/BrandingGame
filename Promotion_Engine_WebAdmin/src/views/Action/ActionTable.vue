<template>
  <div class="card shadow p-3">
    <div class="table-responsive">
      <!-- <div class="card-body"> card shadow -->
      <!-- <el-card class="p-0" shadow="never">
    -->
      <!-- //# Action Table -->
      <el-table
        :data="actionList"
        ref="multipleTable"
        id="action-table"
        v-loading="loading"
        style="width: 100%; color: #525f7f"
        :header-cell-style="{
          color: '#696969',
          'font-weight': '600',
          'font-size': '1rem !important',
          'background-color': '#f4f4f4',
          'padding-bottom': '0.8vh',
          'padding-top': '1.2vh',
        }"
        :cell-style="{
          'padding-top': '1.5vh',
          'padding-bottom': '1.5vh',
          'padding-left': '0px',
          'padding-right': '0px',
          'font-size': '1.05rem !important',
          height: '5.5vh',
        }"
      >
        <el-table-column type="index" label="No" :index="indexMethod" width="50" />

        <!-- //# Table - Action Name -->
        <el-table-column prop="name" label="Name" class="pt-0 pb-0" width="270">
          <template slot-scope="scope">
            <el-link
              style="word-break: break-word; font-size: 1.05rem"
              class="text-body"
              :underline="false"
              @click="openDialog(scope.row.actionId)"
            >
              {{ scope.row.name }}
              <!-- <i class="el-icon-edit" /> -->
            </el-link>
          </template>
        </el-table-column>

        <!-- //# Table - Action Type -->
        <el-table-column prop="actionType" label="Type" class="pt-0 pb-0">
          <template slot-scope="scope">
            <span style="word-break: break-word" class="mb-0">
              {{ scope.row.actionType | actionTypeFilter }}
            </span></template
          >
        </el-table-column>

        <!-- //# Table - Insert Date -->
        <el-table-column prop="insDate" label="Created date" class="pt-0 pb-0">
          <template slot-scope="scope"
            ><i class="el-icon-time mr-1"></i>
            {{ scope.row.insDate | dateFormat }}</template
          >
        </el-table-column>

        <!-- //# Table - Update Date -->
        <el-table-column prop="updDate" label="Updated date" class="pt-0 pb-0">
          <template slot-scope="scope"
            ><i class="el-icon-time mr-1"></i>
            {{ scope.row.updDate | dateFormat }}</template
          >
        </el-table-column>

        <!-- //# Table - Actions -->
        <el-table-column label="" align="center" width="70" class="pt-0 pb-0">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete-solid"
              style="outline: none; border: 0px"
              class="p-0 m-0 bg-transparent"
              @click="deleteAction(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex justify-content-end mr-2 mb-2 mt-0">
        <base-pagination
          ref="basePagination"
          class="mb-0"
          :page-count="pageCount"
          v-model="pagination.default"
          @input="changePage"
        ></base-pagination>
      </div>
      <!-- </el-card> -->
      <!-- </div> -->
      <!-- //# Dialog -->
      <el-dialog title="UPDATE ACTION" width="55%" :visible.sync="dialogTableVisible">
        <action-detail v-on:reset="changePage" ref="actionDetailDialog" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import ActionDetail from "./ActionDetail.vue";

export default {
  props: {
    title: String,
  },
  components: { ActionDetail },
  name: "action-table",
  data() {
    return {
      dialogTableVisible: false,
      pagination: {
        default: 1,
      },
      loading: true,
      pageCount: 10,
    };
  },
  computed: {
    actionList() {
      this.setPageCount();
      return this.$store.state.action.actionList;
    },
  },
  beforeDestroy() {
    this.$store.commit("action/setActionList", []);
  },
  methods: {
    openDialog(id) {
      this.$store.commit("action/setId", id);
      if (this.$refs["actionDetailDialog"]) {
        this.$refs["actionDetailDialog"].setupData();
      }
      this.dialogTableVisible = true;
    },
    showMessage(message, type) {
      this.$message({
        showClose: true,
        center: true,
        duration: 2500,
        message: message,
        type: type,
      });
    },
    changePage(index) {
      this.$store.commit("action/setPageIndexAction", index);
      this.loading = true;
      this.getActionList();
    },
    setPageCount() {
      let pageSize = this.$store.state.action.PageSizeAction;
      this.pageCount = Math.ceil(this.$store.state.action.counteraction / pageSize);
    },
    indexMethod(index) {
      let PageSize = this.$store.state.action.PageSizeAction;
      let PageIndex = this.$store.state.action.PageIndexAction;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    //# viết tiếp hàm gọi aciton list và post action
    //# viết lun ở trong store để call api luôn
    getActionList() {
      this.$store
        .dispatch("action/getAction")
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.showMessage(err.message + ", please try again!");
        });
    },
    deleteAction(action) {
      this.$confirm("This will permanently delete the file. Continue?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.loading = true;
        let id = action.actionId;
        this.$store.commit("action/setId", id);
        this.$store
          .dispatch("action/deleteAction")
          .then((result) => {
            this.loading = false;
            if (result.status == 200) {
              this.changePage(1);
              this.$notify({
                icon: "el-icon-warning",
                title: "Success",
                message: "Delete failed, please try again",
                type: "success",
              });
            } else {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Delete failed, please try again",
                type: "danger",
              });
            }
          })
          .catch(() => {
            this.loading = false;
            this.changePage(1);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Delete failed, please try again",
              type: "danger",
            });
          });
      });
    },
  },
  created() {
    this.changePage(1);
  },
  filters: {
    dateFormat(value) {
      if (value) {
        return moment(value).format("HH:mm - DD/MM/YYYY");
      }
    },
    actionTypeFilter(value) {
      switch (value) {
        case 1: {
          return "Discount amount of order";
        }
        case 2: {
          return "Discount percent of order";
        }
        case 3: {
          return "Discount shipping fee of order";
        }
        case 4: {
          return "Discount amount of item";
        }
        case 5: {
          return "Discount percent of item";
        }
        case 6: {
          return "Discount unit of item";
        }
        case 7: {
          return "Fixed price of item";
        }
        case 8: {
          return "Ladder price of item";
        }
        case 9: {
          return "Bundle price of item";
        }
      }
    },
  },
};
</script>
<style>
#action-table .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #2fde6640 !important;
}
#action-table .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#action-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#action-table .el-checkbox__inner {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background-color: #ffffff;
  z-index: 1;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
/* #action-table .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
} */
#action-table .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#action-table .action-table {
  min-height: 63vh;
}
/* #action-table .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 0.25rem;
  padding-right: 2.5rem;
  text-align: left;
} */
.has-success:after {
  content: "";
  background-color: transparent;
}
.has-danger:after {
  content: "";
  background-color: transparent;
}
.has-danger .form-control:focus {
  border-color: #fb6340;
}
</style>
