<template>
  <div class="card">
    <el-row :gutter="5">
      <el-col :span="5">
        <div id="condition-zone" class="drop-zone">
          <h3>Conditions</h3>
          <el-collapse accordion>
            <div id="cond-group-zone">
              <el-collapse-item>
                <template slot="title"> Group </template>
                <draggable
                  :list="condGroupItem"
                  :group="{ name: 'groupItem', pull: 'clone', put: false }"
                  :clone="cloneCondGroup"
                >
                  <el-col
                    :span="24"
                    v-for="(element, index) in condGroupItem"
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
            <div id="cond-item-zone">
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
          </el-collapse>
        </div>
      </el-col>
      <!-- Right zone -->
      <el-col :span="19">
        <div class="draggable-zone-style">
          <p class="mb-0 text-dark">IF</p>
          <draggable
            :list="condItems"
            :empty-insert-threshhold="100"
            :group="{
              name: 'conditionItem',
              put: ['groupItem', 'orderCondItem', 'prodCondItem'],
            }"
            class="draggable-zone-style"
            style="height: 300px"
            @change="log"
            @start="dragging = true"
            @end="dragging = false"
          >
            <nested-draggable
              v-if="conditionItem.length > 0"
              id="condition-drop-zone"
              :tasks="condItems"
              :options="['groupItem', 'orderCondItem', 'prodCondItem']"
            />
          </draggable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import nestedDraggable from "../../../../components/nested";
export default {
  name: "drag-condition",
  props: {},
  components: {
    draggable,
    nestedDraggable,
  },
  created() {},
  data() {
    return {
      trashOptions: {
        group: {
          name: "trash",
          draggable: ".dropitem",
          put: () => true,
          pull: false,
        },
      },
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
          productId: "",
        },
        {
          condType: "PRODUCT",
          itemType: "CODE",
          name: "Product code",
          productCode: "",
          nextOperator: "1",
          productConditionType: "0",
          productId: "",
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

      condItems: [],
      productSelection: [],
    };
  },
  computed: {
    conditionItem() {
      return this.condItems;
    },
    numberOper() {
      return this.orperators;
    },
    products() {
      return this.$store.state.condition.products;
    },
  },
  methods: {
    log: function (evt) {
      console.log("log change");
      window.console.log(evt);
      console.log("list");
      console.log(this.conditionItem);
    },
    cloneCondGroup() {
      return {
        groupNo: 0,
        tasks: [],
        nextOperator: "1",
      };
    },
    cloneProdCond(obj) {
      let itemType = obj.itemType;
      switch (itemType) {
        case "QUANTITY": {
          return {
            condType: "PRODUCT",
            itemType: "QUANTITY",
            name: "Quantity",
            productQuantity: 0,
            quantityOperator: "1",
            nextOperator: "1",
            productId: "",
          };
        }
        case "CODE": {
          return {
            condType: "PRODUCT",
            itemType: "CODE",
            name: "Product code",
            productCode: "",
            nextOperator: "1",
            productConditionType: "0",
            productId: "",
          };
        }
      }
    },
    cloneOrderCond(obj) {
      let itemType = obj.itemType;
      switch (itemType) {
        case "QUANTITY": {
          return {
            condType: "ORDER",
            itemType: "QUANTITY",
            name: "Quantity",
            quantityOperator: "1",
            quantity: 0,
            nextOperator: "1",
          };
        }
        case "AMOUNT": {
          return {
            condType: "ORDER",
            itemType: "AMOUNT",
            name: "Amount",
            amountOperator: "1",
            amount: 0,
            nextOperator: "1",
          };
        }
      }
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
  min-height: 45vh;
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
  /* background-color: rgb(126, 126, 126); */
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
}
</style>
