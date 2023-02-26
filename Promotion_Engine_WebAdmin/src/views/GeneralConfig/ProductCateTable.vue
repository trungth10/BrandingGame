<template>
  <div class="card shadow container-fluid mt-3 mb-3 pb-2" id="product-cate">
    <!-- //# Name and buttons -->
    <div class="row pt-3 pb-2">
      <div class="col-6">
        <div class="row justify-content-start">
          <strong>Product Categories</strong>
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
            @click="saveProdCate"
            >Save</el-button
          >
          <el-button
            @click="editMode"
            v-show="productCateList.length > 0"
            v-if="!this.isPress"
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
            v-show="productCateList.length > 0"
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
        <!-- //# Input Category Id -->
        <el-form-item class="col-5 mb-0" prop="cateId">
          <p class="mb-0">
            <small> Category Id </small>
          </p>
          <el-input
            type="text"
            v-model="createForm.cateId"
            placeholder="Input Id here"
            size="small"
            maxlength="30"
            spellcheck="false"
            @keydown.native.space.prevent
            show-word-limit
          />
        </el-form-item>

        <!-- //# Input Category Name -->
        <el-form-item class="col-5 mb-3" prop="name">
          <p class="mb-0">
            <small> Category Name </small>
          </p>
          <el-input
            type="text"
            v-model="createForm.name"
            placeholder="Input name here"
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

    <!-- //# Product Cate Table -->
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="productCateList"
      @selection-change="handleSelectionChange"
      class="mb-2 product-cate-table"
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
      <el-table-column
        label="No."
        type="index"
        :index="indexMethod"
        width="50"
      />

      <!-- //# Table - Product Cate Id -->
      <el-table-column label="Category Id" prop="cateId">
        <template slot-scope="scope">
          <el-input
            v-if="isEdit"
            type="text"
            v-model="scope.row.cateId"
            @input="handleChangeId(scope.$index, scope.row.cateId)"
            placeholder="Input Id here"
            size="small"
            maxlength="30"
            spellcheck="false"
            :valid="scope.row.valid"
            @keydown.native.space.prevent
            show-word-limit
          />
          <label v-if="!isEdit" class="mb-0">{{ scope.row.cateId }}</label>
        </template>
      </el-table-column>

      <!-- //# Categories -->
      <el-table-column label="Category Name" prop="name">
        <template slot-scope="scope">
          <el-input
            v-if="isEdit"
            :disabled="!isEdit"
            type="text"
            v-model="scope.row.name"
            @input="handleChangeName(scope.$index, scope.row.name)"
            placeholder="Input name here"
            size="small"
            maxlength="50"
            spellcheck="false"
            :valid="scope.row.valid"
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
        <el-button type="primary" @click="hideProdCate">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "product-cate-table",
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
      isActive: true,
      multiSelection: [],
      errorIndex: [],
      editIndex: [],
      createForm: {
        cateId: "",
        name: "",
      },
      dialogVisible: false,
      addRules: {
        cateId: [{ validator: this.validateAddCode, trigger: "change" }],
        name: [{ validator: this.validateAddName, trigger: "change" }],
      },
    };
  },
  watch: {
    editIndex() {
      if (this.editIndex) {
        for (const index of this.editIndex) {
          let product = this.productCateList[index];

          if (!product.cateId || !product.name.trim()) {
            if (!product.cateId && product.name.trim()) {
              if (!this.errorIndex.includes(index)) {
                console.log(
                  "đẩy lỗi ở editIndex !product.cateId && product.name.trim()"
                );
                this.errorIndex.push(index);
              }
            } else if (product.cateId && !product.name.trim()) {
              if (!this.errorIndex.includes(index)) {
                console.log(
                  "đẩy lỗi ở editIndex product.cateId && !product.name.trim()"
                );
                this.errorIndex.push(index);
              }
            }
          }
        }
      }
    },
  },
  props: {},
  computed: {
    productCateList() {
      this.setPageCount();
      return this.$store.state.product_cate.productCateList;
    },
    productCateIdList() {
      return this.$store.state.product_cate.productCateIdList;
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
    validateAddCode(rule, value, callback) {
      if (!value) {
        callback(new Error("Id is required!"));
      } else {
        let codes = this.productCateIdList;
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 127)
            callback(new Error("Accept no Unicode!"));
        }
        if (!value.trim()) {
          callback(new Error("Id is required!"));
        } else if (codes.indexOf(value) != -1) {
          callback(new Error("Duplicate Id!"));
        } else {
          callback();
        }
      }
    },
    resetPage() {
      this.$refs["basePagination"].changePage(1);
    },
    getProductCate() {
      this.$store
        .dispatch("product_cate/getProductCate")
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("ProductCateTable.vue - getProdCate:>> " + error);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addProductCate();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addProductCate() {
      this.loading = true;
      this.$store.commit(
        "product_cate/setCateId",
        this.createForm.cateId.trim()
      );
      this.$store.commit(
        "product_cate/setName",
        this.createForm.name.replace(/\s+/g, " ").trim()
      );

      this.$store
        .dispatch("product_cate/addProdCate")
        .then(
          () => {
            this.$message({
              message: "Add successful.",
              type: "success",
            });
            console.log("dispatch success");
            this.loading = false;
            this.isPress = !this.isPress;
            this.isAdd = !this.isAdd;
            this.createForm.cateId = "";
            this.createForm.name = "";
            this.resetPage();
            this.getProductCate();
          },
          (error) => {
            this.$message({
              message: "Add failed.",
              type: "danger",
            });
            console.log("ProductCateTable.vue - addProdCate:>> " + error);
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("ProductCateTable.vue - addProdCate:>> " + error);
        });
    },
    changePage(index) {
      this.$store.commit("product_cate/setPageIndex", index);
      this.loading = true;
      this.getProductCate();
    },
    setPageCount() {
      let pageSize = this.$store.state.product_cate.PageSize;
      this.pageCount = Math.ceil(
        this.$store.state.product_cate.counter / pageSize
      );
    },
    indexMethod(index) {
      let PageSize = this.$store.state.product_cate.PageSize;
      let PageIndex = this.$store.state.product_cate.PageIndex;
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
        this.editIndex = [];
        this.errorIndex = [];
        this.handleSelectionChange([]);
        this.getProductCate();
      }
    },
    addMode() {
      this.isAdd = !this.isAdd;
      this.isPress = !this.isPress;
      if (!this.isAdd) {
        this.createForm.cateId = "";
        this.createForm.name = "";
        this.handleSelectionChange([]);
        this.getProductCate();
      }
    },
    cancelDialog() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.handleSelectionChange([]);
        this.getProductCate();
      }
    },
    handleChangeId(index, value) {
      console.log("handleChangeId :>> ", value);
      if (value) {
        let existUnicode = false;
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 127) {
            existUnicode = true;
          }
        }
        if (existUnicode) {
          this.$message({
            showClose: true,
            center: true,
            duration: 2500,
            message: "Accept no Unicode!",
            type: "error",
          });
          if (!this.errorIndex.includes(index)) {
            console.log("đẩy lỗi ở handleChangeId existUnicode");
            this.errorIndex.push(index);
          }
          console.log("this.errorIndex :>> ", this.errorIndex);
        } else {
          if (this.errorIndex.includes(index)) {
            console.log("gỡ lỗi ở handlechangeId");
            this.errorIndex.splice(this.errorIndex.indexOf(index), 1);
          }
          this.$store.commit("product_cate/setCateId", value);
          this.$store.commit(
            "product_cate/setProductCateId",
            this.productCateList[index].productCateId
          );
          this.$store.dispatch("product_cate/checkDuplicate").then(() => {
            this.isDuplicate = this.$store.state.product_cate.isDuplicate;
            if (this.isDuplicate) {
              this.$message({
                showClose: true,
                center: true,
                duration: 2500,
                message: "Duplicate Code!",
                type: "error",
              });
              if (!this.errorIndex.includes(index)) {
                console.log("đẩy lỗi ở handleChangeId checkDuplicate");
                this.errorIndex.push(index);
              }
            }
          });
        }
      } else {
        this.$message({
          showClose: true,
          center: true,
          duration: 2500,
          message: "CateId is required!",
          type: "error",
        });
        if (!this.errorIndex.includes(index)) {
          console.log("đẩy lỗi ở handleChangeId khi mà ko có value");
          this.errorIndex.push(index);
        }
      }
      this.handleChange(index);
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
      if (this.editIndex.includes(index)) {
        this.editIndex.splice(this.editIndex.indexOf(index), 1, index);
      } else {
        this.editIndex.push(index);
      }
    },
    hideProdCate() {
      this.loading = !this.loading;
      let removeObj = this.multiSelection;
      this.$store.commit("product_cate/setHideParams", removeObj);

      this.$store
        .dispatch("product_cate/hideProdCate")
        .then(
          () => {
            this.$message({
              message: "Delete successful.",
              type: "warning",
            });
            this.dialogVisible = !this.dialogVisible;
            this.resetPage();
            this.getProductCate();
          },
          (error) => {
            console.log("Delete FAIL: product_cate/hideProdCate");
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
          console.log("ProductCateTable.vue - hideProdCate:>> " + error);
        });
    },
    saveProdCate() {
      if (this.errorIndex.length > 0) {
        this.$message({
          showClose: true,
          center: true,
          duration: 5000,
          message: "Product Categories: Please check again the error field(s)!",
          type: "error",
        });
        console.log("this.errorIndex :>> ", this.errorIndex);
      } else {
        this.loading = true;
        if (this.editIndex != null && this.editIndex.length > 0) {
          let updateParams = [];
          this.editIndex.forEach((index) => {
            let param = {
              productCateId: this.productCateList[index].productCateId,
              cateId: this.productCateList[index].cateId.trim(),
              name: this.productCateList[index].name
                .replace(/\s +/g, " ")
                .trim(),
            };
            updateParams.push(param);
          });
          this.$store.commit("product_cate/setUpdateParams", updateParams);

          this.$store
            .dispatch("product_cate/saveProdCate")
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
                this.getProductCate();
              },
              (error) => {
                this.$message({
                  showClose: true,
                  center: true,
                  duration: 3000,
                  message: "Save failed!",
                  type: "error",
                });
                console.log("ProductCateTable.vue - saveProdCate:>> " + error);
              }
            )
            .catch((error) => {
              this.loading = false;
              this.$message({
                message: error.message + ", please try again.",
                type: "error",
              });
              console.log("ProductCateTable.vue - saveProdCate:>> " + error);
            });
        } else {
          this.isPress = !this.isPress;
          this.isEdit = !this.isEdit;
          this.getProductCate();
        }
      }
    },
  },
  created() {
    this.getProductCate();
  },
  destroyed() {
    this.$store.commit("product_cate/setPageIndex", 1);
  },
  filters: {},
};
</script>
<style>
#product-cate .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#product-cate .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#product-cate .el-checkbox__inner {
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
#product-cate .product-cate-frame {
  height: 50vh;
  min-height: 100px;
  max-height: 50vmax;
}
#product-cate .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
#product-cate .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#product-cate .product-cate-table {
  min-height: 31.5vh;
}
</style>