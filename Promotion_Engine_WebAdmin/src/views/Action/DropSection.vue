<template>
  <div id="drop-action">
    <el-card style="min-height: 50vh">
      <el-row>
        <el-col :span="24">
          <draggable
            style="min-height: 40vh"
            @change="actChange"
            :list="actionItem"
            :group="{
              name: 'actionItem',
              put: 'actionItem',
            }"
          >
            <div id="action-drop-zone" v-if="actionItem.length > 0">
              <draggable
                :list="actionItem"
                group="actionItem"
                @change="actChange"
                @start="dragging = true"
                @end="dragging = false"
              >
                <div
                  id="drop-action-content"
                  v-for="(element, index) in actionItem"
                  :key="index"
                >
                  <h2>{{ element.name }}</h2>

                  <div v-if="element.actType == 'PRODUCT'">
                    <div v-if="element.itemType == 'AMOUNT'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> discount </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.value"
                            :min="1"
                            :max="999999999"
                          ></el-input-number>
                          <label class="ml-1"> VNĐ </label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> minimum price of product after discount is </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2 mr-2"
                            v-model="element.minValueAfterDiscount"
                            :min="0"
                            :max="999999999"
                          ></el-input-number>
                          <label> VNĐ</label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> for products in </label>
                          <el-button
                            type="text"
                            style="outline: none; border: 0px"
                            plain
                            class="ml-2 selectProductButton"
                            @click="openDrawerProduct(element.productSelection)"
                            >selection list ({{ productSelection.length }})
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'PERCENTAGE'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> discount </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.valuePercent"
                            :min="1"
                            :max="100"
                          ></el-input-number>
                          <label class="ml-2"> %</label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> and maximum discount price is </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.amountLimit"
                            :min="0"
                            :max="999999999"
                          ></el-input-number>
                          <label>VNĐ</label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> for products in </label>
                          <el-button
                            type="text"
                            style="outline: none; border: 0px; font-size: 1vw"
                            plain
                            class="ml-2"
                            @click="openDrawerProduct(element.productSelection)"
                            >selection list ({{ productSelection.length }})
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'UNIT'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> discount </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.value"
                            :min="1"
                            :max="100"
                          ></el-input-number>
                          <label> unit of products in cart </label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> for products in </label>
                          <el-button
                            type="text"
                            style="outline: none; border: 0px; font-size: 1vw"
                            plain
                            class="ml-2"
                            @click="openDrawerProduct(element.productSelection)"
                            >selection list ({{ productSelection.length }})
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'FIXED'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> fixed price </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.fixedValue"
                            :min="1"
                            :max="9999999999"
                          ></el-input-number>
                          <label> VNĐ </label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> for products in </label>
                          <el-button
                            type="text"
                            style="outline: none; border: 0px; font-size: 1vw"
                            plain
                            class="ml-2"
                            @click="openDrawerProduct(element.productSelection)"
                            >selection list ({{ productSelection.length }})
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'LADDER'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> buy product at the price </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.ladderPrice"
                            :min="1"
                            :max="99999999"
                          ></el-input-number>
                          <label class="ml-2"> VNĐ </label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> since the product</label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.orderLadderProduct"
                            :min="1"
                            :max="10"
                          ></el-input-number>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> for products in </label>
                          <el-button
                            type="text"
                            style="outline: none; border: 0px; font-size: 1vw"
                            plain
                            class="ml-2"
                            @click="openDrawerProduct(element.productSelection)"
                            >selection list ({{ productSelection.length }})
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'BUNDLE'">
                      <el-row>
                        <!-- <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> buy </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.bundleQuantity"
                            :min="1"
                            :max="100"
                          ></el-input-number>
                          <label class="ml-2"> product(s)</label>
                        </el-col> -->
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> with the price</label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.bundlePrice"
                            :min="1"
                            :max="999999999"
                          ></el-input-number>
                          <label class="ml-2"> VNĐ</label>
                        </el-col>
                        <!-- <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> apply for product(s) that are follow by </label>
                          <el-select
                            style="width: 11vw"
                            size="small"
                            class="ml-2"
                            v-model="element.strategy"
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
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> for products in </label>
                          <el-button
                            type="text"
                            style="outline: none; border: 0px; font-size: 1vw"
                            plain
                            class="ml-2"
                            @click="openDrawerProduct(element.productSelection)"
                            >selection list ({{ productSelection.length }})
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div v-if="element.actType == 'ORDER'">
                    <div v-if="element.itemType == 'AMOUNT'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> discount </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.value"
                            :min="1"
                            :max="999999999"
                          ></el-input-number>
                          <label class="ml-1"> VNĐ for cart</label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> minimum price of cart after discount is </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.minValueAfterDiscount"
                            :min="0"
                            :max="999999999"
                          ></el-input-number>
                          <label class="ml-2"> VNĐ</label>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'PERCENTAGE'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> discount </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.valuePercent"
                            :min="1"
                            :max="100"
                          ></el-input-number>
                          <label> % for cart</label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> maximum discount price is </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.amountLimit"
                            :min="0"
                            :max="999999999"
                          ></el-input-number>
                          <label>VNĐ</label>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'SHIPPING AMOUNT'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> discount </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.valueAmount"
                            :min="1"
                            :max="999999999"
                          ></el-input-number>
                          <label> VNĐ for shipping fee of cart</label>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'SHIPPING PERCENTAGE'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> discount </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number"
                            v-model="element.valuePercent"
                            :min="1"
                            :max="100"
                          ></el-input-number>
                          <label> % for shipping fee of cart</label>
                        </el-col>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> maximum discount price is </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.amountLimit"
                            :min="0"
                            :max="999999999"
                          ></el-input-number>
                          <label>VNĐ</label>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div v-if="element.actType == 'GIFT'">
                    <div v-if="element.itemType == 'PRODUCT'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>
                          <label> gift product in </label>
                          <el-button
                            type="text"
                            style="outline: none; border: 0px; font-size: 1vw"
                            plain
                            class="ml-2"
                            @click="openDrawerProduct(element.productSelection)"
                            >selection list ({{ productSelection.length }})
                          </el-button>
                        </el-col>
                        <!-- <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>

                          <label> gift quantity is </label>
                          <el-input-number
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.quantity"
                            :min="1"
                            :max="100"
                          ></el-input-number>
                        </el-col> -->
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'VOUCHER'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>

                          <label> gift a Voucher Group </label>
                          <el-select v-model="element.giftVoucherGroupId">
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
                    <div v-if="element.itemType == 'GAME'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>

                          <label class="mr-3"> Gift a Game Code of </label>
                          <el-select v-model="element.gameCampaignId">
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
                  </div>

                  <div v-if="element.actType == 'BONUS'">
                    <el-row>
                      <el-col :span="24">
                        <el-divider
                          class="custom-divider"
                          direction="vertical"
                        ></el-divider>

                        <label> Give </label>
                        <el-input-number
                          type="text"
                          size="small"
                          style="width: 10vw"
                          class="drag-input-number ml-2"
                          v-model="element.bonusPoint"
                        ></el-input-number>
                        <label class="ml-2"> point(s) for customer </label>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </draggable>
            </div>
          </draggable>
        </el-col>
      </el-row>
    </el-card>
    <el-drawer
      id="drop-action-drawer"
      :visible.sync="drawer"
      size="50%"
      direction="rtl"
      :before-close="beforeCloseDrawer"
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
          stripe=""
          @selection-change="handleSelectionChange"
          @select="handleSelect"
        >
          <el-table-column type="selection"> </el-table-column>

          <el-table-column property="productName" width="250" label="Product name">
            <template slot-scope="scope">
              <label class="custom-content-break">
                {{ scope.row.productName }}
              </label>
            </template>
          </el-table-column>
          <el-table-column width="150" property="productCode" label="Product code">
            <template slot-scope="scope">
              <el-tag type="info" class="custom-content-break text-black">
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
            v-if="actionItem.length > 0 && actionItem[0].itemType != 'UNIT'"
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
import draggable from "vuedraggable";
export default {
  name: "action-drop-section",
  components: {
    draggable,
  },
  props: {
    actionItemParam: Array,
  },
  computed: {
    games() {
      return this.$store.state.game_campaign.gameConfigs;
    },
    promotion() {
      return this.$store.state.game_campaign.gamePromo;
    },
    products() {
      return this.$store.state.condition.products;
    },
    actionItem() {
      return this.actionItemParam;
    },
    voucherGroups() {
      return this.$store.state.voucher.availVouchers;
    },
  },
  watch: {
    actionItem() {
      if (this.$refs["multipleTable"] != undefined) {
        this.$refs["multipleTable"].clearSelection();
      }
      this.productSelection = [];
    },
  },
  created() {},
  data() {
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

      actItems: [],
      productSelection: [],
      drawer: false,
    };
  },
  methods: {
    beforeCloseDrawer() {
      this.selectProduct();
    },
    selectProduct() {
      // let GIFT_PRODUCT = this.$ENV.POST_ACTION_TYPE.GIFT_PRODUCT;
      let valid = true;
      if (this.actionItem[0].itemType != "UNIT") {
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
      // this.$emit("getProducts");
      this.drawer = true;
    },
    handleCloseDrawer() {
      if (this.$refs["multipleTable"] != undefined) {
        this.$refs["multipleTable"].clearSelection();
      }

      this.drawer = false;
    },
    handleSelectionChange(val) {
      this.productSelection = val;
    },
    handleSelect(val, row) {
      this.productSelection = val;
      let actionType = this.actionItem[0].actionType;
      if (actionType == this.$ENV.POST_ACTION_TYPE.GIFT_PRODUCT) {
        let exist = val.find((o) => o.productId == row.productId) != undefined;
        if (!exist) {
          row.quantity = undefined;
        }
      }
    },
    actChange(element) {
      let newIndex = element.added.newIndex;
      let removeIndex = 0;
      if (newIndex == 0) {
        removeIndex = 1;
      }
      if (this.actionItem.length > 1) {
        this.actionItem.splice(removeIndex, 1);
        this.clearSelectionList();
        if (this.$refs["multipleTable"] != undefined) {
          this.$refs["multipleTable"].clearSelection();
        }
      }
    },
    clearSelectionList() {
      do {
        this.productSelection.pop();
      } while (this.productSelection.length > 0);
    },
  },
};
</script>
<style>
#drop-action .el-input-number__increase {
  display: none;
  width: 0px;
}
#drop-action .el-input-number__decrease {
  display: none;
  width: 0px;
}
#drop-action .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
#drop-action .el-input-number {
  width: 100%;
}
#drop-action-drawer .el-input-number__increase {
  display: none;
  width: 0px;
}
#drop-action-drawer .el-input-number__decrease {
  display: none;
  width: 0px;
}
#drop-action-drawer .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
#drop-action-drawer .el-input-number {
  width: 100%;
}
</style>
<style scoped>
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
#drop-action-content {
  font-size: 20px;
}

#drop-action-content .selectProductButton {
  font-size: 20px;
}
</style>
