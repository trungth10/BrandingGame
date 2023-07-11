import axios from "axios";
import router from "../../router";
import { API_URL } from "../API_KEY";

export const customer = {
  namespaced: true,
  state: {
    customerForm: {},
    channelCode: "",
    promotionId: "",
    storeCode: null,
    tierId: "",
    sst: null,
  },
  mutations: {
    setCustomerForm(state, context) {
      state.customerForm = context;
    },
    setChannelCode(state, context) {
      state.channelCode = context;
    },
    setStoreCode(state, context) {
      state.storeCode = context;
    },
    setPromotionId(state, context) {
      state.promotionId = context;
    },
    setTierId(state, context) {
      state.tierId = context;
    },
    setSst(state, context) {
      state.sst = context;
    },
  },
  actions: {
    async saveCustomer() {
      let customerForm = this.state.customer.customerForm;
      let channelCode = this.state.customer.channelCode;
      let promotionId = this.state.customer.promotionId;
      let tierId = this.state.customer.tierId;
      let params = null;
      let postParams = {
        cusFullName: customerForm.fullName,
        cusEmail: customerForm.email,
        cusPhoneNo: customerForm.phoneNumber,
        cusGender: customerForm.gender,
        channelCode: channelCode,
      };
      return await axios
        .post(
          API_URL +
            "api/vouchers/voucher-on-site/" +
            promotionId +
            "/" +
            tierId,
          postParams,
          {
            params: params,
          }
        )
        .then((response) => {
          return response.status;
        })
        .catch((error) => {
          console.log("customer.js " + error);
        });
    },
    async isExpiredUrl() {
      let sst = this.state.customer.sst;
      let params = null;
      if (sst != null) {
        params = {
          sst: sst,
        };
      }
      return await axios
        .post(API_URL + "api/vouchers/isExpiredUrl", null, {
          params: params,
        })
        .then((response) => {
          return response;
        })
        .catch(() => {
          router.push("/403");
        });
    },
  },
};
