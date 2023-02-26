<template>
  <div style="font-size: 1.25rem" v-loading="loading">
    <div class="">
      <div class="pb-2">
        <!-- card shadow card-body  -->
        <!-- <h2>GIFT ACTION DETAIL</h2> -->
        <!-- <el-divider class="mt--1 mb-3" /> -->
        <el-form :model="gift" ref="giftForm" :rules="actionRules">
          <el-row>
            <el-col :span="24" class="pb-1 ml-2">
              <el-form-item prop="name" label="Name">
                <el-input
                  type="text"
                  label="Action Name"
                  v-model="gift.name"
                  placeholder="Input name here"
                  maxlength="100"
                  spellcheck="false"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div v-if="gift.postActionType == $ENV.POST_ACTION_TYPE.GIFT_PRODUCT">
                <el-row>
                  <el-col :span="24">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label> gift product in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1.2rem"
                      plain
                      class="ml-2"
                      @click="openDrawerProduct(productSelection)"
                      >selection list ({{ productSelection.length }})
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="gift.postActionType == $ENV.POST_ACTION_TYPE.GIFT_VOUCHER">
                <el-row>
                  <el-col :span="24">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>

                    <label class="mr-2"> gift a voucher from promotion </label>

                    <el-select v-model="gift.giftVoucherGroupId">
                      <el-option
                        v-for="(group, index) in voucherGroups"
                        :key="index"
                        :label="group.name"
                        :value="group.voucherGroupId"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
              <div v-if="gift.postActionType == $ENV.POST_ACTION_TYPE.GIFT_POINT">
                <el-row>
                  <el-col :span="24">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>

                    <label> Give </label>
                    <el-form-item prop="bonusPoint">
                      <el-input-number
                        type="text"
                        size="small"
                        style="width: 10vw"
                        class="drag-input-number ml-2"
                        :min="1"
                        :max="99999999"
                        v-model="gift.bonusPoint"
                      ></el-input-number>
                    </el-form-item>
                    <label class="ml-2"> point(s) for customer </label>
                  </el-col>
                </el-row>
              </div>
              <div v-if="gift.postActionType == $ENV.POST_ACTION_TYPE.GIFT_GAME_CODE">
                <el-row>
                  <el-col :span="24">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>

                    <label class="mr-3"> Gift a Game Code of </label>
                    <el-select v-model="gift.gameCampaignId">
                      <el-option
                        v-for="(game, index) in games"
                        :key="index"
                        :label="game.name"
                        :value="game.id"
                      >
                      </el-option>
                    </el-select>
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
                  Update Gift
                </el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- //# Cái bảng khi cho chọn sp -->
    <el-drawer
      id="gift-action-detail"
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
          @select="handleSelectRow"
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
            v-if="gift.postActionType == $ENV.POST_ACTION_TYPE.GIFT_PRODUCT"
            label="Quantity"
            width="120"
          >
            <template slot-scope="scope">
              <el-input-number
                style="width: 100%"
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
      loading: false,
      drawer: false,
      isEdit: false,
      gift: {
        giftId: "",
        postActionType: 0,
        bonusPoint: 0,
        name: "",
        brandId: "",
        listProduct: [],
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
        bonusPoint: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input ponit!",
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
    games() {
      return this.$store.state.game_campaign.gameConfigs;
    },
    actions() {
      return this.action;
    },
    products() {
      return this.$store.state.condition.products;
    },
    actionParam() {
      return this.$store.state.action.giftParam;
    },
    voucherGroups() {
      return this.$store.state.voucher.availVouchers;
    },
  },
  methods: {
    handleSelectRow(selection, row) {
      let id = row.productId;
      let exist = selection.find((el) => el.productId == id) != null;
      console.log(exist);
      if (!exist) {
        row.quantity = 0;
      }
    },
    async getVoucherGroups() {
      this.loading = true;
      this.$store.commit("voucher/setAvailPageSize", 0);
      this.$store.commit("voucher/setAvailPageIndex", 0);
      await this.$store
        .dispatch("voucher/getAvailableVoucher")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              title: "Warning",
              message: "Cannot get Vouchers",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            title: "Warning",
            message: "Cannot get Vouchers",
            type: "warning",
          });
        });
    },
    editMode() {
      this.isEdit = !this.isEdit;
      if (!this.isEdit) {
        this.getGiftDetail();
      }
    },
    handleSelectionChange(val) {
      this.productSelection = val;
    },
    selectProduct() {
      let GIFT_PRODUCT = this.$ENV.POST_ACTION_TYPE.GIFT_PRODUCT;
      let valid = true;
      if (this.gift.postActionType == GIFT_PRODUCT) {
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
          console.log("forEach");
          let tmp = this.products.find((o) => o.productId == element.productId);
          if (tmp) {
            tmp.quantity = element.quantity;
            this.$refs["multipleTable"].toggleRowSelection(tmp, true);
          }
        });
      });
    },
    async setupData() {
      await this.getGiftDetail();
      await this.getVoucherGroups();
      await this.getProductList();
      await this.getGameCampaign();
      this.setupAction();
    },
    async getGameCampaign() {
      this.$store.commit("game_campaign/setPageSize", 0);
      this.$store.commit("game_campaign/setPageIndex", 0);
      await this.$store
        .dispatch("game_campaign/getGameCampaignList")
        .then((result) => {
          this.$store.commit("game_campaign/setPageSize", 10);
          this.$store.commit("game_campaign/setPageIndex", 1);
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error while get Games",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error while get Games",
            type: "warning",
          });
        });
    },
    setupAction() {
      this.loading = true;
      let giftParam = this.$store.state.action.giftParam;
      this.loading = true;
      this.productSelection = [];
      this.gift = giftParam;
      this.gift.listProduct = [];
      this.productSelection = giftParam.listProductMapp;
      if (giftParam.listProductMapp != null) {
        giftParam.listProductMapp.forEach((product) => {
          this.gift.listProduct.push(product.productId);
        });
      }
      this.loading = false;
    },
    async getGiftDetail() {
      this.loading = true;
      await this.$store
        .dispatch("action/getGiftDetail")
        .then((result) => {
          //   this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Cannot get gift information",
              type: "warning",
            });
          }
        })
        .catch(() => {
          //   this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Cannot get gift information",
            type: "warning",
          });
        });
    },
    handleCloseDrawer() {
      this.gift.listProduct = [];
      if (this.productSelection.length > 0) {
        this.productSelection.forEach((element) => {
          this.gift.listProduct.push(element.productId);
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
              message: "Error when getting product",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error when getting product",
            type: "warning",
          });
        });
    },
    handleGiftUpdate(gift) {
      if (gift.postActionType == this.$ENV.POST_ACTION_TYPE.GIFT_PRODUCT) {
        if (this.productSelection.length == 0) {
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Please select product",
            type: "danger",
          });
          return;
        } else {
          gift.listProduct = [];
          gift.listProductMapp = [];
          this.productSelection.forEach((product) => {
            let dto = {
              productId: product.productId,
              quantity: product.quantity,
            };
            gift.listProduct.push(dto);
          });
        }
      }
      return gift;
    },
    updateAction() {
      this.$refs["giftForm"].validate((valid) => {
        if (valid) {
          let giftUpdateParam = this.handleGiftUpdate(this.gift);
          if (giftUpdateParam) {
            this.loading = true;
            this.$store.commit("action/setUpdGift", giftUpdateParam);
            this.$store
              .dispatch("action/updateGift")
              .then((result) => {
                this.loading = false;
                if (result.status != 200) {
                  this.$notify({
                    icon: "el-icon-warning",
                    title: "Error",
                    message: "Update failed, please try again",
                    type: "danger",
                  });
                } else {
                  this.$notify({
                    icon: "el-icon-warning",
                    title: "Success",
                    message: "Update success, please try again",
                    type: "success",
                  });
                  this.$emit("reset", 1);
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
  created() {
    // this.getProductList();
    this.setupData();
  },
};
</script>

<style>
#gift-action-detail .el-input-number__increase {
  display: none;
  width: 0px;
}
#gift-action-detail .el-input-number__decrease {
  display: none;
  width: 0px;
}
#gift-action-detail .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
#gift-action-detail .el-form-item__error {
  padding-top: 0;
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
