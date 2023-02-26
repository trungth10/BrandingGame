import axios from "axios";
import { API_URL } from "../API_KEY";

export const transaction = {
  namespaced: true,
  state: {
    transaction: [],
    counter: 0,
    pageSize: 10,
    pageIndex: 1,
    transDetail: {},
    promotionId: "",
  },
  mutations: {
    setTransDetail(state, context) {
      state.transDetail = context;
    },
    setPageIndex(state, context) {
      state.pageIndex = context;
    },
    setTransaction(state, context) {
      state.transaction = context;
    },
    setPromotionId(state, context) {
      state.promotionId = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
  },
  actions: {
    async getTransaction({ commit }) {
      let pageSize = this.state.transaction.pageSize;
      let pageIndex = this.state.transaction.pageIndex;
      let promotionId = this.state.transaction.promotionId;
      return await axios
        .get(API_URL + "api/transaction", {
          params: {
            PageSize: pageSize,
            PageIndex: pageIndex,
            PromotionId: promotionId,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setTransaction", result.data["data"]);
            commit("setCounter", result.data["metadata"].totalItems);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
