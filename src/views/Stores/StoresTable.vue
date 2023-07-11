<template>
  <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''" id="store-table">
    <div class="card-header border-0 pb-2">
      <div class="row pl-2 pr-2">
        <div class="col-6 flex-row">
          <div class="row">
            <strong class="h2 mb-0">
              {{ title }}
            </strong>
          </div>
        </div>
        <div class="col-6">
          <div class="row d-flex justify-content-end">
            <el-button
              v-if="isEdit"
              type="text"
              size="mini"
              @click="reloadTable"
              icon="el-icon-close"
              :disabled="!storeList.length > 0"
            >
              Cancel
            </el-button>
            <el-button
              v-if="!isEdit"
              size="mini"
              @click="handleEditRow(true)"
              icon="el-icon-edit-outline"
              type="success"
              :disabled="!storeList.length > 0"
            >
              Edit
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-document-checked"
              type="success"
              :disabled="!isEdit"
              @click="saveStore"
              >Save</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              :disabled="!multipleSelection.length > 0"
              @click="dialogVisible = true"
              >Delete</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <el-table
        ref="multipleTable"
        class="store-table"
        v-loading="loading"
        :data="storeList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
        :cell-style="{
          padding: '0px',
          height: '5.5vh',
        }"
        stripe
      >
        <el-table-column
          type="selection"
          align="center"
          class="pt-0 pb-0"
          width="50"
          fixed
        />

        <el-table-column prop="index" label="No." width="50" />

        <!-- //# Table - Input Store Code -->
        <el-table-column prop="storeCode" label="Code" width="250">
          <template slot-scope="scope" class="p-0, mb-0">
            <el-input
              v-if="scope.row.edited"
              type="text"
              v-model="scope.row.storeCode"
              @input="handleChangeCode(scope.$index, scope.row.storeCode)"
              size="small"
              maxlength="20"
              spellcheck="false"
              @keydown.native.space.prevent
              show-word-limit
            >
            </el-input>
            <label v-if="!scope.row.edited" class="mb-0">{{ scope.row.storeCode }}</label>
          </template>
        </el-table-column>

        <!-- //# Table - Input Store Name -->
        <el-table-column prop="storeName" label="Name" width="400">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.edited"
              type="text"
              v-model="scope.row.storeName"
              @input="handleChangeName(scope.$index, scope.row.storeName)"
              size="small"
              maxlength="50"
              spellcheck="false"
              show-word-limit
            >
            </el-input>
            <label v-if="!scope.row.edited" class="mb-0">{{ scope.row.storeName }}</label>
          </template>
        </el-table-column>

        <!-- //# Table - Input Group -->
        <el-table-column prop="group" label="Group" width="115">
          <template slot-scope="scope">
            <el-input-number
              type="number"
              v-if="scope.row.edited"
              v-model="scope.row.group"
              spellcheck="false"
              size="small"
              :min="0"
              :max="10"
              controls-position="right"
              @change="handleChange(scope.$index)"
              style="width: 100%"
            />
            <label v-if="!scope.row.edited" class="mb-0">{{ scope.row.group }}</label>
          </template>
        </el-table-column>

        <el-table-column prop="insDate" label="Created date">
          <template slot-scope="scope"> {{ scope.row.insDate | dateFormat }}</template>
        </el-table-column>
        <el-table-column prop="updDate" label="Updated date">
          <template slot-scope="scope"> {{ scope.row.updDate | dateFormat }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="d-flex justify-content-end pr-3 pt-1 pb-2">
      <base-pagination
        ref="basePagination"
        class="mb-0"
        :page-count="pageCount"
        :value="tableIndex"
        @input="changePage"
      ></base-pagination>
    </div>
    <!--START Dialog confrim delete -->
    <el-dialog title="Please confirm action" :visible.sync="dialogVisible" width="30%">
      <span>Are you sure you want to delete these items ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="hideStore">Confrim</el-button>
      </span>
    </el-dialog>
    <!--END Dialog confrim delete -->
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "stores-table",
  props: {
    type: {
      type: String,
    },
    title: String,
  },
  data() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      pagination: {
        default: 1,
      },
      loading: true,
      isEdit: false,
      editIndex: [],
      errorIndex: [],
      multipleSelection: [],
      pageCount: 10,
      dialogVisible: false,
    };
  },
  computed: {
    storeList() {
      this.setPageCount();
      return this.$store.state.stores.storeList;
    },
    tableIndex() {
      return this.$store.state.stores.PageIndex;
    },
  },
  methods: {
    showMessage(message, type) {
      this.$message({
        showClose: true,
        center: true,
        duration: 2500,
        message: message,
        type: type,
      });
    },
    pushError(index) {
      if (!this.errorIndex.includes(index)) {
        this.errorIndex.push(index);
      }
    },
    popError(index) {
      if (this.errorIndex.includes(index)) {
        this.errorIndex.splice(this.errorIndex.indexOf(index), 1);
      }
    },
    handleChangeCode(index, value) {
      console.log("handleChangeCode :>> ", value);
      if (value) {
        let existUnicode = false;
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 127) {
            existUnicode = true;
          }
        }
        if (existUnicode) {
          this.showMessage("Accept no Unicode!", "error");
        } else {
          this.popError(index);
          this.$store.commit("stores/setStoreCode", value);
          this.$store.commit("stores/setStoreId", this.storeList[index].storeId);
          return this.$store.dispatch("stores/checkDuplicate").then((result) => {
            if (result.data === true) {
              this.showMessage("Duplicate Code!", "error");
              this.pushError(index);
            }
          });
        }
      } else {
        this.showMessage("Code is required!", "error");
        this.pushError(index);
      }
      this.handleChange(index);
    },
    handleChangeName(index, value) {
      if (!value) {
        this.showMessage("Name is required!", "error");
        this.pushError(index);
      } else if (!value.trim()) {
        this.showMessage("Name is required!", "error");
        this.pushError(index);
      } else {
        this.popError(index);
      }
      this.handleChange(index);
    },
    handleChange(index) {
      if (this.editIndex.includes(index)) {
        this.editIndex.splice(this.editIndex.indexOf(index), 1, index);
      } else {
        this.editIndex.push(index);
      }
    },
    changePage(index) {
      this.loading = true;
      this.$store.commit("stores/setPageIndex", index);
      this.$store
        .dispatch("stores/getStoresList")
        .then(
          () => {
            this.loading = false;

            // Kiểm tra xem có đang bật Edit hay không
            if (this.isEdit) {
              this.handleEditRow(true);
            }
          },
          (error) => {
            this.loading = false;
            this.message =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
          }
        )
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
    setPageCount() {
      let pageSize = this.$store.state.stores.PageSize;
      this.pageCount = Math.ceil(this.$store.state.stores.counter / pageSize);
    },
    // Bật/Tắt trạng thái edit cho toàn bộ record
    handleEditRow(value) {
      let arr = this.storeList;
      if (arr != null && arr.length > 0) {
        arr.forEach((element) => {
          element.edited = value;
        });
        // Lưu trạng thái edit
        this.isEdit = value;
      }
    },

    saveStore() {
      console.log(this.errorIndex);
      if (this.errorIndex.length > 0) {
        this.$message.error("Please fill all fields");
        console.log("Save FAIL: stores/saveStore: Field is not validated");
      } else {
        this.loading = true;
        if (this.editIndex != null && this.editIndex.length > 0) {
          //Lấy danh sách các record cần update
          let updateParams = [];
          this.editIndex.forEach((element) => {
            let param = {
              brandId: this.storeList[element].brandId,
              storeCode: this.storeList[element].storeCode,
              storeName: this.storeList[element].storeName.replace(/\s+/g, " ").trim(),
              storeId: this.storeList[element].storeId,
              group: this.storeList[element].group,
            };
            updateParams.push(param);
          });
          this.$store.commit("stores/setUpdateParams", updateParams);

          this.$store
            .dispatch("stores/saveStore")
            .then(
              () => {
                this.$message({
                  message: "Save successful.",
                  type: "success",
                });
                console.log("Save SUCCESS: stores/saveStore");
                this.reloadTable();
              },
              (error) => {
                console.log("Save FAIL: stores/saveStore");
                console.log(error);
              }
            )
            .catch((err) => {
              this.loading = false;
              this.$message({
                message: err.message + ", please try again.",
                type: "error",
              });
            });
        } else {
          this.reloadTable();
        }
      }
    },
    hideStore() {
      this.dialogVisible = false;
      this.loading = true;
      // Lấy danh sách record đã được chọn
      let removeObj = this.multipleSelection;
      // Lưu danh sách record vào store
      this.$store.commit("stores/setHideParams", removeObj);
      // Update delFlag = 1
      this.$store
        .dispatch("stores/hideStore")
        .then(
          () => {
            this.reloadTable();
          },
          (error) => {
            console.log("Delete FAIL: stores/hideStore");
            console.log(error);
            this.loading = false;
          }
        )
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },

    handleSelectionChange(rows) {
      //Lưu record được chọn vào danh sách
      this.multipleSelection = rows;
    },
    reloadTable() {
      this.loading = true;
      // Xóa hết các obj trong danh sách delete obj
      this.handleSelectionChange([]);
      // Tắt trạng thái edit
      this.handleEditRow(false);
      //Tính toán lại số trang
      this.$store
        .dispatch("stores/countStores")
        .then(
          () => {
            //Lấy lại danh sách cửa hàng
            this.$store
              .dispatch("stores/getStoresList")
              .then(
                () => {
                  console.log("StoresTable: Reload SUCCESS");
                  this.loading = false;
                },
                (error) => {
                  console.log("StoresTable: Reload FAIL: getStoresList");
                  console.log(error);
                  this.loading = false;
                }
              )
              .catch((err) => {
                this.loading = false;
                this.$message({
                  message: err.message + ", please try again.",
                  type: "error",
                });
              });
          },
          (error) => {
            console.log("StoresTable: Reload FAIL: countStores");
            console.log(error);
            this.loading = false;
          }
        )
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
  },
  created: function () {
    //Count
    this.$store.dispatch("stores/countStores").catch((err) => {
      this.loading = false;
      this.$message({
        message: err.message + ", please try again.",
        type: "error",
      });
    });

    //Get stores
    this.$store
      .dispatch("stores/getStoresList")
      .then(
        () => {
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response && error.response.data) || error.message || error.toString();
        }
      )
      .catch((err) => {
        this.loading = false;
        this.$message({
          message: err.message + ", please try again.",
          type: "error",
        });
      });
  },
  filters: {
    dateFormat(value) {
      if (value) {
        return moment(value).format("HH:mm - DD/MM/YYYY");
      }
    },
  },
  watch: {
    editIndex() {
      if (this.editIndex) {
        for (const index of this.editIndex) {
          let store = this.storeList[index];
          if (!store.storeCode || !store.storeName.trim()) {
            if (!store.storeCode && store.storeName.trim()) {
              this.pushError(index);
            } else if (store.storeCode && !store.storeName.trim()) {
              this.pushError(index);
            }
          }
        }
      }
    },
  },
};
</script>
<style>
#store-table .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#store-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#store-table .el-checkbox__inner {
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
#store-table .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
#store-table .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#store-table .store-table {
  min-height: 62vh;
}
#store-table .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 0.7rem;
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
