<template>
  <div>
    <!-- START Amount -->
    <el-row v-if="discountType == 1">
      <div class="card">
        <div class="card-header bg-transparent">
          <el-col :span="24"><h2 class="custom-label-action">Action for item</h2></el-col>
          <el-row>
            <el-col :span="8">
              <el-select
                placeholder="Select type"
                v-model="productAction.productType"
                :default-first-option="true"
              >
                <el-option
                  v-for="type in productTypes"
                  :key="type.id"
                  :label="type.type"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="10" justify="space-between" class="mt-3">
            <el-col :span="12">
              <el-form-item :prop="'productAction.value'" label="Discount value (VNĐ)">
                <el-input-number
                  :min="minLength"
                  :max="amountLength"
                  v-model="productAction.value"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="'productAction.minValueAfterDiscount'"
                label="Minimum price of product after discount (VNĐ)"
              >
                <el-input-number
                  :min="minLength"
                  :max="amountLength"
                  v-model="productAction.minValueAfterDiscount"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="10" justify="space-between">
            <el-col :span="12">
              <el-form-item prop="productCode" label="Target product codes">
                <el-input placeholder="Product code" v-model="productCode">
                  <el-button
                    slot="append"
                    icon="el-icon-plus"
                    @click="addProductCode"
                  ></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              v-if="productAction.productType != 1 && productAction.productType != 4"
            >
              <el-form-item
                :label="productTypes[productAction.productType - 1].type + ' code'"
              >
                <el-input
                  :placeholder="
                    productTypes[productAction.productType - 1].type + ' code'
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="productAction.productType == 4">
              <el-form-item
                :label="'Included ' + productTypes[productAction.productType - 1].type"
              >
                <el-input
                  :placeholder="
                    'Included ' + productTypes[productAction.productType - 1].type
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-card shadow="never" v-if="productCodes.length > 0">
            <el-table :data="productCodes" style="width: 100%">
              <el-table-column label="" type="index" width="100"> </el-table-column>
              <el-table-column label="Product Code">
                <template slot-scope="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column label="Remove" align="right">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="removeProductCode(scope.$index)"
                    >Delete</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </el-row>
    <!-- END Amount -->
    <!-- START Percentage -->
    <el-row v-if="discountType == '2'">
      <div class="card">
        <div class="card-header bg-transparent custom-action-card">
          <el-row>
            <el-col :span="24"
              ><h2 class="custom-label-action">Action for item</h2></el-col
            >
            <el-row>
              <el-col :span="24">
                <el-select
                  placeholder="Select type"
                  v-model="productAction.productType"
                  :default-first-option="true"
                >
                  <el-option
                    v-for="type in productTypes"
                    :key="type.id"
                    :label="type.type"
                    :value="type.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="10" justify="space-between" class="mt-3">
              <el-col :span="12">
                <el-form-item
                  :prop="'productAction.valuePercent'"
                  label="Discount value (%)"
                >
                  <el-input-number
                    :min="0"
                    :max="100"
                    v-model="productAction.valuePercent"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :prop="'productAction.amountLimit'"
                  label="Maximum discount amount"
                >
                  <el-input-number
                    :min="minLength"
                    :max="amountLength"
                    v-model="productAction.amountLimit"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="10" justify="space-between">
              <el-col :span="12">
                <el-form-item
                  :prop="'productAction.productCode'"
                  label="Target product codes"
                >
                  <el-input placeholder="Product code" v-model="productCode">
                    <el-button
                      slot="append"
                      icon="el-icon-plus"
                      @click="addProductCode"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                v-if="productAction.productType != 1 && productAction.productType != 4"
              >
                <el-form-item
                  :label="productTypes[productAction.productType - 1].type + ' code'"
                >
                  <el-input
                    :placeholder="
                      productTypes[productAction.productType - 1].type + ' code'
                    "
                    v-model="productAction.parentCode"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="productAction.productType == 4">
                <el-form-item
                  :label="'Included ' + productTypes[productAction.productType - 1].type"
                >
                  <el-input
                    :placeholder="
                      'Included ' + productTypes[productAction.productType - 1].type
                    "
                    v-model="productAction.parentCode"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-card shadow="never" v-if="productCodes.length > 0">
              <el-table :data="productCodes" style="width: 100%">
                <el-table-column label="" type="index" width="100"> </el-table-column>
                <el-table-column label="Product Code">
                  <template slot-scope="scope">
                    {{ scope.row }}
                  </template>
                </el-table-column>
                <el-table-column label="Remove" align="right">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="danger"
                      @click="removeProductCode(scope.$index)"
                      >Delete</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-row>
        </div>
      </div>
    </el-row>
    <!-- END Percentage -->
    <!-- START Unit -->
    <el-row v-if="discountType == '3'">
      <div class="card">
        <div class="card-header bg-transparent custom-action-card">
          <el-col :span="24"><h2 class="custom-label-action">Action for item</h2></el-col>
          <el-row>
            <el-col :span="24" class="mb-3">
              <el-select
                placeholder="Select type"
                v-model="productAction.productType"
                :default-first-option="true"
              >
                <el-option
                  v-for="type in productTypes"
                  :key="type.id"
                  :label="type.type"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item :prop="'productAction.value'" label="Product discount unit">
                <el-input-number
                  :min="minLength"
                  :max="amountLength"
                  v-model="productAction.value"
                >
                </el-input-number>
              </el-form-item>
            </el-col>

            <el-col
              :span="8"
              v-if="productAction.productType != 1 && productAction.productType != 4"
            >
              <el-form-item
                :label="productTypes[productAction.productType - 1].type + ' code'"
              >
                <el-input
                  :placeholder="
                    productTypes[productAction.productType - 1].type + ' code'
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="productAction.productType == 4">
              <el-form-item
                :label="'Included ' + productTypes[productAction.productType - 1].type"
              >
                <el-input
                  :placeholder="
                    'Included ' + productTypes[productAction.productType - 1].type
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :prop="'productAction.productCode'"
                label="Target product codes"
              >
                <el-input placeholder="Product code" v-model="productCode">
                  <el-button
                    slot="append"
                    icon="el-icon-plus"
                    @click="addProductCode"
                  ></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-card shadow="never" v-if="productCodes.length > 0">
            <el-table :data="productCodes" style="width: 100%">
              <el-table-column label="" type="index" width="100"> </el-table-column>
              <el-table-column label="Product Code">
                <template slot-scope="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column label="Remove" align="right">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="removeProductCode(scope.$index)"
                    >Delete</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </el-row>
    <el-row v-if="discountType == '5'">
      <div class="card">
        <div class="card-header bg-transparent custom-action-card">
          <el-col :span="24"><h2 class="custom-label-action">Action for item</h2></el-col>
          <el-col :span="24" class="mb-3">
            <el-select
              placeholder="Select type"
              v-model="productAction.productType"
              :default-first-option="true"
            >
              <el-option
                v-for="type in productTypes"
                :key="type.id"
                :label="type.type"
                :value="type.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-row type="flex" :gutter="10">
            <el-col :span="8">
              <el-form-item :prop="'productAction.fixedValue'" label="Fixed Value (VNĐ)">
                <el-input-number
                  :min="minLength"
                  :max="amountLength"
                  v-model="productAction.fixedValue"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              v-if="productAction.productType != 1 && productAction.productType != 4"
            >
              <el-form-item
                :label="productTypes[productAction.productType - 1].type + ' code'"
              >
                <el-input
                  :placeholder="
                    productTypes[productAction.productType - 1].type + ' code'
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="productAction.productType == 4">
              <el-form-item
                :label="'Included ' + productTypes[productAction.productType - 1].type"
              >
                <el-input
                  :placeholder="
                    'Included ' + productTypes[productAction.productType - 1].type
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :prop="'productAction.productCode'"
                label="Target product codes"
              >
                <el-input placeholder="Product code" v-model="productCode">
                  <el-button
                    slot="append"
                    icon="el-icon-plus"
                    @click="addProductCode"
                  ></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-card shadow="never" v-if="productCodes.length > 0">
            <el-table :data="productCodes" style="width: 100%">
              <el-table-column label="" type="index" width="100"> </el-table-column>
              <el-table-column label="Product Code">
                <template slot-scope="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column label="Remove" align="right">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="removeProductCode(scope.$index)"
                    >Delete</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </el-row>
    <el-row v-if="discountType == '6'">
      <div class="card">
        <div class="card-header custom-action-card">
          <el-col :span="24">
            <h2 class="custom-label-action">Action for item</h2>
          </el-col>
          <el-row>
            <el-col :span="24">
              <el-select
                placeholder="Select type"
                v-model="productAction.productType"
                :default-first-option="true"
              >
                <el-option
                  v-for="type in productTypes"
                  :key="type.id"
                  :label="type.type"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="mt-3">
            <el-col :span="12">
              <el-form-item
                label="Order of target product"
                :prop="'productAction.orderLadderProduct'"
              >
                <el-input-number
                  :min="minLength"
                  :max="99"
                  placeholder="Order of target product"
                  v-model="productAction.orderLadderProduct"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Ladder price" :prop="'productAction.ladderPrice'">
                <el-input-number
                  placeholder="Ladder price"
                  :min="minLength"
                  :max="amountLength"
                  v-model="productAction.ladderPrice"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col
              :span="12"
              v-if="productAction.productType != 1 && productAction.productType != 4"
            >
              <el-form-item
                :label="productTypes[productAction.productType - 1].type + ' code'"
              >
                <el-input
                  :placeholder="
                    productTypes[productAction.productType - 1].type + ' code'
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="productAction.productType == 4">
              <el-form-item
                :label="'Included ' + productTypes[productAction.productType - 1].type"
              >
                <el-input
                  :placeholder="
                    'Included ' + productTypes[productAction.productType - 1].type
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="'productAction.productCode'"
                label="Target product codes"
              >
                <el-input placeholder="Product code" v-model="productCode">
                  <el-button
                    slot="append"
                    icon="el-icon-plus"
                    @click="addProductCode"
                  ></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-card shadow="never" v-if="productCodes.length > 0">
            <el-table :data="productCodes" style="width: 100%">
              <el-table-column label="" type="index" width="100"> </el-table-column>
              <el-table-column label="Product Code">
                <template slot-scope="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column label="Remove" align="right">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="removeProductCode(scope.$index)"
                    >Delete</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div></el-row
    >

    <el-row v-if="discountType == '7'">
      <div class="card">
        <div class="card-header custom-action-card">
          <el-col :span="24">
            <h2 class="custom-label-action">Action for item</h2>
          </el-col>
          <el-row>
            <el-col :span="24">
              <el-select
                placeholder="Select type"
                v-model="productAction.productType"
                :default-first-option="true"
              >
                <el-option
                  v-for="type in productTypes"
                  :key="type.id"
                  :label="type.type"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="mt-3">
            <el-col :span="12">
              <el-form-item
                label="Target bundle price (VNĐ)"
                prop="productAction.bundlePrice"
              >
                <el-input-number
                  placeholder="Target bundle price"
                  :min="minLength"
                  :max="amountLength"
                  v-model="productAction.bundlePrice"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="Bundle product quantity"
                prop="productAction.bundleQuantity"
              >
                <el-input-number
                  :min="minLength"
                  :max="quantityLength"
                  placeholder="Bundle product quantity"
                  v-model="productAction.bundleQuantity"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="Strategy">
                <el-select
                  v-model="productAction.strategy"
                  :default-first-option="true"
                  placeholder="Select"
                >
                  <el-option key="1" label="CHEAPEST" value="1"> </el-option>
                  <el-option key="2" label="MOST EXPENSIVE" value="2"> </el-option>
                  <el-option key="3" label="DEFAULT" value="3"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col
              :span="12"
              v-if="productAction.productType != 1 && productAction.productType != 4"
            >
              <el-form-item
                :label="productTypes[productAction.productType - 1].type + ' code'"
              >
                <el-input
                  :placeholder="
                    productTypes[productAction.productType - 1].type + ' code'
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="productAction.productType == 4">
              <el-form-item
                :label="'Included ' + productTypes[productAction.productType - 1].type"
              >
                <el-input
                  :placeholder="
                    'Included ' + productTypes[productAction.productType - 1].type
                  "
                  v-model="productAction.parentCode"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="'productAction.productCode'"
                label="Target product codes"
              >
                <el-input placeholder="Product code" v-model="productCode">
                  <el-button
                    slot="append"
                    icon="el-icon-plus"
                    @click="addProductCode"
                  ></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-card shadow="never" v-if="productCodes.length > 0">
            <el-table :data="productCodes" style="width: 100%">
              <el-table-column label="" type="index" width="100"> </el-table-column>
              <el-table-column label="Product Code">
                <template slot-scope="scope">
                  {{ scope.row }}
                </template>
              </el-table-column>
              <el-table-column label="Remove" align="right">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="removeProductCode(scope.$index)"
                    >Delete</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
    </el-row>
    <!-- END bundle -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      productCode: "",
      strategy: "1",
      formLabel: "Discount action for item: ",
      amountLength: 999999999,
      quantityLength: 999999,
      minLength: 0,
    };
  },
  computed: {
    productTypes() {
      return this.$store.state.action.productTypes;
    },
    productAction() {
      return this.actionForm.productAction;
    },
  },
  props: {
    actionForm: Object,
    productCodes: Array,
    discountType: String,
  },

  name: "product-action",
  methods: {
    addProductCode() {
      if (this.productCode.trim() != "") {
        this.$emit("addProductCode", this.productCode);
        if (this.productAction.productCode.length == 0) {
          this.productAction.productCode += this.productCode;
        } else {
          this.productAction.productCode += "|" + this.productCode;
        }
        this.productCode = "";
      }
    },
    removeProductCode(index) {
      this.$emit("removeProductCode", index);
      this.productAction.productCode = "";
      if (this.productCodes.length != 0) {
        for (let code of this.productCodes) {
          if (this.productAction.productCode == "") {
            this.productAction.productCode += code;
          } else {
            this.productAction.productCode += "|" + code;
          }
        }
      }
      console.log("Product code after delete: " + this.productAction.productCode);
    },
  },
};
</script>

<style></style>
