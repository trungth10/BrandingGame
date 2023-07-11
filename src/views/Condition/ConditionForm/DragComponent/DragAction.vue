<template>
  <div>
    <!-- Action zone -->
    <el-row>
      <!-- Left zone -->
      <el-col :span="7">
        <div class="drop-zone">
          <h3>Action</h3>
          <el-collapse accordion>
            <div id="act-cart-item-zone">
              <el-collapse-item>
                <template slot="title"> Cart item </template>
                <draggable
                  class=" "
                  :list="prodActItem"
                  :clone="cloneProdAct"
                  :group="{ name: 'actionItem', pull: 'clone', put: false }"
                >
                  <el-col :span="24" v-for="(element, index) in prodActItem" :key="index">
                    <el-tag
                      class="mb-1 ml-1 mr-1 text-dark"
                      effect="plain"
                      type="success"
                    >
                      {{ element.name }}
                    </el-tag>
                  </el-col>
                </draggable>
              </el-collapse-item>
            </div>
            <div id="act-cart-zone">
              <el-collapse-item>
                <template slot="title"> Cart </template>

                <draggable
                  class=" "
                  :list="orderActItem"
                  :clone="cloneOrderAct"
                  :group="{ name: 'actionItem', pull: 'clone', put: false }"
                >
                  <el-col
                    :span="24"
                    v-for="(element, index) in orderActItem"
                    :key="index"
                  >
                    <el-tag
                      class="mb-1 ml-1 mr-1 text-dark"
                      effect="plain"
                      type="success"
                    >
                      {{ element.name }}
                    </el-tag>
                  </el-col>
                </draggable>
              </el-collapse-item>
            </div>
            <div id="act-gift-zone">
              <el-collapse-item>
                <template slot="title"> Gift </template>
                <draggable
                  class=" "
                  :list="giftActItem"
                  :clone="cloneGiftAct"
                  :group="{ name: 'actionItem', pull: 'clone', put: false }"
                >
                  <el-col :span="24" v-for="(element, index) in giftActItem" :key="index">
                    <el-tag
                      class="mb-1 ml-1 mr-1 text-dark"
                      effect="plain"
                      type="success"
                    >
                      {{ element.name }}
                    </el-tag>
                  </el-col>
                </draggable>
              </el-collapse-item>
            </div>
            <div id="act-gift-zone">
              <el-collapse-item>
                <template slot="title"> Bonus point </template>
                <draggable
                  class=" "
                  :list="bonusActItem"
                  :clone="cloneBonusAct"
                  :group="{ name: 'actionItem', pull: 'clone', put: false }"
                >
                  <el-tag
                    class="mb-1 ml-1 mr-1 text-dark"
                    effect="plain"
                    type="success"
                    v-for="(element, index) in bonusActItem"
                    :key="index"
                  >
                    {{ element.name }}
                  </el-tag>
                </draggable>
              </el-collapse-item>
            </div>
          </el-collapse>
        </div>
      </el-col>
      <!-- Right zone -->
      <el-col :span="17">
        <div class="card">
          <p class="mb-0 text-dark">THEN</p>
          <draggable
            :list="actionItem"
            group="actionItem"
            class="draggable-zone-style"
            @change="log"
            @start="dragging = true"
            @end="dragging = false"
          >
            <div id="action-drop-zone" v-if="actionItem.length > 0">
              <draggable
                class="draggable-zone-style"
                :list="actionItem"
                group="actionItem"
                @change="actChange"
                @start="dragging = true"
                @end="dragging = false"
              >
                <div v-for="(element, index) in actionItem" :key="index">
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
                            class="drag-input-number ml-2"
                            v-model="element.minValueAfterDiscount"
                            :min="0"
                            :max="999999999"
                          ></el-input-number>
                          <label class="ml-2"> VNĐ</label>
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
                            >selection list
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
                            class="drag-input-number"
                            v-model="element.valuePercent"
                            :min="1"
                            :max="100"
                          ></el-input-number>
                          <label> %</label>
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
                            >selection list
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
                            >selection list
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
                            :max="100"
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
                            >selection list
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
                            >selection list
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'BUNDLE'">
                      <el-row>
                        <el-col :span="24">
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
                        </el-col>
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
                        <el-col :span="24">
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
                            >selection list
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
                            >selection list
                          </el-button>
                        </el-col>
                        <el-col :span="24">
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
                        </el-col>
                      </el-row>
                    </div>
                    <div v-if="element.itemType == 'VOUCHER'">
                      <el-row>
                        <el-col :span="24">
                          <el-divider
                            class="custom-divider"
                            direction="vertical"
                          ></el-divider>

                          <label> gift a voucher code </label>
                          <el-input
                            type="text"
                            size="small"
                            style="width: 10vw"
                            class="drag-input-number ml-2"
                            v-model="element.giftVoucherCode"
                          ></el-input>
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
        </div>
      </el-col>
    </el-row>
    <el-drawer :visible.sync="drawer" size="50%" direction="rtl">
      <div class="m-3">
        <label>Product list</label>
        <el-table
          ref="multipleTable"
          :data="products"
          border=""
          height="400"
          @selection-change="handleSelectionChange"
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
import draggable from "vuedraggable";

