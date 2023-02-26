<template>
  <div class="card shadow">
    <div class="p-3">
      <!-- //# Gift Table -->
      <el-table
        :data="giftList"
        ref="multipleTable"
        class="m-0 store-table"
        id="gift-table"
        v-loading="loading"
        style="width: 100%"
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
              @click="openDialog(scope.row.giftId)"
            >
              {{ scope.row.name }}
              <!-- <i class="el-icon-edit" /> -->
            </el-link>
          </template>
        </el-table-column>

        <!-- //# Table - Action Type -->
        <el-table-column prop="postActionType" label="Type" class="pt-0 pb-0">
          <template slot-scope="scope">
            {{ scope.row.postActionType | actionTypeFilter }}</template
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
        <el-table-column label="" align="center" class="pt-0 pb-0" width="70">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete-solid"
              style="outline: none; border: 0px; background-color: transparent"
              class="p-0 m-0"
              @click="deleteAction(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex justify-content-end m-3">
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
    </div>
    <el-dialog
      width="55%"
      :close-on-click-modal="false"
      title="UPDATE ACTION"
      :visible.sync="dialogTableVisible"
      :before-close="beforeCloseDialog"
    >
      <gfit-detail v-on:reset="changePage" ref="actionDetailDialog" />
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import GfitDetail from "../Gift/GfitDetail.vue";
export default {
  components: { GfitDetail },
  name: "gift-table",
  data() {
    return {
      pagination: {
        default: 1,
      },
      loading: true,
      pageCount: 10,
      dialogTableVisible: false,
    };
  },
  computed: {
    giftList() {
      this.setPageCount();
      return this.$store.state.action.giftList;
    },
  },
  beforeDestroy() {
    this.$store.commit("action/setPostActionList", []);
  },
  methods: {
    beforeCloseDialog() {
      this.$store.commit("action/setGiftParam", {});
      this.dialogTableVisible = false;
    },
    openDialog(id) {
      this.$store.commit("action/setGiftId", id);
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
      console.log("index :>> ", index);
      this.$store.commit("action/setPageIndexPost", index);
      this.loading = true;
      this.getPostActionList();
    },
    setPageCount() {
      let pageSize = this.$store.state.action.PageSizePost;
      this.pageCount = Math.ceil(this.$store.state.action.counterpost / pageSize);
    },
    indexMethod(index) {
      let PageSize = this.$store.state.action.PageSizePost;
      let PageIndex = this.$store.state.action.PageIndexPost;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    deleteAction(action) {
      this.$confirm("This will permanently delete the file. Continue?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.loading = true;
        let id = action.giftId;
        this.$store.commit("action/setGiftId", id);
        this.$store
          .dispatch("action/deleteGift")
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
    //# viết tiếp hàm gọi aciton list và post action
    //# viết lun ở trong store để call api luôn
    getPostActionList() {
      this.$store
        .dispatch("action/getPostAction")
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.showMessage(err.message + ", please try again!");
          console.log("ActionTable.vue - getPostActionList:>> " + err);
        });
    },
    deletePromotion(index) {
      console.log("hi " + index);
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
          return "Gift products";
        }
        case 2: {
          return "Gift vouchers";
        }
        case 3: {
          return "Gift points";
        }
        case 4: {
          return "Gift game code";
        }
      }
    },
  },
};
</script>
<style>
#gift-table .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #2fde6640 !important;
}
#gift-table .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#gift-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#gift-table .el-checkbox__inner {
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
#gift-table .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#gift-table .store-table {
  min-height: 63vh;
}
#gift-table .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 0.25rem;
  padding-right: 2.5rem;
  text-align: left;
}
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
