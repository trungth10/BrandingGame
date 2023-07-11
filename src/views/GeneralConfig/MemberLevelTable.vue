<template>
  <div class="card shadow container-fluid mt-3 mb-3 pb-2" id="member-level">
    <!-- //# Name and buttons -->
    <div class="row pt-3 pb-2">
      <div class="col-6">
        <div class="row justify-content-start">
          <strong>Membership Levels</strong>
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
            @click="saveMemLv"
            >Save</el-button
          >
          <el-button
            @click="editMode"
            v-if="!this.isPress"
            v-show="memberLevelList.length > 0"
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
            v-show="memberLevelList.length > 0"
            type="danger"
            icon="el-icon-delete"
            :disabled="!multiSelection.length > 0"
            size="mini"
            >Delete</el-button
          >
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
          <!-- //# Input Member level name -->
          <el-form-item class="col-6 mb-3" prop="name">
            <p class="mb-0">
              <small> Membership Level </small>
            </p>
            <el-input
              type="text"
              v-model="createForm.name"
              placeholder="Input Name here"
              size="small"
              maxlength="50"
              spellcheck="false"
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
    </div>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="memberLevelList"
      @selection-change="handleSelectionChange"
      class="mb-2 member-level-table"
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
      <el-table-column
        label="No."
        type="index"
        :index="indexMethod"
        width="50"
      />
      <el-table-column label="Membership Levels" prop="name">
        <template slot-scope="scope">
          <el-input
            v-if="isEdit"
            type="text"
            v-model="scope.row.name"
            @input="handleChangeName(scope.$index, scope.row.name)"
            placeholder="Input Id here"
            size="small"
            maxlength="50"
            spellcheck="false"
            show-word-limit
          />
          <label v-if="!isEdit" class="mb-0">{{ scope.row.name }}</label>
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
        <el-button type="primary" @click="hideMemLv">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "member-level-table",
  watch: {},
  data() {
    return {
      isEdit: false,
      isAdd: false,
      isPress: false,
      loading: true,
      pagination: {
        default: 1,
      },
      pageCount: 1,
      isActive: true,
      multiSelection: [],
      errorIndex: [],
      editIndex: [],
      createForm: {
        name: "",
      },
      dialogVisible: false,
      addRules: {
        name: [{ validator: this.validateAddName, trigger: "change" }],
      },
    };
  },
  props: {},
  computed: {
    memberLevelList() {
      this.setPageCount();
      return this.$store.state.member_level.memberLevelList;
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
    getMemLv() {
      this.$store
        .dispatch("member_level/getMemberLevel")
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("MemberLevelTable.vue - getMemLv:>> " + error);
        });
    },
    setPageCount() {
      let pageSize = this.$store.state.member_level.PageSize;
      this.pageCount = Math.ceil(
        this.$store.state.member_level.counter / pageSize
      );
    },
    indexMethod(index) {
      let PageSize = this.$store.state.member_level.PageSize;
      let PageIndex = this.$store.state.member_level.PageIndex;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    changePage(index) {
      this.$store.commit("member_level/setPageIndex", index);
      this.loading = true;
      this.getMemLv();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addMemLv();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    addMemLv() {
      this.loading = true;
      this.$store.commit(
        "member_level/setName",
        this.createForm.name.replace(/\s +/g, " ").trim()
      );

      this.$store
        .dispatch("member_level/addMemLv")
        .then(
          () => {
            this.$message({
              showClose: true,
              center: true,
              duration: 3000,
              message: "Add successful!",
              type: "success",
            });
            this.loading = false;
            this.isPress = !this.isPress;
            this.isAdd = !this.isAdd;
            this.createForm.name = "";
            this.resetPage();
            this.getMemLv();
          },
          (error) => {
            this.$message({
              message: "Add failed.",
              type: "danger",
            });
            console.log("MemberLevelTable.vue - addMemLv:>> " + error);
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("ProductCateTable.vue - addMemLv:>> " + error);
        });
    },
    handleSelectionChange(val) {
      console.log("val :>> ", val);
      this.multiSelection = val;
    },
    editMode() {
      this.isEdit = !this.isEdit;
      this.isPress = !this.isPress;
      if (!this.isEdit) {
        this.editIndex = [];
        this.errorIndex = [];
        this.handleSelectionChange([]);
        this.getMemLv();
      }
    },
    addMode() {
      this.isAdd = !this.isAdd;
      this.isPress = !this.isPress;
      if (!this.isAdd) {
        this.createForm.cateId = "";
        this.createForm.name = "";
        this.handleSelectionChange([]);
        this.getMemLv();
      }
    },
    cancelDialog() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.handleSelectionChange([]);
        this.getMemLv();
      }
    },
    hideMemLv() {
      this.loading = !this.loading;
      let removeObj = this.multiSelection;
      this.$store.commit("member_level/setHideParams", removeObj);

      this.$store
        .dispatch("member_level/hideMemLv")
        .then(
          () => {
            this.$message({
              showClose: true,
              center: true,
              duration: 3000,
              message: "Delete successful.",
              type: "warning",
            });
            this.dialogVisible = !this.dialogVisible;
            this.resetPage();
            this.getMemLv();
          },
          (error) => {
            console.log("Delete FAIL: member_level/hideMemLv");
            console.log(error);
            this.loading = false;
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("MemberLevelTable.vue - hideMemLv:>> " + error);
        });
    },
    saveMemLv() {
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
          //# ở đây setUpdate param, sau đó gọi hàm save MemLv (api put trên này)
          let updateParams = [];
          this.editIndex.forEach((index) => {
            let param = {
              memberLevelId: this.memberLevelList[index].memberLevelId,
              name: this.memberLevelList[index].name
                .replace(/\s +/g, " ")
                .trim(),
            };
            updateParams.push(param);
          });
          this.$store.commit("member_level/setUpdateParams", updateParams);
          this.$store
            .dispatch("member_level/saveMemLv")
            .then(
              () => {
                this.$message({
                  showClose: true,
                  center: true,
                  duration: 3000,
                  message: "Save successful!",
                  type: "success",
                });
                this.editIndex = [];
                this.errorIndex = [];
                this.isPress = !this.isPress;
                this.isEdit = !this.isEdit;
                this.resetPage();
                this.getMemLv();
              },
              (error) => {
                this.$message({
                  message: "Save failed.",
                  type: "danger",
                });
                console.log("MemberLevelTable.vue - saveMemLv:>> " + error);
              }
            )
            .catch((error) => {
              this.loading = false;
              this.$message({
                message: error.message + ", please try again.",
                type: "error",
              });
              console.log("MemberLevelTable.vue - saveMemLv:>> " + error);
            });
        } else {
          this.isPress = !this.isPress;
          this.isEdit = !this.isEdit;
          this.getMemLv();
        }
      }
    },
  },
  created() {
    this.getMemLv();
  },
  destroyed() {
    // this.$store.commit("member_level/setPageIndex", 1);
  },
};
</script>

<style>
#member-level .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#member-level .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#member-level .el-checkbox__inner {
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
#member-level .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
#member-level .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#member-level .member-level-table {
  min-height: 31.5vh;
}
</style>