export default {
  name: "drag-action",
  props: {},
  components: {
    draggable,
  },
  created() {},
  data() {
    return {
      drawer: false,
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

      prodActItem: [
        {
          actType: "PRODUCT",
          itemType: "AMOUNT",
          actionType: "1",
          discountType: "1",
          name: "Discount amount (VNĐ)",
          value: 0,
          minValueAfterDiscount: 0,
          productSelection: [],
        },
        {
          actType: "PRODUCT",
          itemType: "PERCENTAGE",
          actionType: "1",
          discountType: "2",
          name: "Discount percentage (%)",
          valuePercent: 0,
          amountLimit: 0,
          productSelection: [],
        },
        {
          actType: "PRODUCT",
          itemType: "UNIT",
          actionType: "1",
          discountType: "3",
          name: "Discount unit",
          value: 0,
          productSelection: [],
        },
        {
          actType: "PRODUCT",
          itemType: "FIXED",
          actionType: "1",
          discountType: "5",
          name: "Fixed price",
          fixedValue: 0,
          productSelection: [],
        },
        {
          actType: "PRODUCT",
          itemType: "LADDER",
          actionType: "1",
          discountType: "6",
          name: "Ladder price",
          orderLadderProduct: 0,
          ladderPrice: 0,
          productSelection: [],
        },
        {
          actType: "PRODUCT",
          itemType: "BUNDLE",
          actionType: "1",
          discountType: "7",
          name: "Bundle price",
          bundleQuantity: 0,
          bundlePrice: 0,
          strategy: "3",
          productSelection: [],
        },
      ],
      orderActItem: [
        {
          actType: "ORDER",
          itemType: "AMOUNT",
          actionType: "2",
          discountType: "1",
          name: "Discount amount (VNĐ)",
          value: 1,
          minValueAfterDiscount: 0,
        },
        {
          actType: "ORDER",
          itemType: "PERCENTAGE",
          actionType: "2",
          discountType: "2",
          name: "Discount percentage (%)",
          valuePercent: 1,
          amountLimit: 0,
        },
        {
          actType: "ORDER",
          itemType: "SHIPPING AMOUNT",
          actionType: "2",
          discountType: "4",
          name: "Shipping amount",
          type: "1",
          valueAmount: 1,
          valuePercent: 0,
          amountLimit: 0,
        },
        {
          actType: "ORDER",
          itemType: "SHIPPING PERCENTAGE",
          name: "Shipping percent",
          actionType: "2",
          discountType: "4",
          type: "2",
          valueAmount: 0,
          valuePercent: 1,
          amountLimit: 0,
        },
      ],
      giftActItem: [
        {
          actType: "GIFT",
          itemType: "PRODUCT",
          actionType: "3",
          discountType: "8",
          name: "Product",
          quantity: 0,
          productSelection: [],
        },
        {
          actType: "GIFT",
          itemType: "VOUCHER",
          actionType: "3",
          discountType: "9",
          name: "Voucher",
          giftVoucherCode: "",
        },
      ],
      bonusActItem: [
        {
          actType: "BONUS",
          actionType: "4",
          discountType: "10",
          name: "Bonus point",
          bonusPoint: 0,
        },
      ],
      actItems: [],
      productSelection: [],
    };
  },
  computed: {
    actionItem() {
      return this.actItems;
    },
    products() {
      return this.$store.state.condition.products;
    },
  },
  methods: {
    openDrawerProduct() {
      this.drawer = true;
    },
    handleCloseDrawer() {
      this.productSelection = [];
      this.drawer = false;
      console.log("close");
      console.log(this.productSelection);
    },
    handleSelectionChange(val) {
      this.productSelection = val;
    },
    log: function (evt) {
      console.log("log change");
      window.console.log(evt);
    },

    actChange() {
      if (this.actItems.length > 1) {
        this.actItems.splice(0, 1);
      }
    },
    cloneProdAct(obj) {
      let itemType = obj.itemType;
      switch (itemType) {
        case "AMOUNT": {
          return {
            actType: "PRODUCT",
            itemType: "AMOUNT",
            actionType: "1",
            discountType: "1",
            name: "Discount amount (VNĐ)",
            value: 0,
            minValueAfterDiscount: 0,
            productSelection: [],
          };
        }
        case "PERCENTAGE": {
          return {
            actType: "PRODUCT",
            itemType: "PERCENTAGE",
            actionType: "1",
            discountType: "2",
            name: "Discount percentage (%)",
            valuePercent: 0,
            amountLimit: 0,
            productSelection: [],
          };
        }
        case "UNIT": {
          return {
            actType: "PRODUCT",
            itemType: "UNIT",
            actionType: "1",
            discountType: "3",
            name: "Discount unit",
            value: 0,
            productSelection: [],
          };
        }
        case "FIXED": {
          return {
            actType: "PRODUCT",
            itemType: "FIXED",
            actionType: "1",
            discountType: "5",
            name: "Fixed price",
            fixedValue: 0,
            productSelection: [],
          };
        }
        case "LADDER": {
          return {
            actType: "PRODUCT",
            itemType: "LADDER",
            actionType: "1",
            discountType: "6",
            name: "Ladder price",
            orderLadderProduct: 0,
            ladderPrice: 0,
            productSelection: [],
          };
        }
        case "BUNDLE": {
          return {
            actType: "PRODUCT",
            itemType: "BUNDLE",
            actionType: "1",
            discountType: "7",
            name: "Bundle price",
            bundleQuantity: 0,
            bundlePrice: 0,
            strategy: "3",
            productSelection: [],
          };
        }
      }
    },
    cloneOrderAct(obj) {
      let itemType = obj.itemType;
      switch (itemType) {
        case "AMOUNT": {
          return {
            actType: "ORDER",
            itemType: "AMOUNT",
            actionType: "2",
            discountType: "1",
            name: "Discount amount (VNĐ)",
            value: 1,
            minValueAfterDiscount: 0,
          };
        }
        case "PERCENTAGE": {
          return {
            actType: "ORDER",
            itemType: "PERCENTAGE",
            actionType: "2",
            discountType: "2",
            name: "Discount percentage (%)",
            valuePercent: 1,
            amountLimit: 0,
          };
        }
        case "SHIPPING AMOUNT": {
          return {
            actType: "ORDER",
            itemType: "SHIPPING AMOUNT",
            actionType: "2",
            discountType: "4",
            name: "Shipping amount",
            type: "1",
            valueAmount: 1,
            valuePercent: 0,
            amountLimit: 0,
          };
        }

        case "SHIPPING PERCENTAGE": {
          return {
            actType: "ORDER",
            itemType: "SHIPPING PERCENTAGE",
            name: "Shipping percent",
            actionType: "2",
            discountType: "4",
            type: "2",
            valueAmount: 0,
            valuePercent: 1,
            amountLimit: 0,
          };
        }
      }
    },
    cloneGiftAct(obj) {
      let itemType = obj.itemType;
      switch (itemType) {
        case "PRODUCT": {
          return {
            actType: "GIFT",
            itemType: "PRODUCT",
            name: "Product",
            actionType: "3",
            discountType: "8",
            quantity: 0,
            productSelection: [],
          };
        }
        case "VOUCHER": {
          return {
            actType: "GIFT",
            itemType: "VOUCHER",
            actionType: "3",
            discountType: "9",
            name: "Voucher",
            giftVoucherCode: "",
          };
        }
      }
    },
    cloneBonusAct() {
      return {
        actType: "BONUS",
        name: "Bonus point",
        actionType: "4",
        discountType: "10",
        bonusPoint: 0,
      };
    },
  },
};
</script>
<style scoped>
.drop-zone {
  background-color: white;
  margin-bottom: 10px;
  padding: 10px;
  color: black;
  font-family: Arial, Helvetica, sans-serif;
  min-height: 30vh;
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
.custom-content-break {
  word-break: break-word;
}
.draggable-zone-style {
  background-color: white;
  min-height: 30vh;
}

</style>
