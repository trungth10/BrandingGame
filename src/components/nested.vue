<template>
  <div>
    <el-row>
      <draggable
        class="dragArea pt-2 pb-2"
        style="background-color: white"
        :list="tasks"
        :group="{
          name: 'conditionItem',
          put: optionParams,
        }"
      >
        <div v-for="(element, index) in tasks" :key="index">
          <div v-if="element.condType != undefined">
            <div v-if="element.condType == 'PRODUCT'">
              <div v-if="element.itemType == 'QUANTITY'">
                <el-row>
                  <el-col :span="24">
                    <el-divider class="custom-divider" direction="vertical"></el-divider>
                    <label> each product in </label>
                    <el-button
                      type="text"
                      style="outline: none; border: 0px; font-size: 1.1vw"
                      plain
                      class="ml-2"
                      @click="openDrawerProduct(element.productList, index)"
                      >selection list ({{ element.productList.length }})
                    </el-button>
                    <label class="ml-2">has quantity</label>
                    <el-select
                      class="m-2 operator-style"
                      size="small"
                      v-model="element.quantityOperator"
                      placeholder="Select"
                    >
                      <el-option
                        v-for="item in numberOper"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                    <el-input-number
                      type="text"
                      size="small"
                      class="my-input-style"
                      :min="1"
                      :max="999999"
                      v-model="element.productQuantity"
                    ></el-input-number>
                    <el-button
                      icon="el-icon-close text-muted"
                      style="outline: none; border: 0px"
                      circle=""
                      size="mini"
                      plain
                      @click="removeElement(index)"
                      type="text"
                    >
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div v-if="element.itemType == 'CODE'">
                <span>
                  <el-divider class="custom-divider" direction="vertical"></el-divider>
                  <label class="ml-1 mr-1">order</label>
                  <el-select
                    class="m-2"
                    style="width: 6.5vw"
                    size="small"
                    v-model="element.productConditionType"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in containCode"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                  <label> all products in </label>
                  <el-button
                    type="text"
                    style="outline: none; border: 0px; font-size: 1.1vw"
                    plain
                    class="ml-2"
                    @click="openDrawerProduct(element.productList, index)"
                    >selection list ({{ element.productList.length }})
                  </el-button>
                  <el-button
                    icon="el-icon-close text-muted"
                    style="outline: none; border: 0px"
                    circle=""
                    size="mini"
                    plain
                    @click="removeElement(index)"
                    type="text"
                  >
                  </el-button>
                </span>
                <br />
              </div>
            </div>
            <div v-if="element.condType == 'ORDER'">
              <div v-if="element.itemType == 'QUANTITY'">
                <span>
                  <el-divider class="custom-divider" direction="vertical"></el-divider>
                  <label>quantity of product in order is</label>
                  <el-select
                    class="m-2 operator-style"
                    size="small"
                    v-model="element.quantityOperator"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in numberOper"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                  <el-input-number
                    type="text"
                    size="small"
                    :min="1"
                    :max="999999"
                    class="my-input-style"
                    v-model="element.quantity"
                  ></el-input-number>
                  <el-button
                    icon="el-icon-close text-muted"
                    style="outline: none; border: 0px"
                    circle=""
                    size="mini"
                    plain
                    @click="removeElement(index)"
                    type="text"
                  >
                  </el-button>
                </span>
                <br />
              </div>
              <div v-if="element.itemType == 'AMOUNT'">
                <span>
                  <el-divider class="custom-divider" direction="vertical"></el-divider>
                  <label>order has total amount</label>
                  <el-select
                    class="m-2 operator-style"
                    size="small"
                    v-model="element.amountOperator"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in numberOper"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                  <el-input-number
                    type="text"
                    size="small"
                    :min="1"
                    :max="9999999999"
                    class="my-input-style"
                    v-model="element.amount"
                  ></el-input-number>
                  <el-button
                    icon="el-icon-close text-muted"
                    style="outline: none; border: 0px"
                    circle=""
                    size="mini"
                    plain
                    @click="removeElement(index)"
                    type="text"
                  >
                  </el-button>
                </span>
                <br />
              </div>
            </div>
          </div>
          <el-row v-if="element.tasks">
            <el-col :span="22">
              <nested-draggable
                class="pl-3 pr-3 custom-card"
                v-if="element.tasks"
                :tasks="element.tasks"
                :optionParams="['orderCondItem', 'prodCondItem', 'g1']"
              />
            </el-col>
            <el-col :span="2">
              <el-button
                icon="el-icon-close text-muted"
                style="outline: none; border: 0px"
                circle=""
                size="mini"
                plain
                @click="removeElement(index)"
                type="text"
              >
              </el-button>
            </el-col>
          </el-row>
          <!-- {{ combineOper }}
          {{ element.nextOperator }} -->
          <el-select
            v-if="index < tasks.length - 1"
            class="mt-2 mb-3"
            style="width: 5vw"
            size="small"
            v-model="element.nextOperator"
            v-bind:value="element.nextOperator"
            placeholder="Select"
          >
            <el-option
              v-for="(item, index) in combineOper"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </draggable>
    </el-row>
    <el-drawer
      :visible.sync="drawer"
      size="50%"
      direction="rtl"
      :before-close="handleCloseDrawer"
    >
      <div v-loading="drawerLoading" class="m-3">
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
          :row-key="getRowKey"
        >
          <el-table-column :reserve-selection="true" type="selection"> </el-table-column>
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
        <el-col :span="24">
          <el-button
            type="primary"
            class="float-right mt-3"
            icon="el-icon-plus"
            @click="selectProduct"
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
  data() {
    return {
      productSelection: [],
      drawer: false,
      selectIndex: 0,
      drawerLoading: false,
    };
  },
  props: {
    tasks: {
      required: true,
      type: Array,
    },
    optionParams: Array,
  },
  components: {
    draggable,
  },
  computed: {
    containCode() {
      return this.$ENV.CONTAIN_CODE_PARAM;
    },
    products() {
      return this.$store.state.condition.products;
    },
    numberOper() {
      return this.$ENV.OPERATOR;
    },
    combineOper() {
      return this.$ENV.NEXT_OPERATOR_PARAM;
    },
  },
  mounted() {},
  created() {},
  methods: {
    selectProduct() {
      this.handleCloseDrawer();
    },
    removeElement(index) {
      this.tasks.splice(index, 1);
    },
    getRowKey(row) {
      return row.productId;
    },
    openDrawerProduct(productList, index) {
      this.drawerLoading = true;
      this.drawer = true;
      this.clearSelectionList();
      this.$nextTick(() => {
        productList.forEach((element) => {
          let tmp = this.products.filter((o) => o.productId == element.productId);
          this.$refs["multipleTable"].toggleRowSelection(tmp[0], true);
        });
      });
      this.selectIndex = index;
      this.drawerLoading = false;
    },
    handleCloseDrawer() {
      this.tasks[this.selectIndex].productList = [];
      this.productSelection.forEach((element) => {
        this.tasks[this.selectIndex].productList.push(element);
      });
      this.clearSelectionList();
      this.$refs["multipleTable"].clearSelection();
      this.drawer = false;
    },
    clearSelectionList() {
      this.selectIndex = 0;
      do {
        this.productSelection.pop();
      } while (this.productSelection.length > 0);
    },
    handleSelectionChange(val) {
      this.productSelection = val;
    },
  },
  name: "nested-draggable",
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
.operator-style {
  width: 4.5vw;
}
.my-input-style {
  width: 8vw;
}
</style>
<style scoped>
.dragArea {
  min-height: 10vh;
}
.el-divider--vertical {
  width: 0.2vw;
  height: 2vw;
  margin-left: 5px;
  margin-bottom: 10px;
  margin-top: 5px;
  background-color: #57d8a1;
}
.drag-input-number {
  width: 3.5vw;
  text-align: right;
  margin: 0.5vw;
}
.custom-content-break {
  word-break: break-word;
}
.custom-card {
  border: 1px solid rgb(175, 175, 175);
  border-radius: 7px;
}
.custom-tag {
  font-size: 16px;
  background-color: #faecd8;
  color: #e6a23c;
  padding: 10px;
  width: 47.5vw;
}
</style>
