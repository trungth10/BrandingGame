<template>
  <div style="font-size: 1.25rem" v-loading="loading" id="action-detail">
    <div class="">
      <div class="pb-2">
        <!-- card shadow card-body -->
        <!-- <h2>ACTION DETAIL</h2> -->
        <!-- <el-divider class="mt--1 mb-3" /> -->
        <el-form :model="action" ref="actionDetailForm" :rules="actionRules">
          <el-row>
            <el-col :span="24" class="pb-1 ml-2">
              <el-row>
                <el-form-item prop="name" label="Name" class="mb-2">
                  <el-input
                    class="pb-0"
                    type="text"
                    label="Action Name"
                    v-model="action.name"
                    placeholder="Input name here"
                    maxlength="100"
                    spellcheck="false"
                    show-word-limit
                  />
                </el-form-item>
              </el-row>
            </el-col>
            <el-col :span="24">
              <div v-if="action.actionType == $ENV.ACTION_TYPE.PRODUCT_AMOUNT">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> discount </label>
                    <el-form-item prop="discountAmount" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-0"
                        v-model="action.discountAmount"
                        :min="1"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="mb-0 ml-2"> VNĐ </label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2">
                      minimum price of product after discount is
                    </label>
                    <el-form-item prop="minPriceAfter" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-2"
                        v-model="action.minPriceAfter"
                        :min="0"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="mb-0 ml-2"> VNĐ</label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0"> for products in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1rem"
                      plain
                      class="ml-1"
                      @click="openDrawerProduct(productSelection)"
                      >selection list ({{ productSelection.length }})
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.PRODUCT_PERCENT">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> discount </label>
                    <el-form-item prop="discountPercentage" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number"
                        v-model="action.discountPercentage"
                        :min="1"
                        :max="100"
                      ></el-input-number>
                    </el-form-item>
                    <label class="mb-0 ml-2">%</label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> and maximum discount price is </label>
                    <el-form-item prop="maxAmount" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-0"
                        v-model="action.maxAmount"
                        :min="0"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="mb-0 ml-2">VNĐ</label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0"> for products in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1rem"
                      plain
                      class="ml-1"
                      @click="openDrawerProduct(productSelection)"
                      >selection list ({{ productSelection.length }})
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.PRODUCT_UNIT">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> discount </label>
                    <el-form-item prop="discountQuantity" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number"
                        v-model="action.discountQuantity"
                        :min="1"
                        :max="999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="mb-0 ml-2"> unit(s) of products in cart </label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0"> for products in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1rem"
                      plain
                      class="ml-1"
                      @click="openDrawerProduct(productSelection)"
                      >selection list ({{ productSelection.length }})
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.PRODUCT_FIXED">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> fixed price </label>
                    <el-form-item prop="fixedPrice" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number"
                        v-model="action.fixedPrice"
                        :min="1"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="mb-0 ml-2"> VNĐ </label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0"> for products in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1rem"
                      plain
                      class="ml-1"
                      @click="openDrawerProduct(productSelection)"
                      >selection list ({{ productSelection.length }})
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.PRODUCT_LADDER">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> buy product at the price </label>
                    <el-form-item prop="ladderPrice" class="mb-2">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number"
                        v-model="action.ladderPrice"
                        :min="1"
                        :max="99999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2 mb-0"> VNĐ </label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> since the </label>
                    <el-form-item prop="orderLadderProduct" class="mb-2">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number"
                        v-model="action.orderLadderProduct"
                        :min="1"
                        :max="10"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2 mb-0"> product </label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0"> for products in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1rem"
                      plain
                      class="ml-1"
                      @click="openDrawerProduct(productSelection)"
                      >selection list ({{ productSelection.length }})
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.PRODUCT_BUNDLE">
                <el-row>
                  <!-- <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> buy </label>
                    <el-form-item prop="bundleQuantity" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 15vw"
                        class="drag-input-number"
                        v-model="action.bundleQuantity"
                        :min="1"
                        :max="100"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2 mb-0"> product(s)</label>
                  </el-col> -->
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> with the price</label>
                    <el-form-item prop="bundlePrice" class="mb-2">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-0"
                        v-model="action.bundlePrice"
                        :min="1"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2 mb-0">VNĐ</label>
                  </el-col>
                  <!-- <el-col :span="24" class="ml-1 mb-1">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0"> apply for product(s) that are follow by </label>
                    <el-select
                      style="width: 11vw"
                      size="small"
                      class="ml-2"
                      v-model="action.bundleStrategy"
                      placeholder="Select strategy"
                    >
                      <el-option
                        v-for="item in strategyOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-col> -->
                  <el-col :span="24" class="ml-1 mb-1">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0"> for products in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1rem"
                      plain
                      class="ml-1"
                      @click="openDrawerProduct(productSelection)"
                      >selection list ({{ productSelection.length }})
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.ORDER_AMOUNT">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2"> discount </label>
                    <el-form-item prop="discountAmount" class="mb-2">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-0"
                        v-model="action.discountAmount"
                        :min="1"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-1 mb-0"> VNĐ for cart</label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2">
                      minimum price of cart after discount is
                    </label>
                    <el-form-item prop="minPriceAfter" class="mb-2">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-0"
                        v-model="action.minPriceAfter"
                        :min="0"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2 mb-0"> VNĐ</label>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.ORDER_PERCENT">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mr-2 mb-0"> discount </label>
                    <el-form-item prop="discountPercentage" class="mb-2">
                      <el-input-number
                        type="number"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number"
                        v-model="action.discountPercentage"
                        :min="1"
                        :max="100"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2 mb-0"> % for cart</label>
                  </el-col>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label class="mb-0 mr-2">maximum discount price</label>
                    <el-form-item prop="maxAmount" class="mb-2">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number"
                        v-model="action.maxAmount"
                        :min="0"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2 mb-0">VNĐ</label>
                  </el-col>
                </el-row>
              </div>
              <div v-if="action.actionType == $ENV.ACTION_TYPE.ORDER_SHIPPING">
                <el-row>
                  <el-col :span="24" class="ml-1 mb-1 row align-items-center">
                    <el-divider
                      class="custom-divider pb-2"
                      direction="vertical"
                    ></el-divider>
                    <span>
                      <label class="mr-2 mb-0"> discount </label>
                    </span>
                    <!-- //# Chọn amount hay percent -->
                    <el-select
                      style="width: 8vw"
                      size="small"
                      v-model="isShipAmount"
                      @change="changeShipDiscount"
                    >
                      <el-option :key="'shipAmount'" label="amount" :value="true">
                      </el-option>
                      <el-option :key="'shipPercent'" label="percentage" :value="false">
                      </el-option>
                    </el-select>
                    <!-- //# Nếu là amount -->
                    <span v-if="isShipAmount">
                      <el-form-item prop="discountAmount" class="mb-0 mr-0 ml-2">
                        <el-input-number
                          type="text"
                          size="small"
                          class="drag-input-number mr-2"
                          style="width: 10vw"
                          v-model="action.discountAmount"
                          :min="1"
                          :max="999999999"
                        ></el-input-number>
                        <label class="mb-0"> VNĐ for shipping fee of cart</label>
                      </el-form-item>
                    </span>
                    <!-- //# Nếu là percent -->
                    <span v-if="!isShipAmount" class="row align-items-center ml-1">
                      <el-form-item prop="discountPercentage" class="mb-0 mr-0 ml-2">
                        <el-input-number
                          type="text"
                          size="small"
                          class="drag-input-number mr-2"
                          style="width: 10vw"
                          v-model="action.discountPercentage"
                          :min="1"
                          :max="100"
                        >
                        </el-input-number>
                      </el-form-item>
                      <label class="mb-0"> % for shipping fee of cart</label>
                    </span>
                  </el-col>
                  <el-col
                    v-if="!isShipAmount"
                    :span="24"
                    class="ml-1 mb-1 mt-1 row align-items-center"
                  >
                    <el-divider
                      class="custom-divider pb-2"
                      direction="vertical"
                    ></el-divider>
                    <label class="mb-0 mr-2"> maximum discount price is </label>
                    <el-form-item prop="maxAmount" class="mb-0">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-0 mb-0"
                        v-model="action.maxAmount"
                        :min="0"
                        :max="999999999"
                      ></el-input-number>
                    </el-form-item>
                    <label class="mb-0 ml-2">VNĐ</label>
                  </el-col>
                </el-row>
              </div>
            </el-col>

            <!-- //# Button - Update Action -->
            <el-col>
              <el-row type="flex" justify="end">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-document-checked"
                  @click="updateAction"
                >
                  Update Action
                </el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- //# Cái bảng khi cho chọn sp -->
    <el-drawer
      id="action-detail-drawer"
      :append-to-body="true"
      :before-close="handleCloseDrawer"
      :visible.sync="drawer"
      v-show="drawer"
      size="50%"
      direction="rtl"
      class="drawer"
    >
      <div class="m-3">
        <h3>Product list</h3>
        <label class="custom-tag">
          <i class="el-icon-warning-outline mr-1"></i> Selected
          <b>{{ productSelection.length }}</b> product(s)
        </label>
        <el-table
          ref="multipleTable"
          :data="products"
          v-model="productSelection"
          border=""
          height="400"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column type="index"> </el-table-column>
          <el-table-column property="productName" width="250" label="Product name">
            <template slot-scope="scope">
              <label class="custom-content-break">
                {{ scope.row.productName }}
              </label>
            </template>
          </el-table-column>
          <el-table-column property="productCode" label="Product code" width="150">
            <template slot-scope="scope">
              <el-tag type="info" class="custom-content-break text-black" effect="plain">
                {{ scope.row.code }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column property="cateName" label="Category">
            <template slot-scope="scope">
              <label class="custom-content-break">
                {{ scope.row.cateName }}
              </label>
            </template>
          </el-table-column>
          <el-table-column
            v-if="action.actionType != $ENV.ACTION_TYPE.PRODUCT_UNIT"
            label="Quantity"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.quantity"
                :min="1"
                :max="10"
              ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-button
            type="primary"
            @click="selectProduct"
            class="float-right mt-3"
            icon="el-icon-plus"
            >Select Product</el-button
          >
        </el-col>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    //# Ở đây nhớ làm cái vụ tạo 1 obj rule rồi bắt lỗi
    return {
      strategyOptions: [
        {
          value: 1,
          name: "CHEAPEST",
        },
        {
          value: 2,
          name: "MOST EXPENSIVE",
        },
        {
          value: 3,
          name: "DEFAULT",
        },
      ],
      drawer: false,
      isEdit: false,
      loading: false,
      action: {
        actionType: 0,
        discountQuantity: 0,
        discountAmount: 0,
        discountPercentage: 0,
        fixedPrice: 0,
        maxAmount: 0,
        minPriceAfter: 0,
        orderLadderProduct: 0,
        ladderPrice: 0,
        bundlePrice: 0,
        bundleQuantity: 0,
        bundleStrategy: 0,
      },
      actionRules: {
        name: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input name!",
          },
        ],
        discountAmount: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the amount!",
          },
        ],
        minPriceAfter: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the minimum price of product!",
          },
        ],
        discountPercentage: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the percentage!",
          },
        ],
        maxAmount: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the maximum discount price!",
          },
        ],
        discountQuantity: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the quantity of product to discount!",
          },
        ],
        fixedPrice: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the price!",
          },
        ],
        ladderPrice: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the price!",
          },
        ],
        orderLadderProduct: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the order of product!",
          },
        ],
        bundleQuantity: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the quantity of product in bundle!",
          },
        ],
        bundlePrice: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the price!",
          },
        ],
        bundleStrategy: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input the price!",
          },
        ],
      },
      shippingOption: "1",
      productSelection: [],
      isShipAmount: true,
      CONSTANT: this.$ENV,
    };
  },
  computed: {
    actions() {
      return this.action;
    },
    products() {
      return this.$store.state.condition.products;
    },
    actionParam() {
      return this.$store.state.action.actionParam;
    },
  },
  methods: {
    editMode() {
      this.isEdit = !this.isEdit;
      if (!this.isEdit) {
        this.getActionDetail();
      }
    },
    handleSelectionChange(val) {
      this.productSelection = val;
    },
    selectProduct() {
      let valid = true;
      if (this.action.actionType != this.$ENV.ACTION_TYPE.PRODUCT_UNIT) {
        valid = this.validGiftQuantity();
      }
      if (!valid) {
        this.$notify({
          icon: "el-icon-warning",
          title: "Error",
          message: "Please input quantity",
          type: "warning",
        });
      } else {
        this.drawer = false;
      }
    },
    validGiftQuantity() {
      let valid = true;
      this.productSelection.forEach((product) => {
        if (product.quantity == undefined || product.quantity == 0) {
          valid = false;
        }
      });
      return valid;
    },
    openDrawerProduct() {
      this.drawer = true;
      this.$nextTick(function () {
        this.productSelection.forEach((element) => {
          let tmp = this.products.find((o) => o.productId == element.productId);
          tmp.quantity = element.quantity;
          this.$refs["multipleTable"].toggleRowSelection(tmp, true);
        });
      });
    },
    async setupData() {
      this.loading = true;
      await this.getActionDetail();
      await this.getProductList();
      this.setupAction();
      this.loading = false;
    },
    setupAction() {
      this.loading = true;
      this.productSelection = [];
      this.action = this.actionParam;
      if (this.action.actionType == this.$ENV.ACTION_TYPE.ORDER_SHIPPING) {
        this.isShipAmount = this.action.discountAmount > 0;
      }
      this.action.listProduct = [];
      this.productSelection = this.actionParam.listProductMapp;
      if (this.actionParam.listProductMapp) {
        this.actionParam.listProductMapp.forEach((product) => {
          this.action.listProduct.push(product.productId);
        });
      }
      this.loading = false;
    },
    async getActionDetail() {
      await this.$store
        .dispatch("action/getActionDetail")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Cannot get information",
              type: "warning",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Cannot get information",
            type: "warning",
          });
        });
    },
    handleCloseDrawer() {
      this.action.listProduct = [];
      if (this.productSelection.length > 0) {
        this.productSelection.forEach((element) => {
          this.action.listProduct.push(element.productId);
        });
      }
      this.drawer = false;
    },
    async getProductList() {
      await this.$store
        .dispatch("condition/getBrandProduct")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Get Product error !",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Get Product error !",
            type: "danger",
          });
        });
    },
    handleActionUpdate(action) {
      if (
        action.actionType != this.$ENV.ACTION_TYPE.PRODUCT_UNIT &&
        action.actionType >= this.$ENV.ACTION_TYPE.PRODUCT_AMOUNT
      ) {
        if (this.productSelection.length == 0) {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Please select product",
            type: "danger",
          });
          return;
        } else {
          action.listProduct = [];
          action.listProductMapp = [];
          this.productSelection.forEach((product) => {
            let dto = {
              productId: product.productId,
              quantity: product.quantity,
            };
            action.listProduct.push(dto);
          });
        }
      }
      return action;
    },
    //# Ở đây tìm chỗ để update trong bảng drawer
    //# để tìm hiểu lí do vì sao select trong bảng drawer ko cập nhật vô v-model
    updateAction() {
      this.$refs["actionDetailForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          let action = this.handleActionUpdate(this.action);
          if (action) {
            this.$store.commit("action/setUpdAction", action);
            this.$store
              .dispatch("action/updateAction")
              .then((result) => {
                this.loading = false;
                if (result.status == 200) {
                  this.$notify({
                    icon: "el-icon-warning",
                    title: "Success",
                    message: "Update success, please try again",
                    type: "success",
                  });
                  // this.$emit("reset", 1);
                } else {
                  this.$notify({
                    icon: "el-icon-warning",
                    title: "Error",
                    message: "Update failed, please try again",
                    type: "danger",
                  });
                }
              })
              .catch(() => {
                this.loading = false;
                this.$notify({
                  icon: "el-icon-warning",
                  title: "Error",
                  message: "Update failed, please try again",
                  type: "danger",
                });
              });
          }
        }
      });
    },
  },
  async created() {
    await this.setupData();
  },
};
</script>

<style>
#action-detail .el-form-item__error {
  padding-top: 0;
}
#action-detail .el-input-number__increase {
  display: none;
  width: 0px;
}
#action-detail .el-input-number__decrease {
  display: none;
  width: 0px;
}
#action-detail .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}

#action-detail-drawer .el-input-number__increase {
  display: none;
  width: 0px;
}
#action-detail-drawer .el-input-number__decrease {
  display: none;
  width: 0px;
}
#action-detail-drawer .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
#action-detail-drawer .el-input-number {
  width: 100%;
}

.el-divider--vertical {
  width: 0.15vw;
  height: 1.9vw;
  margin-left: 5px;
  margin-bottom: 10px;
  margin-top: 5px;
}
.custom-tag {
  font-size: 16px;
  background-color: #faecd8;
  color: #e6a23c;
  padding: 10px;
  width: 47.5vw;
}
</style>
