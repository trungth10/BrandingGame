<template>
  <div class="card shadow container-fluid mt-3 mb-3 pb-2" id="device">
    <!-- //# Name and buttons -->
    <div class="row pt-3 pb-2">
      <div class="col-6">
        <div class="row justify-content-start">
          <strong>Devices</strong>
        </div>
      </div>
      <div class="col-6">
        <div class="row justify-content-end">
          <!-- //# Edit combo -->
          <el-button
            @click="editMode"
            v-if="isEdit"
            type="text"
            size="mini"
            icon="el-icon-close"
            >Cancel</el-button
          >
          <el-button
            v-if="isEdit"
            type="success"
            icon="el-icon-document-checked"
            size="mini"
            @click="saveDev"
            >Save</el-button
          >
          <el-button
            @click="editMode"
            v-if="!this.isPress"
            v-show="deviceList.length > 0"
            type="success"
            icon="el-icon-edit-outline"
            size="mini"
            >Edit</el-button
          >

          <!-- //# Add combo -->
          <el-button
            @click="addMode"
            v-if="isAdd"
            type="text"
            size="mini"
            icon="el-icon-close"
            >Cancel</el-button
          >
          <el-button
            @click="addMode"
            v-if="!this.isPress"
            type="success"
            icon="el-icon-plus"
            size="mini"
            >Add</el-button
          >

          <!-- //# Delete button -->
          <el-button
            @click="cancelDialog"
            v-show="deviceList.length > 0"
            type="danger"
            icon="el-icon-delete"
            :disabled="!multiSelection.length > 0"
            size="mini"
            >Delete</el-button
          >
        </div>
      </div>
    </div>

    <!-- //# Add form -->
    <div v-if="isAdd" class="col-12">
      <el-form
        :model="createForm"
        ref="createForm"
        class="row justify-content-center"
        :rules="addRules"
      >
        <!-- //# Add - Select storeId for Device -->
        <el-form-item class="col-3 align-self-center" prop="storeId">
          <p class="mb-0">
            <small> Stores </small>
          </p>
          <el-select
            :disabled="!isAdd"
            v-model="createForm.storeId"
            placeholder="Select store"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="store in storeList"
              :key="store.storeId"
              :label="store.storeName"
              :value="store.storeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- //# Add - Input Device Name -->
        <el-form-item class="col-4 mb-3" prop="name">
          <p class="mb-0">
            <small> Device Name </small>
          </p>
          <el-input
            type="text"
            v-model="createForm.name"
            placeholder="Input name here"
            size="small"
            spellcheck="false"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item class="col-1 mb-0 mt-2 align-self-center">
          <el-button
            @click="submitForm('createForm')"
            type="success"
            icon="el-icon-plus"
            size="mini"
            >Add</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- //# Device Table -->
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="deviceList"
      @selection-change="handleSelectionChange"
      class="mb-2 device-table"
      max-height="580"
      height="580"
      style="width: 100%"
      :cell-style="{
        padding: '0',
        height: '5vh',
      }"
      stripe
    >
      <el-table-column type="selection" align="center" fixed />

      <!-- //# Table - No. -->
      <el-table-column label="No." type="index" :index="indexMethod" width="50" />

      <!-- //# Table - Product Cate Id -->
      <el-table-column label="Store" prop="storeId">
        <template slot-scope="scope">
          <!-- //# Table - Select List -->
          <el-select
            :disabled="!isEdit"
            v-model="scope.row.storeId"
            placeholder=""
            @change="handleChange(scope.$index)"
            style="width: 100%"
            size="small"
          >
            <!-- //# Table - Store list -->
            <el-option
              v-for="store in storeList"
              :key="store.storeId"
              :label="store.storeName"
              :value="store.storeId"
            >
              <span style="float: left">{{ store.storeName }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <!-- //# Table - Device Name -->
      <el-table-column label="Device Name" prop="name">
        <template slot-scope="scope">
          <el-input
            v-if="isEdit"
            type="text"
            v-model="scope.row.name"
            @input="handleChangeName(scope.$index, scope.row.name)"
            placeholder="Input name here"
            size="small"
            maxlength="50"
            spellcheck="false"
            show-word-limit
          />
          <label v-if="!isEdit" class="mb-0">{{ scope.row.name }}</label>
        </template>
      </el-table-column>

      <!-- //# Table - Device Code -->
      <el-table-column label="Device Code" prop="code" width="150">
        <template slot-scope="scope">
          <label class="mb-0">{{ scope.row.code }}</label>
        </template>
      </el-table-column>
    </el-table>

    <div class="d-flex justify-content-end pr-0">
      <base-pagination
        ref="basePagination"
        class="mb-0"
        :page-count="pageCount"
        v-model="pagination.default"
        @input="changePage"
      />
    </div>

    <!-- //# Dialog -->
    <el-dialog title="Confirm action" :visible.sync="dialogVisible" width="27%">
      <span>Are you sure you want to delete these items ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">Cancel</el-button>
        <el-button type="primary" @click="hideDev">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "device-table",
  data() {
    return {
      isEdit: false,
      isAdd: false,
      isPress: false,
      loading: true,
      isDuplicate: false,
      pagination: {
        default: 1,
      },
      pageCount: 1,
      multiSelection: [],
      errorIndex: [],
      editIndex: [],
      createForm: {
        storeId: "",
        name: "",
      },
      dialogVisible: false,
      addRules: {
        name: [{ validator: this.validateAddName, trigger: "change" }],
        storeId: [{ required: true, message: "Store is required!" }],
      },
    };
  },
  watch: {},
  props: {},
  computed: {
    gameConfigList() {
      return this.$store.state.game_campaign.gameConfigs;
    },
    deviceList() {
      this.setPageCount();
      return this.$store.state.device.deviceList;
    },
    storeList() {
      return this.$store.state.device.storeSelectList;
    },
  },
  methods: {
    async getGameCampaignList() {
      this.loading = true;
      this.$store.commit("game_campaign/setPageSize", 0);
      this.$store.commit("game_campaign/setPageIndex", 0);
      this.$store
        .dispatch("game_campaign/getGameCampaignList")
        .then((result) => {
          if (result.status != 200) {
            console.log(result.data.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when Get Game config. Please try again",
              type: "danger",
            });
          }
          this.loading = false;
          this.$store.commit("game_campaign/setPageSize", 10);
          this.$store.commit("game_campaign/setPageIndex", 1);
        })
        .catch((err) => {
          console.log(err.message);
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error occur when Get Game config. Please try again",
            type: "danger",
          });
        });
    },
    validateAddName(rule, value, callback) {
      if (!value) {
        callback(new Error("Name is required!"));
      } else {
        console.log("validateAddName :>> ", value);
        if (!value.trim()) {
          callback(new Error("Name is required!"));
        } else {
          callback();
        }
      }
    },
    resetPage() {
      this.$refs["basePagination"].changePage(1);
    },
    async getDevice() {
      await this.$store
        .dispatch("device/getDevice")
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("DeviceTable.vue - getDevice:>> " + error);
        });
    },
    handleClickDropDown(val) {
      console.log("val :>> ", val);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addDevice();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addDevice() {
      this.loading = true;
      this.$store.commit("device/setStoreId", this.createForm.storeId);
      this.$store.commit(
        "device/setName",
        this.createForm.name.replace(/\s +/g, " ").trim()
      );

      this.$store
        .dispatch("device/addDev")
        .then(
          () => {
            this.$message({
              message: "Add successful.",
              type: "success",
            });
            this.loading = false;
            this.isPress = !this.isPress;
            this.isAdd = !this.isAdd;
            this.createForm.storeId = "";
            this.createForm.name = "";
            this.resetPage();
            this.getDevice();
          },
          (error) => {
            this.$message({
              message: "Add failed.",
              type: "danger",
            });
            console.log("DeviceTable.vue - addDev:>> " + error);
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("DeviceTable.vue - addDev:>> " + error);
        });
    },
    changePage(index) {
      console.log("index :>> ", index);
      this.$store.commit("device/setPageIndex", index);
      this.loading = true;
      this.getDevice();
    },
    setPageCount() {
      let pageSize = this.$store.state.device.PageSize;
      console.log("counter :>> ", this.$store.state.device.counter);
      console.log("pageSize :>> ", this.$store.state.device.PageSize);
      this.pageCount = Math.ceil(this.$store.state.device.counter / pageSize);
    },
    indexMethod(index) {
      let PageSize = this.$store.state.device.PageSize;
      let PageIndex = this.$store.state.device.PageIndex;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    handleSelectionChange(val) {
      console.log("val :>> ", val);
      this.multiSelection = val;
    },
    editMode() {
      this.isEdit = !this.isEdit;
      this.isPress = !this.isPress;
      if (!this.isEdit) {
        this.handleSelectionChange([]);
        this.getDevice();
      }
    },
    addMode() {
      this.isAdd = !this.isAdd;
      this.isPress = !this.isPress;
      if (!this.isAdd) {
        this.createForm.name = "";
        this.createForm.storeId = "";
        this.handleSelectionChange([]);
        this.getDevice();
      }
    },
    cancelDialog() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.handleSelectionChange([]);
        this.getDevice();
      }
    },
    handleChangeName(index, value) {
      console.log("handleChangeName :>> ", value);
      if (!value) {
        this.$message({
          showClose: true,
          center: true,
          duration: 2500,
          message: "Name is required!",
          type: "error",
        });
        if (!this.errorIndex.includes(index)) {
          console.log("đẩy lỗi ở handleChangeName khi mà ko có value");
          this.errorIndex.push(index);
        }
      } else if (!value.trim()) {
        this.$message({
          showClose: true,
          center: true,
          duration: 2500,
          message: "Name is required!",
          type: "error",
        });
        if (!this.errorIndex.includes(index)) {
          console.log("đẩy lỗi ở handleChangeName khi mà !value.trim()");
          this.errorIndex.push(index);
        }
      } else {
        if (this.errorIndex.includes(index)) {
          console.log("gỡ lỗi ở handleChangeName khi mà có value");
          this.errorIndex.splice(this.errorIndex.indexOf(index), 1);
        }
      }
      this.handleChange(index);
    },
    handleChange(index) {
      console.log("handleChange trigger");
      let indexes = this.editIndex;
      if (indexes.includes(index)) {
        indexes.splice(indexes.indexOf(index), 1);
      }
      indexes.push(index);
    },
    hideDev() {
      this.loading = !this.loading;
      let removeObj = this.multiSelection;
      console.log("removeObj :>> ", removeObj);
      this.$store.commit("device/setHideParams", removeObj);

      this.$store
        .dispatch("device/hideDev")
        .then(
          () => {
            this.$message({
              showClose: true,
              center: true,
              duration: 3000,
              message: "Delete successful.",
              type: "warning",
            });
            this.resetPage();
            this.dialogVisible = !this.dialogVisible;
            this.getDevice();
          },
          (error) => {
            console.log("Delete FAIL: device/hideDev");
            this.loading = false;
            this.$message({
              message: error.message + ", please try again.",
              type: "error",
            });
            console.log("DeviceTable.vue - hideDev:>> " + error);
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("DeviceTable.vue - hideDev:>> " + error);
        });
    },
    saveDev() {
      if (this.errorIndex.length > 0) {
        this.$message({
          showClose: true,
          center: true,
          duration: 3000,
          message: "Products: Please check again the error field(s)!",
          type: "error",
        });
        console.log("this.errorIndex :>> ", this.errorIndex);
      } else {
        this.loading = true;
        if (this.editIndex != null && this.editIndex.length > 0) {
          //# trong editIndex ko null và có phần tử, thì cho vòng lặp chạy hết mảng này
          let updateParams = [];
          this.editIndex.forEach((index) => {
            let param = {
              deviceId: this.deviceList[index].deviceId,
              storeId: this.deviceList[index].storeId,
              name: this.deviceList[index].name.replace(/\s +/g, " ").trim(),
              gameConfigId: this.deviceList[index].gameConfigId,
            };
            updateParams.push(param);
          });
          //# Xem nó trả về gì ở đây xong thì quay lên xem hàm select cái gì hứng data của nó
          console.log("updateParams :>> ", updateParams);
          this.$store.commit("device/setUpdateParams", updateParams);

          this.$store
            .dispatch("device/saveDev")
            .then(
              () => {
                this.$message({
                  showClose: true,
                  center: true,
                  duration: 3000,
                  message: "Save successful!",
                  type: "success",
                });
                this.isPress = !this.isPress;
                this.isEdit = !this.isEdit;
                this.editIndex = [];
                this.errorIndex = [];
                this.resetPage();
                this.getDevice();
              },
              (error) => {
                this.$message({
                  showClose: true,
                  center: true,
                  duration: 3000,
                  message: "Save failed!",
                  type: "error",
                });
                console.log("DeviceTable.vue - saveDev:>> " + error);
              }
            )
            .catch((error) => {
              this.loading = false;
              this.$message({
                message: error.message + ", please try again.",
                type: "error",
              });
              console.log("DeviceTable.vue - saveDev:>> " + error);
            });
        } else {
          this.isPress = !this.isPress;
          this.isEdit = !this.isEdit;
          this.getDevice();
        }
      }
    },
  },
  created() {
    this.getGameCampaignList();
    this.getDevice();
  },
  destroyed() {
    this.$store.commit("device/setPageIndex", 1);
  },
  filters: {},
};
</script>
<style>
#device .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#device .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#device .el-checkbox__inner {
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
#device .device-frame {
  height: 50vh;
  min-height: 100px;
  max-height: 50vmax;
}
#device .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
#device .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#device .device-table {
  min-height: 31.5vh;
}
</style>
