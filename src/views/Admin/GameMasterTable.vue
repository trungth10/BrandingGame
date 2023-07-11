<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-7" />
    <div class="ml-4 mr-4 mb-4 p-4 mt--5 float-center">
      <div class="card shadow container-fluid mt-3 mb-3 pb-2" id="game">
        <!-- //# Name and buttons -->
        <div class="row pt-3 pb-2">
          <div class="col-6">
            <div class="row justify-content-start">
              <strong>Games</strong>
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
                @click="saveGame"
                >Save</el-button
              >
              <el-button
                @click="editMode"
                v-if="!this.isPress"
                v-show="gameList.length > 0"
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
                v-show="gameList.length > 0"
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
            <!-- //# Add - Input Game Name -->
            <el-form-item class="col-5 mb-3" prop="name">
              <p class="mb-0">
                <small> Game Name </small>
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
            <el-form-item class="col-2 mb-3" prop="minItem">
              <p class="mb-0">
                <small> Min item </small>
              </p>
              <el-input-number
                size="small"
                :min="5"
                :max="15"
                v-model="createForm.minItem"
                placeholder="Input min item here"
              />
            </el-form-item>
            <el-form-item class="col-2 mb-3" prop="maxItem">
              <p class="mb-0">
                <small> Max item </small>
              </p>
              <el-input-number
                size="small"
                :min="5"
                :max="15"
                v-model="createForm.maxItem"
                placeholder="Input man item here"
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

        <!-- //# Game Table -->
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="gameList"
          @selection-change="handleSelectionChange"
          class="mb-2 game-table"
          max-height="580"
          height="580"
          style="width: 100%"
          :cell-style="{
            padding: '0',
            height: '5vh',
          }"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="selection" align="center" fixed />

          <!-- //# Table - No. -->
          <el-table-column label="No." type="index" :index="indexMethod" width="50" />

          <!-- //# Table - Game Name -->
          <el-table-column label="Game Name" prop="name">
            <template slot-scope="scope">
              <el-input
                v-if="isEdit"
                type="text"
                v-model="scope.row.name"
                @input="handleChangeName(scope.row, scope.$index, scope.row.name)"
                placeholder="Input name here"
                size="small"
                maxlength="30"
                spellcheck="false"
                show-word-limit
              />
              <label v-if="!isEdit" class="mb-0">{{ scope.row.name }}</label>
            </template>
          </el-table-column>

          <!-- //# Table - Game Min Item -->
          <el-table-column label="Min Item" prop="minItem">
            <template slot-scope="scope">
              <el-input-number
                v-if="isEdit"
                :min="5"
                :max="15"
                v-model="scope.row.minItem"
                placeholder="Input min item here"
                @input="
                  handleChangeMinMaxItem(
                    scope.row,
                    scope.$index,
                    scope.row.minItem,
                    scope.row.maxItem
                  )
                "
                size="small"
                maxlength="30"
                spellcheck="false"
                show-word-limit
              />
              <label v-if="!isEdit" class="mb-0">{{ scope.row.minItem }}</label>
            </template>
          </el-table-column>
          <!-- //# Table - Game Max Item -->
          <el-table-column label="Max Item" prop="maxItem">
            <template slot-scope="scope">
              <el-input-number
                v-if="isEdit"
                :min="5"
                :max="15"
                v-model="scope.row.maxItem"
                placeholder="Input max item here"
                @input="
                  handleChangeMinMaxItem(
                    scope.$index,
                    scope.row.minItem,
                    scope.row.maxItem,
                    scope.row
                  )
                "
                size="small"
                maxlength="30"
                spellcheck="false"
                show-word-limit
              />
              <label v-if="!isEdit" class="mb-0">{{ scope.row.maxItem }}</label>
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
            <el-button type="primary" @click="hideGame">Confirm</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "game-table",
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
        name: "",
        minItem: 0,
        maxItem: 0,
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
    gameList() {
      this.setPageCount();
      return this.$store.state.game.gameList;
    },
    storeList() {
      return this.$store.state.game.storeSelectList;
    },
  },
  methods: {
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
    getGame() {
      this.$store
        .dispatch("game/getGame")
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("GameTable.vue - getGame:>> " + error);
        });
    },
    handleClickDropDown(val) {
      console.log("val :>> ", val);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addGame();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addGame() {
      this.loading = true;
      this.createForm.name.replace(/\s +/g, " ").trim();
      this.$store.commit("game/setNewGame", this.createForm);
      this.$store
        .dispatch("game/addGame")
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
            this.getGame();
          },
          (error) => {
            this.$message({
              message: "Add failed.",
              type: "danger",
            });
            console.log("GameTable.vue - addDev:>> " + error);
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("GameTable.vue - addDev:>> " + error);
        });
    },
    changePage(index) {
      console.log("index :>> ", index);
      this.$store.commit("game/setPageIndex", index);
      this.loading = true;
      this.getGame();
    },
    setPageCount() {
      let pageSize = this.$store.state.game.PageSize;
      console.log("counter :>> ", this.$store.state.game.counter);
      console.log("pageSize :>> ", this.$store.state.game.PageSize);
      this.pageCount = Math.ceil(this.$store.state.game.counter / pageSize);
    },
    indexMethod(index) {
      let PageSize = this.$store.state.game.PageSize;
      let PageIndex = this.$store.state.game.PageIndex;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    handleSelectionChange(val) {
      this.multiSelection = val;
    },
    editMode() {
      this.isEdit = !this.isEdit;
      this.isPress = !this.isPress;
      if (!this.isEdit) {
        this.handleSelectionChange([]);
        this.getGame();
      }
    },
    addMode() {
      this.isAdd = !this.isAdd;
      this.isPress = !this.isPress;
      if (!this.isAdd) {
        this.createForm.name = "";
        this.createForm.storeId = "";
        this.handleSelectionChange([]);
        this.getGame();
      }
    },
    cancelDialog() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.handleSelectionChange([]);
        this.getGame();
      }
    },
    handleChangeName(row, index, value) {
      console.log("handleChangeName :>> ", value);
      if (!value) {
        this.pushMsg("error", "Name is required!");
        this.pushError(row, index);
      } else if (!value.trim()) {
        this.pushMsg("error", "Name is required!");
        this.pushError(row, index);
      } else {
        this.popError(row, index);
      }
      this.handleChange(index);
    },

    handleChangeMinMaxItem(row, index, minValue, maxValue) {
      if (!minValue) {
        this.pushMsg("error", "Min item is required!");
        this.pushError(row, index);
      } else if (!maxValue) {
        this.pushMsg("error", "Max item is required!");
        this.pushError(row, index);
      } else if (minValue > maxValue) {
        this.pushMsg("error", "Min item must be smaller than max item!");
        this.pushError(row, index);
      } else {
        this.popError(row, index);
      }
      this.handleChange(index);
    },
    pushMsg(type, message) {
      this.$message({
        showClose: true,
        center: true,
        duration: 2500,
        message: message,
        type: type,
      });
    },
    pushError(row, index) {
      if (!this.errorIndex.includes(index)) {
        row.isError = true;
        this.errorIndex.push(index);
      }
    },
    popError(row, index) {
      if (this.errorIndex.includes(index)) {
        row.isError = false;
        this.errorIndex.splice(this.errorIndex.indexOf(index), 1);
      }
    },
    tableRowClassName({ row }) {
      if (row.isError == true && row.isError != undefined) {
        return "error-row";
      } else if (row.isError == false || row.isError == undefined) {
        return "";
      }
      return "";
    },
    handleChange(index) {
      console.log("handleChange trigger");
      let indexes = this.editIndex;
      if (indexes.includes(index)) {
        indexes.splice(indexes.indexOf(index), 1);
      }
      indexes.push(index);
    },
    hideGame() {
      this.loading = !this.loading;
      let removeObj = this.multiSelection;
      console.log("removeObj :>> ", removeObj);
      this.$store.commit("game/setHideParams", removeObj);

      this.$store
        .dispatch("game/hideGame")
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
            this.getGame();
          },
          (error) => {
            console.log("Delete FAIL: game/hideGame");
            this.loading = false;
            this.$message({
              message: error.message + ", please try again.",
              type: "error",
            });
            console.log("GameTable.vue - hideGame:>> " + error);
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("GameTable.vue - hideGame:>> " + error);
        });
    },

    saveGame() {
      if (this.errorIndex.length > 0) {
        this.pushMsg("error", "Game: Please check again the error field(s)!");
        console.log("this.errorIndex :>> ", this.errorIndex);
      } else {
        this.loading = true;
        if (this.editIndex != null && this.editIndex.length > 0) {
          //# trong editIndex ko null và có phần tử, thì cho vòng lặp chạy hết mảng này
          let updateParams = [];
          this.editIndex.forEach((index) => {
            let param = {
              id: this.gameList[index].id,
              minItem: this.gameList[index].minItem,
              maxItem: this.gameList[index].maxItem,
              name: this.gameList[index].name.replace(/\s +/g, " ").trim(),
            };
            updateParams.push(param);
          });
          //# Xem nó trả về gì ở đây xong thì quay lên xem hàm select cái gì hứng data của nó
          console.log("updateParams :>> ", updateParams);
          this.$store.commit("game/setUpdateParams", updateParams);
          this.$store
            .dispatch("game/saveGame")
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
                this.getGame();
              },
              (error) => {
                this.$message({
                  showClose: true,
                  center: true,
                  duration: 3000,
                  message: "Save failed!",
                  type: "error",
                });
                console.log("GameTable.vue - saveGame:>> " + error);
              }
            )
            .catch((error) => {
              this.loading = false;
              this.$message({
                message: error.message + ", please try again.",
                type: "error",
              });
              console.log("GameTable.vue - saveGame:>> " + error);
            });
        } else {
          this.isPress = !this.isPress;
          this.isEdit = !this.isEdit;
          this.getGame();
        }
      }
    },
  },
  created() {
    this.getGame();
  },
  destroyed() {
    this.$store.commit("game/setPageIndex", 1);
  },
  filters: {},
};
</script>
<style>
#game .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#game .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#game .el-checkbox__inner {
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
#game .game-frame {
  height: 50vh;
  min-height: 100px;
  max-height: 50vmax;
}
#game .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
#game .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#game .game-table {
  min-height: 31.5vh;
}
.el-table .error-row {
  background: #e99e9e;
}
.el-table .success-row {
  background: #f0f9eb;
}
.el-input-number__increase {
  display: none;
  width: 0px;
}
.el-input-number__decrease {
  display: none;
  width: 0px;
}
.el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
</style>
