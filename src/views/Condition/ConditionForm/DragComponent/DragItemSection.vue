<template>
  <div>
    <el-row>
      <!-- Condition items -->
      <el-col id="condition-zone" class="drop-zone" :span="24">
        <h3>Conditions</h3>
        <el-collapse>
          <div>
            <el-collapse-item>
              <template slot="title"> Cart item </template>
              <draggable
                :list="prodCondItem"
                :group="{ name: 'prodCondItem', pull: 'clone', put: false }"
                :clone="cloneProdCond"
              >
                <el-col
                  :span="24"
                  class="mb-2"
                  v-for="(element, index) in prodCondItem"
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
          <div id="cond-cart-zone">
            <el-collapse-item>
              <template slot="title"> Cart </template>
              <draggable
                class=" "
                :list="orderCondItem"
                :clone="cloneOrderCond"
                :group="{ name: 'orderCondItem', pull: 'clone', put: false }"
              >
                <el-col
                  :span="24"
                  class="mb-2"
                  v-for="(element, index) in orderCondItem"
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
          <div id="cond-group-zone">
            <el-collapse-item>
              <template slot="title"> Group </template>
              <draggable
                :list="condGroupItem"
                :group="{ name: 'groupItem', pull: 'clone', put: false }"
                :clone="cloneCondGroup"
              >
                <el-col :span="24" v-for="(element, index) in condGroupItem" :key="index">
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
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "drag-item-section",
  props: {
    conditionItem: Array,
    actionItem: Array,
    actionType: String,
  },
  components: {
    draggable,
  },
  created() {},
  data() {
    return {
      condGroupItem: [
        {
          name: "Group",
          groupNo: 0,
          tasks: [],
          nextOperator: "1",
        },
      ],

      prodCondItem: [
        {
          condType: "PRODUCT",
          itemType: "QUANTITY",
          name: "Quantity",
          productQuantity: 0,
          quantityOperator: "1",
          nextOperator: "1",
          productList: [],
        },
        {
          condType: "PRODUCT",
          itemType: "CODE",
          name: "Product code",
          productCode: "",
          nextOperator: "1",
          productConditionType: "0",
          productList: [],
        },
      ],
      orderCondItem: [
        {
          condType: "ORDER",
          itemType: "QUANTITY",
          name: "Quantity",
          quantityOperator: "1",
          quantity: 0,
          nextOperator: "1",
        },
        {
          condType: "ORDER",
          itemType: "AMOUNT",
          name: "Amount",
          amountOperator: "1",
          amount: 0,
          nextOperator: "1",
        },
      ],
    };
  },
  computed: {
    // actionItem() {
    //   return this.actItems;
    // },
    products() {
      return this.$store.state.condition.products;
    },
  },
  methods: {
    log: function (evt) {
      console.log("log change");
      window.console.log(evt);
    },

    cloneCondGroup() {
      return {
        groupNo: 0,
        tasks: [],
        nextOperator: 1,
      };
    },
    cloneProdCond(obj) {
      let NEXT_OPERATOR = this.$ENV.NEXT_OPERATOR;
      let CONTAIN_CODE = this.$ENV.CONTAIN_CODE;
      let OPERATOR = this.$ENV.OPERATOR_PARAM;
      let itemType = obj.itemType;
      switch (itemType) {
        case "QUANTITY": {
          return {
            condType: "PRODUCT",
            itemType: "QUANTITY",
            name: "Quantity",
            productQuantity: 0,
            quantityOperator: OPERATOR.GREATER_THAN,
            nextOperator: NEXT_OPERATOR.OR,
            productList: [],
          };
        }
        case "CODE": {
          return {
            condType: "PRODUCT",
            itemType: "CODE",
            name: "Product code",
            nextOperator: NEXT_OPERATOR.OR,
            productConditionType: CONTAIN_CODE.INCLUDE,
            productList: [],
          };
        }
      }
    },
    cloneOrderCond(obj) {
      let OPERATOR = this.$ENV.OPERATOR_PARAM;
      let NEXT_OPERATOR = this.$ENV.NEXT_OPERATOR;
      let itemType = obj.itemType;
      switch (itemType) {
        case "QUANTITY": {
          return {
            condType: "ORDER",
            itemType: "QUANTITY",
            name: "Quantity",
            quantityOperator: OPERATOR.GREATER_THAN,
            quantity: 0,
            nextOperator: NEXT_OPERATOR.OR,
          };
        }
        case "AMOUNT": {
          return {
            condType: "ORDER",
            itemType: "AMOUNT",
            name: "Amount",
            amountOperator: OPERATOR.GREATER_THAN,
            amount: 0,
            nextOperator: NEXT_OPERATOR.OR,
          };
        }
      }
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
