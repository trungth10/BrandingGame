<template>
  <div>
    <el-row>
      <p class="mb-0 text-dark">THEN</p>
      <el-col :span="24">
        <div v-if="actionType == '1'">
          <div v-if="discountType == '1'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> discount </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="action.discountAmount"
                  :min="1"
                  :max="999999999"
                ></el-input-number>
                <label class="ml-1"> VNĐ </label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> minimum price of product after discount is </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="action.minPriceAfter"
                  :min="0"
                  :max="999999999"
                ></el-input-number>
                <label class="ml-2"> VNĐ</label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> for products in </label>
                <el-button
                  type="text"
                  style="outline: none; border: 0px; font-size: 1vw"
                  plain
                  class="ml-2"
                  @click="openDrawerProduct(productSelection)"
                  >selection list ({{ productSelection.length }})
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '2'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> discount </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.discountPercentage"
                  :min="1"
                  :max="100"
                ></el-input-number>
                <label> %</label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> and maximum discount price is </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="action.maxAmount"
                  :min="0"
                  :max="999999999"
                ></el-input-number>
                <label>VNĐ</label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> for products in </label>
                <el-button
                  type="text"
                  style="outline: none; border: 0px; font-size: 1vw"
                  plain
                  class="ml-2"
                  @click="openDrawerProduct(productSelection)"
                  >selection list ({{ productSelection.length }})
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '3'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> discount </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.discountQuantity"
                  :min="1"
                  :max="999999"
                ></el-input-number>
                <label> unit of products in cart </label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> for products in </label>
                <el-button
                  type="text"
                  style="outline: none; border: 0px; font-size: 1vw"
                  plain
                  class="ml-2"
                  @click="openDrawerProduct(productSelection)"
                  >selection list ({{ productSelection.length }})
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '5'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> fixed price </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.fixedPrice"
                  :min="1"
                  :max="100"
                ></el-input-number>
                <label> VNĐ </label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> for products in </label>
                <el-button
                  type="text"
                  style="outline: none; border: 0px; font-size: 1vw"
                  plain
                  class="ml-2"
                  @click="openDrawerProduct(productSelection)"
                  >selection list ({{ productSelection.length }})
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '6'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> buy product at the price </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.ladderPrice"
                  :min="1"
                  :max="99999999"
                ></el-input-number>
                <label class="ml-2"> VNĐ </label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> since the product</label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.orderLadderProduct"
                  :min="1"
                  :max="10"
                ></el-input-number>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> for products in </label>
                <el-button
                  type="text"
                  style="outline: none; border: 0px; font-size: 1vw"
                  plain
                  class="ml-2"
                  @click="openDrawerProduct(productSelection)"
                  >selection list ({{ productSelection.length }})
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '7'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> buy </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.bundleQuantity"
                  :min="1"
                  :max="100"
                ></el-input-number>
                <label class="ml-2"> product(s)</label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> with the price</label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="action.bundlePrice"
                  :min="1"
                  :max="999999999"
                ></el-input-number>
                <label class="ml-2"> VNĐ</label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> apply for product(s) that are follow by </label>
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
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> for products in </label>
                <el-button
                  type="text"
                  style="outline: none; border: 0px; font-size: 1vw"
                  plain
                  class="ml-2"
                  @click="openDrawerProduct(productSelection)"
                  >selection list ({{ productSelection.length }})
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="actionType == '2'">
          <div v-if="discountType == '1'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> discount </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="action.discountAmount"
                  :min="1"
                  :max="999999999"
                ></el-input-number>
                <label class="ml-1"> VNĐ for cart</label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> minimum price of cart after discount is </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="action.minPriceAfter"
                  :min="0"
                  :max="999999999"
                ></el-input-number>
                <label class="ml-2"> VNĐ</label>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '2'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> discount </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.discountPercentage"
                  :min="1"
                  :max="100"
                ></el-input-number>
                <label> % for cart</label>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> maximum discount price is </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="action.maxAmount"
                  :min="0"
                  :max="999999999"
                ></el-input-number>
                <label>VNĐ</label>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '4'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> discount </label>
                <el-select v-model="isShipAmount" @change="changeShipDiscount">
                  <el-option :key="'shipAmount'" label="amount" :value="true">
                  </el-option>
                  <el-option :key="'shipPercent'" label="percentage" :value="false">
                  </el-option>
                </el-select>
                <span v-if="isShipAmount">
                  <el-input-number
                    type="text"
                    size="small"
                    style="width: 10vw"
                    class="drag-input-number"
                    v-model="action.discountAmount"
                    :min="1"
                    :max="999999999"
                  ></el-input-number>
                  <label> VNĐ for shipping fee of cart</label>
                </span>
                <span v-if="!isShipAmount">
                  <el-input-number
                    type="text"
                    size="small"
                    style="width: 10vw"
                    class="drag-input-number"
                    v-model="action.discountPercentage"
                    :min="1"
                    :max="100"
                  ></el-input-number>
                  <label> % for shipping fee of cart</label><br />
                  <el-divider class="custom-divider" direction="vertical"></el-divider>
                  <label> maximum discount price is </label>
                  <el-input-number
                    type="text"
                    size="small"
                    style="width: 10vw"
                    class="drag-input-number ml-2"
                    v-model="action.maxAmount"
                    :min="0"
                    :max="999999999"
                  ></el-input-number>
                  <label>VNĐ</label>
                </span>
              </el-col>
            </el-row>
          </div>
          <!-- <div v-if="action.itemType == 'SHIPPING PERCENTAGE'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> discount </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number"
                  v-model="action.valuePercent"
                  :min="1"
                  :max="100"
                ></el-input-number>
               
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
              
              </el-col>
            </el-row>
          </div> -->
        </div>
        <div v-if="actionType == '3'">
          <div v-if="discountType == '8'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>
                <label> gift product in </label>
                <el-button
                  type="text"
                  style="outline: none; border: 0px; font-size: 1vw"
                  plain
                  class="ml-2"
                  @click="openDrawerProduct(productSelection)"
                  >selection list ({{ productSelection.length }})
                </el-button>
              </el-col>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>

                <label> gift quantity is </label>
                <el-input-number
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="gift.giftQuantity"
                  :min="1"
                  :max="100"
                ></el-input-number>
              </el-col>
            </el-row>
          </div>
          <div v-if="discountType == '9'">
            <el-row>
              <el-col :span="24">
                <el-divider class="custom-divider" direction="vertical"></el-divider>

                <label> gift a Voucher from Promotions </label>
                <!-- <el-input
                  type="text"
                  size="small"
                  style="width: 10vw"
                  class="drag-input-number ml-2"
                  v-model="gift.giftVoucherCode"
                ></el-input> -->
                <el-select v-model="gift.giftPromotionId">
                  <el-option
                    v-for="(promo, index) in promotion"
                    :key="index"
                    :label="promo.promotionName"
                    :value="promo.promotionId"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="actionType == '4'">
          <el-row>
            <el-col :span="24">
              <el-divider class="custom-divider" direction="vertical"></el-divider>

              <label> Give </label>
              <el-input-number
                type="text"
                size="small"
                style="width: 10vw"
                class="drag-input-number ml-2"
                :min="1"
                :max="99999999"
                v-model="gift.bonusPoint"
              ></el-input-number>
              <label class="ml-2"> point(s) for customer </label>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-drawer
      :before-close="handleCloseDrawer"
      :visible.sync="drawer"
      v-show="drawer"
      size="50%"
      direction="rtl"
    >
      <div class="m-3">
        <label>Product list</label>
        <el-table
          ref="multipleTable"
          :data="products"
          v-model="productSelection"
          border=""
          height="400"
          @selection-change="handleSelectionChange"
          :row-key="getKey"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column type="index"> </el-table-column>
          <el-table-column property="productName" width="300" label="Product name">
            <template slot-scope="scope">
              <label class="custom-content-break">
                {{ scope.row.productName }}
              </label>
            </template>
          </el-table-column>
          <el-table-column property="productCode" label="Product code">
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
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "static-action-item",
  props: {
    actionType: String,
    discountType: String,
    actionParam: Object,
    giftParam: Object,
  },
  components: {},
  watch: {
    actionParam() {
      console.log("watch actionParam static");
      if (
        this.actionParam != null &&
        this.actionParam != undefined &&
        this.actionParam != {}
      ) {
        this.setupAction();
      }
    },
    giftParam() {
      console.log("watch giftParam  static");
      if (
        this.giftParam != null &&
        this.giftParam != undefined &&
        this.giftParam != {}
      ) {
        this.setupAction();
      }
    },
  },
  async created() {
    this.setupAction();
    await this.getPromoForGameCampaign();
  },
  data() {
    return {
      strategyOptions: [
        {
          value: "1",
          name: "CHEAPEST",
        },
        {
          value: "2",
          name: "MOST EXPENSIVE",
        },
        {
          value: "3",
          name: "DEFAULT",
        },
      ],
      drawer: false,
      action: {
        actionType: this.actionType,
        discountType: this.discountType,
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
        bundleStrategy: "3",
        listProduct: [],
      },
      gift: {
        actionType: this.actionType,
        discountType: this.discountType,
        giftQuantity: 0,
        giftProductCode: "",
        giftName: "",
        giftVoucherCode: "",
        bonusPoint: 0,
        listProduct: [],
      },
      shippingOption: "1",
      productSelection: [],
      isShipAmount: true,
    };
  },
  computed: {
    products() {
      return this.$store.state.condition.products;
    },
    promotion() {
      return this.$store.state.game_campaign.gamePromo;
    },
  },
  methods: {
    async getPromoForGameCampaign() {
      this.loading = true;
      await this.$store
        .dispatch("game_campaign/getPromoForGameCampaign")
        .then((result) => {
          if (result.status != 200) {
            console.log(result.data.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when getting Promotion. Please try again",
              type: "danger",
            });
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.message);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error occur when getting Promotion. Please try again",
            type: "danger",
          });
        });
    },
    changeShipDiscount(value) {
      if (value) {
        this.action.discountAmount = 1;
        this.action.discountPercentage = 0;
        this.action.maxAmount = 0;
      } else {
        this.action.discountAmount = 0;
        this.action.discountPercentage = 1;
        this.action.maxAmount = 0;
      }
    },
    resetData() {
      this.action = {
        actionType: this.actionType,
        discountType: this.discountType,
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
        bundleStrategy: "3",
        listProduct: [],
      };
      this.gift = {
        actionType: this.actionType,
        discountType: this.discountType,
        giftQuantity: 0,
        giftProductCode: "",
        giftName: "",
        giftPromotionId: "",
        bonusPoint: 0,
        listProduct: [],
      };
      this.productSelection = [];
    },
    setupAction() {
      this.productSelection = [];
      if (
        this.actionParam != undefined &&
        this.actionParam != {} &&
        this.actionParam.productList != undefined
      ) {
        this.action = this.actionParam;
        if (this.action.actionType == "2" && this.action.discountType == "4") {
          this.isShipAmount = this.action.discountAmount > 0;
        }
        this.action.listProduct = [];
        this.productSelection = this.actionParam.productList;
        this.actionParam.productList.forEach((product) => {
          this.action.listProduct.push(product.productId);
        });
      } else if (
        this.giftParam != undefined &&
        this.giftParam != {} &&
        this.giftParam.productList != undefined
      ) {
        this.gift = this.giftParam;
        this.gift.listProduct = [];
        this.productSelection = this.giftParam.productList;
        this.giftParam.productList.forEach((product) => {
          this.gift.listProduct.push(product.productId);
        });
      }
    },
    handleSelectionChange(val) {
      this.productSelection = val;
    },
    getKey(row) {
      return row.productId;
    },
    openDrawerProduct() {
      this.drawer = true;
      console.log("openDrawerProduct");
      console.log(this.products);
      console.log(this.productSelection);
      this.$nextTick(function () {
        this.productSelection.forEach((element) => {
          let tmp = this.products.filter((o) => o.productId == element.productId);
          this.$refs["multipleTable"].toggleRowSelection(tmp[0], true);
        });
      });
    },
    handleCloseDrawer() {
      if (this.actionType == "1" || this.actionType == "2") {
        this.action.listProduct = [];
        if (this.productSelection.length > 0) {
          this.productSelection.forEach((element) => {
            this.action.listProduct.push(element.productId);
          });
        }
      } else {
        this.gift.listProduct = [];
        if (this.productSelection.length > 0) {
          this.productSelection.forEach((element) => {
            this.gift.listProduct.push(element.productId);
          });
        }
      }
      this.drawer = false;
    },
  },
};
</script>
<style>
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
.el-divider--vertical {
  width: 0.15vw;
  height: 1.9vw;
  margin-left: 5px;
  margin-bottom: 10px;
  margin-top: 5px;
}
.drag-input-number {
  width: 3.5vw;
  text-align: right;
  margin: 0.5vw;
}
</style>
