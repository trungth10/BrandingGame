<template>
  <div
    class="card shadow"
    :class="type === 'dark' ? 'bg-default' : ''"
    id="channel-table"
  >
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
              :disabled="!channelList.length > 0"
              >Cancel</el-button
            >
            <el-button
              v-if="!isEdit"
              size="mini"
              @click="handleEditRow(true)"
              icon="el-icon-edit-outline"
              type="success"
              :disabled="!channelList.length > 0"
              >Edit</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-document-checked"
              type="success"
              :disabled="!isEdit"
              @click="saveChannel"
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
        @row-click="rowClicked"
        class="channel-table"
        ref="multipleTable"
        v-loading="loading"
        :data="channelList"
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
        ></el-table-column>

        <el-table-column prop="index" label="No" width="50" />

        <!-- //# Table - Input Channel Code -->
        <el-table-column prop="channelCode" label="Code">
          <template slot-scope="scope" class="p-0, mb-0">
            <el-input
              v-if="scope.row.edited"
              type="text"
              v-model="scope.row.channelCode"
              @input="handleChangeCode(scope.$index, scope.row.channelCode)"
              size="small"
              maxlength="20"
              spellcheck="false"
              @keydown.native.space.prevent
              show-word-limit
            >
            </el-input>
            <label v-if="!scope.row.edited" class="mb-0">{{
              scope.row.channelCode
            }}</label>
          </template>
        </el-table-column>

        <!-- //# Table - Input Channel Name -->
        <el-table-column prop="channelName" label="Name">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.edited"
              type="text"
              v-model="scope.row.channelName"
              @input="handleChangeName(scope.$index, scope.row.channelName)"
              size="small"
              maxlength="50"
              spellcheck="false"
              show-word-limit
            >
            </el-input>
            <label v-if="!scope.row.edited" class="mb-0">{{
              scope.row.channelName
            }}</label>
          </template>
        </el-table-column>
        <!-- //# Table - Input Channel Type -->
        <el-table-column prop="channelType" label="Type">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.edited"
              v-model="scope.row.channelType"
              placeholder="Select type"
              @change="handleChangeType(scope.$index, scope.row.channelType)"
            >
              <el-option
                v-for="item in channelType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <label v-if="!scope.row.edited" class="mb-0">{{
              scope.row.channelType | channelType
            }}</label>
          </template>
        </el-table-column>

        <!-- //# Table - Input Group -->
        <el-table-column prop="group" label="Group">
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
        <el-table-column label="Api Key">
          <template slot-scope="scope">
            <span v-show="false" :id="scope.row.apiKey">{{ scope.row.apiKey }}</span>
            <el-button
              @click="copyToClipboard(scope.row.apiKey)"
              icon="el-icon-copy-document"
              >Copy</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="Public Key">
          <template slot-scope="scope">
            <span v-show="false" :id="scope.row.publicKey">{{
              scope.row.publicKey
            }}</span>
            <el-button
              v-if="scope.row.channelType == 3"
              @click="copyToClipboard(scope.row.publicKey)"
              icon="el-icon-copy-document"
              >Copy</el-button
            >
          </template>
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
        <el-button type="primary" @click="hideChannel">Confrim</el-button>
      </span>
    </el-dialog>
    <!--END Dialog confrim delete -->
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
VueClipboard.config.autoSetContainer = true;
import moment from "moment";
// 1. Introduce the Clipboard where needed
import Clipboard from "clipboard";

// 2. Instantiate a clipboard object with trigger operation object
var clipboard = new Clipboard(".copyBtn");

// 3. Specify the operation success callback function for it
// var that = this;
clipboard.on("success", function (e) {
  console.info("Action:", e.action);
  console.info("Text:", e.text);
  console.info("Trigger:", e.trigger);

  // Clear selected state
  e.clearSelection();
  console.log("success");
  // this.$message({
  //   message: "Copied data",
  //   type: "success",
  // });
});

