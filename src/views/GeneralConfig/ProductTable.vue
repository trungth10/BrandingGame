<template>
  <div class="card shadow container-fluid mt-3 mb-3 pb-2" id="product">
    <!-- //# Name and buttons -->
    <div class="row pt-3 pb-2">
      <div class="col-6">
        <div class="row justify-content-start">
          <strong>Products</strong>
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
            @click="saveProd"
            >Save</el-button
          >
          <el-button
            @click="editMode"
            v-show="productList.length > 0"
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
            v-show="productList.length > 0"
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
        <!-- //# Add - Select CateId -->
        <el-form-item class="col-3 align-self-center" prop="productCateId">
          <p class="mb-0">
            <small> Product Category</small>
          </p>
          <el-select
            :disabled="!isAdd"
            v-model="createForm.productCateId"
            placeholder="Select Category"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="productCate in productCateList"
              :key="productCate.productCateId"
              :label="productCate.name"
              :value="productCate.productCateId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- //# Add - Input Product Code -->
        <el-form-item class="col-4 mb-0" prop="code">
          <p class="mb-0">
            <small> Product Code </small>
          </p>
          <el-input
            type="text"
            v-model="createForm.code"
            placeholder="Input Code here"
            size="small"
            maxlength="50"
            spellcheck="false"
            @keydown.native.space.prevent
            show-word-limit
          />
        </el-form-item>

        <!-- //# Add - Input Product Name -->
        <el-form-item class="col-4 mb-3" prop="name">
          <p class="mb-0">
            <small> Product Name </small>
          </p>
          <el-input
            type="text"
            v-model="createForm.name"
            placeholder="Input name here"
            size="small"
            maxlength="80"
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

    <!-- //# Product Table -->
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="productList"
      @selection-change="handleSelectionChange"
      class="mb-2 product-table"
      max-height="580"
      style="width: 100%"
      :cell-style="{
        padding: '0px',
        height: '5vh',
      }"
      stripe
    >
      <el-table-column type="selection" align="center" fixed class="pt-0 pb-0" />

      <!-- //# Table - No. -->
      <el-table-column label="No." type="index" :index="indexMethod" width="50" />

      <!-- //# Table - Product Cate -->
      <el-table-column
        label="Product Category"
        prop="cateId"
        width="180"
        class="pt-0 pb-0"
      >
        <template slot-scope="scope" class="pt-0 pb-0">
          <!--  //# Table - Select List -->
          <el-select
            :disabled="!isEdit"
            v-model="scope.row.productCateId"
            placeholder=""
            size="small"
            @change="handleChange(scope.$index)"
          >
            <el-option
              v-for="productCate in productCateList"
              :key="productCate.productCateId"
              :label="productCate.name"
              :value="productCate.productCateId"
            >
              <span style="float: left">{{ productCate.name }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <!-- //# Table - Product Code -->
      <el-table-column label="Product Code" prop="code">
        <template slot-scope="scope">
          <el-input
            v-if="isEdit"
            type="text"
            v-model="scope.row.code"
            @input="handleChangeCode(scope.$index, scope.row.code)"
            placeholder="Input code here"
            size="small"
            maxlength="50"
            spellcheck="false"
            :valid="scope.row.valid"
            @keydown.native.space.prevent
            show-word-limit
          >
          </el-input>
          <label v-if="!isEdit" class="mb-0">{{ scope.row.code }}</label>
        </template>
      </el-table-column>

      <!-- //# Table - Product Name -->
      <el-table-column label="Product Name" prop="productName" class="pt-0 pb-0">
        <template slot-scope="scope" class="pt-0 pb-0">
          <el-input
            v-if="isEdit"
            type="text"
            v-model="scope.row.productName"
            @input="handleChangeName(scope.$index, scope.row.productName)"
            placeholder="Input name here"
            size="small"
            maxlength="80"
            spellcheck="false"
            :valid="scope.row.valid"
            show-word-limit
          />
          <label v-if="!isEdit" class="mb-0">{{ scope.row.productName }}</label>
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
        <el-button type="primary" @click="hideProd">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "product-table",
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
        productCateId: "",
        code: "",
        name: "",
      },
      dialogVisible: false,
      addRules: {
        code: [{ validator: this.validateAddCode, trigger: "change" }],
        name: [{ validator: this.validateAddName, trigger: "change" }],
        productCateId: [{ required: true, message: "Category is required!" }],
      },
    };
  },
  watch: {
    editIndex() {
      if (this.editIndex) {
        for (const index of this.editIndex) {
          let product = this.productList[index];

          if (!product.code || !product.productName.trim()) {
            if (!product.code && product.productName.trim()) {
              if (!this.errorIndex.includes(index)) {
                console.log(
                  "đẩy lỗi ở editIndex !product.code && product.productName.trim()"
                );
                this.errorIndex.push(index);
              }
            } else if (product.code && !product.productName.trim()) {
              if (!this.errorIndex.includes(index)) {
                console.log(
                  "đẩy lỗi ở editIndex product.code && !product.productName.trim()"
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
    productList() {
      this.setPageCount();
      return this.$store.state.product.productList;
    },
    productCodeList() {
      return this.$store.state.product.productCodeList;
    },
    productCateList() {
      return this.$store.state.product_cate.productCateSelectList;
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
        callback(new Error("Code is required!"));
      } else {
        let codes = this.productCodeList;
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 127) callback(new Error("Accept no Unicode!"));
        }
        if (!value.trim()) {
          callback(new Error("Code is required!"));
        } else if (codes.indexOf(value) != -1) {
          callback(new Error("Duplicate Code!"));
        } else {
          callback();
        }
      }
    },
    resetPage() {
      this.$refs["basePagination"].changePage(1);
    },
    getProduct() {
      this.$store
        .dispatch("product/getProduct")
        .then(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("ProductTable.vue - getProduct:>> " + error);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addProduct();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addProduct() {
      this.loading = true;
      this.$store.commit("product/setProductCateId", this.createForm.productCateId);
      this.$store.commit(
        "product/setProductName",
        this.createForm.name.replace(/\s+/g, " ").trim()
      );
      this.$store.commit("product/setCode", this.createForm.code.trim());

      this.$store
        .dispatch("product/addProd")
        .then(
          () => {
            this.$message({
              message: "Add successful.",
              type: "success",
            });
            this.loading = false;
            this.isPress = !this.isPress;
            this.isAdd = !this.isAdd;
            this.createForm.productCateId = "";
            this.createForm.code = "";
            this.createForm.name = "";
            this.resetPage();
            this.getProduct();
          },
          (error) => {
            this.$message({
              message: "Add failed.",
              type: "danger",
            });
            console.log("ProductTable.vue - addProd:>> " + error);
          }
        )
        .catch((error) => {
          this.loading = false;
          this.$message({
            message: error.message + ", please try again.",
            type: "error",
          });
          console.log("ProductTable.vue - addProd:>> " + error);
        });
    },
    changePage(index) {
      console.log("index :>> ", index);
      this.$store.commit("product/setPageIndex", index);
      this.loading = true;
      this.getProduct();
    },
    setPageCount() {
      let pageSize = this.$store.state.product.PageSize;
      this.pageCount = Math.ceil(this.$store.state.product.counter / pageSize);
    },
    indexMethod(index) {
      let PageSize = this.$store.state.product.PageSize;
      let PageIndex = this.$store.state.product.PageIndex;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    handleSelectionChange(rows) {
      this.multiSelection = rows;
    },
    editMode() {
      this.isEdit = !this.isEdit;
      this.isPress = !this.isPress;
      if (!this.isEdit) {
        this.editIndex = [];
        this.errorIndex = [];
        this.handleSelectionChange([]);
        this.getProduct();
      }
    },
    addMode() {
      this.isAdd = !this.isAdd;
      this.isPress = !this.isPress;
      if (!this.isAdd) {
        this.createForm.code = "";
        this.createForm.name = "";
        this.createForm.productCateId = "";
        this.handleSelectionChange([]);
        this.getProduct();
      }
    },
    cancelDialog() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.handleSelectionChange([]);
        this.getProduct();
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
          this.$message({
            showClose: true,
            center: true,
            duration: 2500,
            message: "Accept no Unicode!",
            type: "error",
          });
          if (!this.errorIndex.includes(index)) {
            console.log("đẩy lỗi ở handleChangeCode existUnicode");
            this.errorIndex.push(index);
          }
          console.log("this.errorIndex :>> ", this.errorIndex);
        } else {
          if (this.errorIndex.includes(index)) {
            console.log("gỡ lỗi ở handlechangeCode");
            this.errorIndex.splice(this.errorIndex.indexOf(index), 1);
          }
          this.$store.commit("product/setProductCode", value);
          this.$store.commit("product/setProductId", this.productList[index].productId);
          this.$store.dispatch("product/checkDuplicate").then(() => {
            this.isDuplicate = this.$store.state.product.isDuplicate;
            if (this.isDuplicate) {
              this.$message({
                showClose: true,
                center: true,
                duration: 2500,
                message: "Duplicate Code!",
                type: "error",
              });
              if (!this.errorIndex.includes(index)) {
                console.log("đẩy lỗi ở handleChangeCode checkDuplicate");
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
          message: "Code is required!",
          type: "error",
        });
        if (!this.errorIndex.includes(index)) {
          console.log("đẩy lỗi ở handleChangeCode khi mà ko có value");
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
    hideProd() {
      this.loading = !this.loading;
      let removeObj = this.multiSelection;
      this.$store.commit("product/setHideParams", removeObj);

      this.$store
        .dispatch("product/hideProd")
        .then(
          () => {
            this.$message({
              message: "Delete successful.",
              type: "warning",
            });
            this.resetPage();
            this.dialogVisible = !this.dialogVisible;
            this.getProduct();
          },
          (error) => {
            console.log("Delete FAIL: product/hideProd");
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
          console.log("ProductTable.vue - hideProd:>> " + error);
        });
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
    saveProd() {
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
        console.log("this.errorIndex khi ko có lỗi :>> ", this.errorIndex);

        this.loading = true;
        if (this.editIndex != null && this.editIndex.length > 0) {
          let updateParams = [];
          this.editIndex.forEach((index) => {
            let param = {
              productId: this.productList[index].productId,
              productCateId: this.productList[index].productCateId,
              code: this.productList[index].code.trim(),
              name: this.productList[index].productName.replace(/\s +/g, " ").trim(),
            };
            updateParams.push(param);
          });
          this.$store.commit("product/setUpdateParams", updateParams);

          this.$store
            .dispatch("product/saveProd")
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
                this.getProduct();
              },
              (error) => {
                this.$message({
                  showClose: true,
                  center: true,
                  duration: 3000,
                  message: "Save failed!",
                  type: "error",
                });
                console.log("ProductTable.vue - saveProd:>> " + error);
              }
            )
            .catch((error) => {
              this.loading = false;
              this.$message({
                message: error.message + ", please try again.",
                type: "error",
              });
              console.log("ProductTable.vue - saveProd:>> " + error);
            });
        } else {
          this.isPress = !this.isPress;
          this.isEdit = !this.isEdit;
          this.getProduct();
        }
      }
    },
  },
  created() {
    this.getProductCate();
    this.getProduct();
  },
  destroyed() {
    this.$store.commit("product/setPageIndex", 1);
  },
  filters: {},
};
</script>
<style>
#product .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#product .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#product .el-checkbox__inner {
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
#product .product-frame {
  height: 50vh;
  min-height: 100px;
  max-height: 50vmax;
}
/* #product tr.el-table__row.hover-row {
  background-color: #2dce8933 #4CE40033 !important;
} */
#product .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
#product .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#product .product-table {
  min-height: 31.5vh;
}
</style>
