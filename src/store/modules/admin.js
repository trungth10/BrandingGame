import axios from "axios";
import { API_URL } from "../API_KEY";

export const admin = {
  namespaced: true,
  state: {
    accountList: [],
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    brandId: "",
    params: {},
    username: '',
    position: 0,
  },
  mutations: {
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setAccountList(state, context) {
      state.accountList = context;
    },
    setParams(state, context) {
      state.params = context;
    },
    setUsername(state, context) {
      state.username = context;
    },
    setPosition(state, context) {
      state.position = context;
    },
  },
  actions: {
    async getAccountList({ commit }) {
      let PageSize = this.state.admin.PageSize;
      let PageIndex = this.state.admin.PageIndex;
      await axios
        .get(API_URL + "api/accounts/", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data.data;
            let outcome = response.data.metadata;
            console.log('result :>> ', result);
            commit("setAccountList", result);
            commit("setCounter", outcome.totalItems);
          }
        })
        .catch((error) => {
          console.log("admin.js " + error);
        })
    },
    async updateStatus() {
      console.log('updateStatus trigger!');
      let params = this.state.admin.params;
      params.updDate = new Date().toLocaleString("vn", { timeZone: "Asia/Ho_Chi_Minh" });
      let username = this.state.admin.username;
      let position = this.state.admin.position;
      await axios
        .put(API_URL + "api/accounts/" + username, params)
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            console.log('result :>> ', result);
            let list = this.state.admin.accountList;
            list.splice(position, 1, result);
          }
        })
        .catch((error) => {
          console.log("account.js " + error);
        })
    },
  },
};
