<template>
  <div style="font-size: 1rem" class="pd-5">
    <el-row>
      <el-col class="vertical-split" :span="6">
        <h2>Order Information</h2>
        <label
          >ID
          <el-tag effect="dark">
            <b> {{ trans.order.CustomerOrderInfo.Id }}</b></el-tag
          ></label
        ><br />
        <label
          >Date
          <b> {{ trans.order.CustomerOrderInfo.BookingDate | formatDate }} </b></label
        >
      </el-col>
      <el-col class="vertical-split" :span="6">
        <h2>Store</h2>
        <p>{{ trans.order.CustomerOrderInfo.Attributes.StoreInfo.StoreId }}</p>
      </el-col>
      <el-col class="vertical-split" :span="6">
        <h2>Customer</h2>
        <p>{{ trans.order.CustomerOrderInfo.Customer.CustomerName }}</p>
        <p>{{ trans.order.CustomerOrderInfo.Customer.CustomerPhoneNo }}</p>
      </el-col>
      <el-col class="vertical-split" :span="6">
        <el-col :span="24">
          Total: <b>{{ trans.order.FinalAmount }}</b>
        </el-col>
        <el-col :span="24">
          Sub Total: <b>{{ trans.order.TotalAmount }}</b>
        </el-col>
        <el-col :span="24">
          Discount: <b>{{ trans.order.Discount }}</b>
        </el-col>
        <el-col :span="24">
          Point: <b>{{ trans.order.BonusPoint }}</b>
        </el-col>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col v-if="trans.order.CustomerOrderInfo.Vouchers.length > 0" :span="8">
        <h3>Voucher</h3>
        <el-table border="" :data="trans.order.CustomerOrderInfo.Vouchers">
          <el-table-column type="index"> </el-table-column>
          <el-table-column label="Voucher Code">
            <template slot-scope="scope">
              <label v-if="scope.row.VoucherCode != null">
                {{ scope.row.PromotionCode }}-{{ scope.row.VoucherCode }}</label
              >
              <label v-if="scope.row.VoucherCode == null">
                {{ scope.row.PromotionCode }}</label
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="trans.order.CustomerOrderInfo.Vouchers.length > 0 ? 16 : 24">
        <h3>Product</h3>
        <el-table border="" :data="trans.order.CustomerOrderInfo.CartItems">
          <el-table-column type="index"> </el-table-column>
          <el-table-column label="Code">
            <template slot-scope="scope">
              <label style="word-break: break-word"> {{ scope.row.ProductCode }}</label>
            </template>
          </el-table-column>
          <el-table-column label="Name">
            <template slot-scope="scope">
              <label style="word-break: break-word"> {{ scope.row.ProductName }}</label>
            </template>
          </el-table-column>
          <el-table-column label="Image">
            <template slot-scope="scope">
              <img :src="scope.row.UrlImg" width="40" />
            </template>
          </el-table-column>
          <el-table-column label="Quantity">
            <template slot-scope="scope">
              <label> {{ scope.row.Quantity }}</label>
            </template>
          </el-table-column>
          <el-table-column label="Unit Price">
            <template slot-scope="scope">
              <label> {{ scope.row.UnitPrice }}</label>
            </template>
          </el-table-column>
          <el-table-column label="Sub Total">
            <template slot-scope="scope">
              <label> {{ scope.row.SubTotal }}</label>
            </template>
          </el-table-column>
          <el-table-column label="Discount">
            <template slot-scope="scope">
              <label> {{ scope.row.Discount }}</label>
            </template>
          </el-table-column>
          <el-table-column label="Total">
            <template slot-scope="scope">
              <label> {{ scope.row.Total }}</label>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row v-if="trans.order.Gift.length > 0">
      <h3>Gift</h3>
      <el-table border="" :data="trans.order.Gift">
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="Game Code">
          <template slot-scope="scope">
            <label style="word-break: break-word"> {{ scope.row.gameCode }}</label>
          </template>
        </el-table-column>
        <el-table-column label="Product Code">
          <template slot-scope="scope">
            <label style="word-break: break-word"> {{ scope.row.productCode }}</label>
          </template>
        </el-table-column>

        <el-table-column label="Product Name">
          <template slot-scope="scope">
            <label> {{ scope.row.productName }}</label>
          </template>
        </el-table-column>
        <el-table-column label="Promotion Name">
          <template slot-scope="scope">
            <label> {{ scope.row.promotionName }}</label>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import moment from "moment";
Vue.use(VueClipboard);
export default {
  name: "trans-detail",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  filters: {
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY HH:mm");
    },
  },
  props: {},
  created() {},
  computed: {
    trans() {
      return this.$store.state.transaction.transDetail;
    },
  },
  watch: {},
  data() {
    return {
      dialogVisible: false,
      allStores: [],
      tableLoading: false,
      storeAppliedId: [],
      isEditInfo: false,
      redemped: 0,
      quantity: 0,
      pageCount: 1,
      pagination: {
        default: 1,
      },
      selectedStoreId: "",
    };
  },

  methods: {},
};
</script>
<style scoped>
.vertical-split {
  border-left: 0.3vw solid #2dce89;
  min-height: 10vh;
  padding-left: 10px;
  margin: 0px;
}
</style>