// 4. Specify the operation failure callback function for it
clipboard.on("error", function (e) {
  // console.error("Action:", e.action);
  // console.error("Trigger:", e.trigger);
  console.log("error", e);
  // this.$message({
  //   message: "Please try again",
  //   type: "warning",
  // });
});
export default {
  name: "channel-table",
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
      channelType: [
        {
          value: 1,
          label: "In-Store",
        },
        {
          value: 2,
          label: "Online",
        },
        {
          value: 3,
          label: "Other App",
        },
      ],
    };
  },
  computed: {
    channelList() {
      this.setPageCount();
      return this.$store.state.channel.channelList;
    },
    tableIndex() {
      return this.$store.state.channel.PageIndex;
    },
  },
  methods: {
    copyToClipboard(containerid) {
      let containerNode = document.getElementById(containerid);
      var textArea = document.createElement("textarea");
      textArea.style.position = "fixed";
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = "2em";
      textArea.style.height = "2em";

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";

      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = "transparent";

      textArea.value = containerNode.innerHTML;

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      document.body.removeChild(textArea);
      alert("Data copied");
    },
    onCopy() {
      this.$message({
        message: "Copy successful",
        type: "success",
      });
    },
    rowClicked(row) {
      this.$refs.multipleTable.toggleRowExpansion(row);
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
          this.$store.commit("channel/setChannelCode", value);
          this.$store.commit("channel/setChannelId", this.channelList[index].channelId);
          return this.$store.dispatch("channel/checkDuplicate").then((result) => {
            if (result.data) {
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
    handleChangeType(index, value) {
      if (!value) {
        this.showMessage("Type is required!", "error");
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
      this.$store.commit("channel/setPageIndex", index);
      this.$store
        .dispatch("channel/getChannelList")
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
      let pageSize = this.$store.state.channel.PageSize;
      this.pageCount = Math.ceil(this.$store.state.channel.counter / pageSize);
    },
    // Bật/Tắt trạng thái edit cho toàn bộ record
    handleEditRow(value) {
      let arr = this.channelList;
      if (arr != null && arr.length > 0) {
        arr.forEach((element) => {
          element.edited = value;
        });
        // Lưu trạng thái edit
        this.isEdit = value;
      }
    },

    saveChannel() {
      if (this.errorIndex.length > 0) {
        this.$message.error("Please fill all fields");
        console.log("Save FAIL: channel/saveChannel: Field is not validated");
      } else {
        this.loading = true;
        console.log(this.editIndex + " - " + this.editIndex.length);
        if (this.editIndex != null && this.editIndex.length > 0) {
          //Lấy danh sách các record cần update
          let updateParams = [];
          this.editIndex.forEach((element) => {
            let param = {
              brandId: this.channelList[element].brandId,
              channelCode: this.channelList[element].channelCode,
              channelName: this.channelList[element].channelName
                .replace(/\s+/g, " ")
                .trim(),
              channelType: this.channelList[element].channelType,
              channelId: this.channelList[element].channelId,
              group: this.channelList[element].group,
            };
            updateParams.push(param);
            console.log("loop: ", param);
          });
          console.log("updateParams ", updateParams);
          this.$store.commit("channel/setUpdateParams", updateParams);

          this.$store
            .dispatch("channel/saveChannel")
            .then(() => {
              // this.$notify({
              //   title: "Title",
              //   message: h("i", { style: "color: teal" }, "This is a reminder"),
              // });
              this.$notify({
                title: "Success",
                message: "Update successful",
                // type: "success",
              });

              this.reloadTable();
            })
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
    hideChannel() {
      this.dialogVisible = false;
      this.loading = true;
      // Lấy danh sách record đã được chọn
      let removeObj = this.multipleSelection;
      // Lưu danh sách record vào channel
      this.$store.commit("channel/setHideParams", removeObj);
      // Update delFlag = 1
      this.$store
        .dispatch("channel/hideChannel")
        .then(
          () => {
            this.reloadTable();
          },
          (error) => {
            console.log("Delete FAIL: channel/hideChannel");
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
        .dispatch("channel/countChannel")
        .then(
          () => {
            //Lấy lại danh sách cửa hàng
            this.$store
              .dispatch("channel/getChannelList")
              .then(
                () => {
                  console.log("channelTable: Reload SUCCESS");
                  this.loading = false;
                },
                (error) => {
                  console.log("channelTable: Reload FAIL: getChannelList");
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
            console.log("channelTable: Reload FAIL: countChannel");
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
    this.$store.dispatch("channel/countChannel").catch((err) => {
      this.loading = false;
      this.$message({
        message: err.message + ", please try again.",
        type: "error",
      });
    });

    //Get channel
    this.$store
      .dispatch("channel/getChannelList")
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
    channelType(value) {
      if (value) {
        switch (value) {
          case 1:
            return "In-Store";
          case 2:
            return "Online";
          case 3:
            return "Other App";
        }
      }
    },
  },
  watch: {
    editIndex() {
      if (this.editIndex) {
        for (const index of this.editIndex) {
          let channel = this.channelList[index];
          if (!channel.channelCode || !channel.channelName.trim()) {
            if (!channel.channelCode && channel.channelName.trim()) {
              this.pushError(index);
            } else if (channel.channelCode && !channel.channelName.trim()) {
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
#channel-table .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#channel-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#channel-table .el-checkbox__inner {
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
#channel-table .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
#channel-table .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#channel-table .channel-table {
  min-height: 62vh;
}
#channel-table .el-input-number .el-input__inner {
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
