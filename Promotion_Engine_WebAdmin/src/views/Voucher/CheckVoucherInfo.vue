<template>
  <div v-loading="loading">
    <el-card shadow="never">
      <el-row v-if="voucherInfo.voucherId != $ENV.GUID.EMPTY">
        <el-card class="pb-3" shadow="">
          <el-col :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Voucher Code </b></label>
              <el-tag class="tag-custom" effect="dark" size="medium" type="success">
                {{ voucherInfo.voucherCode }}
              </el-tag>
            </span>
          </el-col>
          <el-col :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Promotion: </b></label>
              <el-tag
                v-if="voucherInfo.promotion == null"
                class="tag-custom"
                effect="dark"
                size="medium"
                type="danger"
              >
                N/A
              </el-tag>
              <label v-if="voucherInfo.promotion != null" style="font-size: 18px">
                {{ voucherInfo.promotion.promotionName | valueFilterNull }}</label
              >
            </span>
          </el-col>
          <el-col :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Promo Code </b></label>
              <el-tag
                v-if="!voucherInfo.promotion"
                class="tag-custom"
                effect="dark"
                size="medium"
                type="danger"
              >
                N/A
              </el-tag>
              <el-tag
                v-if="voucherInfo.promotion"
                class="tag-custom"
                size="medium"
                effect="dark"
                type="warning"
              >
                {{ voucherInfo.promotion.promotionCode | valueFilterNull }}
              </el-tag>
            </span>
          </el-col>
        </el-card>
      </el-row>
      <el-row v-if="voucherInfo.voucherId != $ENV.GUID.EMPTY" class="mt-4">
        <el-card class="pb-3" shadow="">
          <el-col :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Redemp Date </b></label>
              <el-tag class="tag-custom" effect="dark" size="medium" type="success">
                {{ voucherInfo.redempedDate | formatDate }}
              </el-tag>
            </span>
          </el-col>
          <el-col :span="16">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Channel </b></label>
              <el-tag class="tag-custom" effect="dark" size="medium" type="success">
                {{ voucherInfo.channel.channelName | valueFilterNull }}
              </el-tag>
            </span>
          </el-col>
          <el-col class="mt-3" :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Customer: </b></label
              >{{ voucherInfo.membership.fullname | valueFilterNull }}
            </span>
          </el-col>
          <el-col class="mt-3" :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Email: </b></label>
              {{ voucherInfo.membership.email | valueFilterNull }}
            </span>
          </el-col>
          <el-col class="mt-3" :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Phone number: </b></label>
              {{ voucherInfo.membership.phoneNumber | valueFilterNull }}
            </span>
          </el-col>
        </el-card>
      </el-row>
      <el-row v-if="voucherInfo.voucherId != $ENV.GUID.EMPTY" class="mt-4">
        <el-card class="pb-3" shadow="">
          <el-col class="mb-3" :span="8">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Use Date </b></label>
              <el-tag class="tag-custom" effect="dark" size="medium" type="success">
                {{ voucherInfo.usedDate | formatDate }}
              </el-tag>
            </span>
          </el-col>
          <el-col class="mb-3" :span="16">
            <span>
              <label style="font-size: 18px" class="mr-2"> <b> Store </b></label>
              <el-tag
                v-if="voucherInfo.store"
                class="tag-custom"
                effect="dark"
                size="medium"
                type="success"
              >
                {{ voucherInfo.store.storeName | valueFilterNull }}
              </el-tag>
            </span>
          </el-col>
          <el-card v-if="orderInfo != null" class="pb-3" shadow="never">
            <el-col :span="12">
              <span>
                <label style="font-size: 18px" class="mr-2"> <b> Order ID </b></label>
                <el-tag
                  v-if="orderInfo"
                  class="tag-custom"
                  effect="dark"
                  size="medium"
                  type="info"
                >
                  {{ orderInfo.CustomerOrderInfo.Id | valueFilterNull }}
                </el-tag>
              </span>
            </el-col>
            <el-col :span="12">
              <span>
                <label style="font-size: 18px" class="mr-2"> <b> Order Date </b></label>
                <el-tag
                  v-if="orderInfo"
                  class="tag-custom"
                  effect="plain"
                  size="medium"
                  type="warning"
                >
                  {{ orderInfo.CustomerOrderInfo.BookingDate | formatDateTime }}
                </el-tag>
              </span>
            </el-col>

            <el-col v-if="orderInfo != null" :span="24">
              <el-table
                class="mt-3"
                height="200"
                border=""
                cell-class-name="myWordClass"
                v-if="orderInfo != null"
                :data="orderInfo.CustomerOrderInfo.CartItems"
              >
                <el-table-column type="index" width="70"> </el-table-column>
                <el-table-column
                  label="Name"
                  prop="ProductName"
                  style="word-break: break-word"
                ></el-table-column>
                <el-table-column label="Code" prop="ProductCode"> </el-table-column>
                <el-table-column label="Image">
                  <template slot-scope="scope">
                    <img
                      :src="scope.row.UrlImg"
                      alt="Image of product"
                      width="40"
                      height="40"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="Quantity" prop="Quantity"> </el-table-column>
                <el-table-column label="Price" prop="UnitPrice"> </el-table-column>
                <el-table-column label="Subtotal" prop="SubTotal"> </el-table-column>
                <el-table-column label="Discount" prop="Discount"> </el-table-column>
                <el-table-column label="Total" prop="Total"> </el-table-column>
              </el-table>
            </el-col>
            <el-col class="mt-3" :span="6">
              <el-col :span="24">
                <span>
                  <label style="font-size: 18px" class="mr-2"> <b> Subtotal: </b></label>
                  {{ orderInfo.TotalAmount | valueFilterNull }} VNĐ
                </span>
              </el-col>
              <el-col :span="24">
                <span>
                  <label style="font-size: 18px" class="mr-2"> <b> Discount: </b></label>
                  {{ orderInfo.Discount | valueFilterNull }} VNĐ
                </span>
              </el-col>
              <el-col :span="24">
                <span>
                  <label style="font-size: 18px" class="mr-2">
                    <b> Shipping fee: </b></label
                  >
                  {{ orderInfo.CustomerOrderInfo.ShippingFee }} VNĐ
                </span>
              </el-col>
              <el-col :span="24">
                <span>
                  <label style="font-size: 18px" class="mr-2"> <b> Total: </b></label>
                  {{ orderInfo.FinalAmount | valueFilterNull }} VNĐ
                </span>
              </el-col>
            </el-col>
          </el-card>
        </el-card>
      </el-row>
      <el-row v-if="voucherInfo.voucherId == $ENV.GUID.EMPTY">
        <center>
          <h3>Voucher is not exist</h3>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/promotion-engine-3a6dc.appspot.com/o/error.png?alt=media&token=e1f1bfaa-b6f1-474a-8685-b366e5d9113e"
            alt="Not found"
            width="100"
          />
        </center>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import moment from "moment";

Vue.use(VueClipboard);
export default {
  name: "check-voucher-info",

  props: {},
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    voucherInfo() {
      return this.$store.state.voucher.checkVoucherInfo.voucherInfo;
    },
    orderInfo() {
      return this.$store.state.voucher.checkVoucherInfo.order;
    },
  },
  methods: {},
  filters: {
    valueFilterNull(value) {
      if (value) {
        return value;
      }
      return "N/A";
    },
    formatDate(value) {
      if (value == null) {
        return "N/A";
      }
      return moment(value).format("DD/MM/YYYY");
    },
    formatDateTime(value) {
      if (value == null) {
        return "N/A";
      }
      return moment(value).format("DD/MM/YYYY HH:mm");
    },
  },
};
</script>
<style scoped>
.tag-custom {
  font-size: 15px;
}
.myWordClass {
  word-break: break-word;
}
</style>
<style></style>
