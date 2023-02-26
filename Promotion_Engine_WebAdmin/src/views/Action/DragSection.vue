<template>
  <div>
    <el-card style="min-height: 40vh">
      <el-row>
        <el-col class="drop-zone" :span="24">
          <h3 v-if="isAction">Action items</h3>
          <h3 v-if="!isAction">Gift items</h3>
          <el-collapse>
            <div id="act-cart-item-zone" v-if="isAction">
              <el-collapse-item>
                <template slot="title"> <p class="p-0 m-0">Cart item</p> </template>
                <draggable
                  class=" "
                  :list="prodActItem"
                  :clone="cloneProdAct"
                  :group="{ name: 'actionItem', pull: 'clone', put: false }"
                >
                  <el-col :span="24" v-for="(element, index) in prodActItem" :key="index">
                    <el-tag
                      class="mb-1 ml-1 mr-1 text-dark custom-tag-item"
                      effect="plain"
                      type="success"
                    >
                      {{ element.name }}
                    </el-tag>
                  </el-col>
                </draggable>
              </el-collapse-item>
            </div>
            <div id="act-cart-zone" v-if="isAction">
              <el-collapse-item>
                <template slot="title"> <p class="p-0 m-0">Cart</p> </template>

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
                      class="mb-1 ml-1 mr-1 text-dark custom-tag-item"
                      effect="plain"
                      type="success"
                    >
                      {{ element.name }}
                    </el-tag>
                  </el-col>
                </draggable>
              </el-collapse-item>
            </div>
            <div id="act-gift-zone" v-if="!isAction">
              <el-collapse-item>
                <template slot="title"> <p class="p-0 m-0">Gift</p> </template>
                <draggable
                  class=" "
                  :list="giftActItem"
                  :clone="cloneGiftAct"
                  :group="{ name: 'actionItem', pull: 'clone', put: false }"
                >
                  <el-col :span="24" v-for="(element, index) in giftActItem" :key="index">
                    <el-tag
                      class="mb-1 ml-1 mr-1 text-dark custom-tag-item"
                      effect="plain"
                      type="success"
                    >
                      {{ element.name }}
                    </el-tag>
                  </el-col>
                </draggable>
              </el-collapse-item>
            </div>
            <div id="act-gift-zone" v-if="!isAction">
              <el-collapse-item>
                <template slot="title"><p class="p-0 m-0">Bonus point</p> </template>
                <draggable
                  :list="bonusActItem"
                  :clone="cloneBonusAct"
                  :group="{ name: 'actionItem', pull: 'clone', put: false }"
                >
                  <el-tag
                    class="mb-1 ml-1 mr-1 text-dark custom-tag-item"
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
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "action-drag-section",
  props: {
    actionItem: Array,
    isAction: Boolean,
  },
  components: {
    draggable,
  },
  data() {
    return {
      drawer: false,
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

      prodActItem: [
        {
          actType: "PRODUCT",
          itemType: "AMOUNT",
          actionType: "1",
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
        {
          actType: "GIFT",
          itemType: "GAME",
          actionType: "3",
          discountType: "9",
          name: "Game Code",
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

      //   data for condition drag item
      orperators: [
        {
          id: "1",
          name: ">",
        },
        {
          id: "2",
          name: ">=",
        },
        {
          id: "5",
          name: "=",
        },
        {
          id: "3",
          name: "<",
        },
        {
          id: "4",
          name: "<=",
        },
      ],

      combineOper: [
        {
          id: "1",
          name: "Or",
        },
        {
          id: "2",
          name: "And",
        },
      ],
      containCode: [
        {
          id: "0",
          name: "Include",
        },
        {
          id: "1",
          name: "Exclude",
        },
      ],
    };
  },
  methods: {
    cloneProdAct(obj) {
      let itemType = obj.itemType;
      let ACTION_TYPE = this.$ENV.ACTION_TYPE;
      switch (itemType) {
        case "AMOUNT": {
          return {
            actType: "PRODUCT",
            itemType: "AMOUNT",
            actionType: ACTION_TYPE.PRODUCT_AMOUNT,
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
            actionType: ACTION_TYPE.PRODUCT_PERCENT,
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
            actionType: ACTION_TYPE.PRODUCT_UNIT,
            name: "Discount unit",
            value: 0,
            productSelection: [],
          };
        }
        case "FIXED": {
          return {
            actType: "PRODUCT",
            itemType: "FIXED",
            actionType: ACTION_TYPE.PRODUCT_FIXED,
            name: "Fixed price",
            fixedValue: 0,
            productSelection: [],
          };
        }
        case "LADDER": {
          return {
            actType: "PRODUCT",
            itemType: "LADDER",
            actionType: ACTION_TYPE.PRODUCT_LADDER,
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
            actionType: ACTION_TYPE.PRODUCT_BUNDLE,
            name: "Bundle price",
            bundleQuantity: 0,
            bundlePrice: 0,
            strategy: 3,
            productSelection: [],
          };
        }
      }
    },
    cloneOrderAct(obj) {
      let ACTION_TYPE = this.$ENV.ACTION_TYPE;
      let itemType = obj.itemType;
      switch (itemType) {
        case "AMOUNT": {
          return {
            actType: "ORDER",
            itemType: "AMOUNT",
            actionType: ACTION_TYPE.ORDER_AMOUNT,
            name: "Discount amount (VNĐ)",
            value: 1,
            minValueAfterDiscount: 0,
          };
        }
        case "PERCENTAGE": {
          return {
            actType: "ORDER",
            itemType: "PERCENTAGE",
            actionType: ACTION_TYPE.ORDER_PERCENT,
            name: "Discount percentage (%)",
            valuePercent: 1,
            amountLimit: 0,
          };
        }
        case "SHIPPING AMOUNT": {
          return {
            actType: "ORDER",
            itemType: "SHIPPING AMOUNT",
            actionType: ACTION_TYPE.ORDER_SHIPPING,
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
            actionType: ACTION_TYPE.ORDER_SHIPPING,
            type: "2",
            valueAmount: 0,
            valuePercent: 1,
            amountLimit: 0,
          };
        }
      }
    },
    cloneGiftAct(obj) {
      let POST_ACTION_TYPE = this.$ENV.POST_ACTION_TYPE;
      let itemType = obj.itemType;
      switch (itemType) {
        case "PRODUCT": {
          return {
            actType: "GIFT",
            itemType: "PRODUCT",
            name: "Product",
            actionType: POST_ACTION_TYPE.GIFT_PRODUCT,
            quantity: 0,
            productSelection: [],
          };
        }
        case "VOUCHER": {
          return {
            actType: "GIFT",
            itemType: "VOUCHER",
            actionType: POST_ACTION_TYPE.GIFT_VOUCHER,
            name: "Voucher",
            giftVoucherGroupId: "",
          };
        }
        case "GAME": {
          return {
            actType: "GIFT",
            itemType: "GAME",
            actionType: POST_ACTION_TYPE.GIFT_GAME_CODE,
            name: "Game Code",
            gameCampaignId: "",
          };
        }
      }
    },
    cloneBonusAct() {
      let POST_ACTION_TYPE = this.$ENV.POST_ACTION_TYPE;
      return {
        actType: "BONUS",
        name: "Bonus point",
        actionType: POST_ACTION_TYPE.GIFT_POINT,
        bonusPoint: 0,
      };
    },
  },
};
</script>
<style scoped>
.custom-tag-item {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  min-width: 12vw;
  min-height: 4vh;
  text-align: left;
  border: 1px solid #57d8a1;
}
</style>
