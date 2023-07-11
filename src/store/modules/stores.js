import axios from "axios";
import { API_URL } from "../API_KEY";

export const stores = {
  namespaced: true,
  state: {
    storeList: [],
    storeSelectList: [],
    storeCodeList: [],
    isDuplicate: false,
    counter: 0,
    PageSize: 10,
    PageIndex: 1,
    updateParams: [],
    hideParams: [],
    storeCode: "",
    storeName: "",
    group: 0,
    storeId: "",
    BrandId: "",
  },
  getters: {
    StoreList: (state) => state.storeList,
    PageSize: (state) => state.PageSize,
    PageIndex: (state) => state.PageIndex,
  },
  mutations: {
    setIndex(state, result) {
      let PageSize = this.state.stores.PageSize;
      let PageIndex = this.state.stores.PageIndex;
      for (let index = 0; index < result.length; index++) {
        let item = result[index];
        if (PageIndex > 1) {
          item["index"] = index + 1 + (PageIndex - 1) * PageSize;
        } else {
          item["index"] = index + 1;
        }
        result[index].edited = false;
        result[index].valid = null;
      }
      state.storeList = result;
    },
    setStoreList(state, context) {
      state.storeList = context;
    },
    setStoreCodeList(state, context) {
      state.storeCodeList = context;
    },
    setIsDuplicate(state, context) {
      state.isDuplicate = context;
    },
    setStoreCode(state, context) {
      state.storeCode = context;
    },
    setStoreName(state, context) {
      state.storeName = context;
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setPageSize(state, context) {
      state.PageSize = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setBrandId(state, context) {
      state.BrandId = context;
    },
    setStoreId(state, context) {
      state.storeId = context;
    },
    setUpdateParams(state, context) {
      state.updateParams.push(...context);
    },
    setGroup(state, context) {
      state.group = context;
    },
    setHideParams(state, context) {
      state.hideParams.push(...context);
    },
    setStoreSelectList(state, context) {
      state.storeSelectList = context;
      // console.log('storeSelectList :>> ', state.storeSelectList);
    },
  },
  actions: {
    async countStores({ commit }) {
      let BrandId = this.state.stores.BrandId;
      await axios
        .get(API_URL + "api/Stores/count", {
          params: {
            BrandId: BrandId,
          },
        })
        .then((response) => {
          var result = response.data;
          commit("setCounter", result);
        });
    },
    async getStoresList({ commit }) {
      let PageSize = this.state.stores.PageSize;
      let PageIndex = this.state.stores.PageIndex;
      let BrandId = this.state.stores.BrandId;

      //# get store depends on pageIndex
      return await axios
        .get(API_URL + "api/Stores", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            BrandId: BrandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setIndex", result.data);
          }
          return response;
        })
        .catch((error) => {
          console.log("store.js: Get FAIL ");
          console.log(error);
        });
    },

    //# check Duplicate
    async checkDuplicate({ commit }) {
      let storeId = this.state.stores.storeId;
      let params = {};
      if (storeId) {
        params = {
          brandID: this.state.stores.BrandId,
          storeCode: this.state.stores.storeCode,
          storeId: storeId,
        };
      } else {
        params = {
          brandID: this.state.stores.BrandId,
          storeCode: this.state.stores.storeCode,
        };
      }
      return await axios
        .post(API_URL + "api/stores/checkStoreCodeExist", params)
        .then((response) => {
          if (response.status === 200) {
            commit("setIsDuplicate", response.data);
          } else {
            console.log("Check duplicate FAILED!");
          }
          return response;
        })
        .catch((error) => {
          console.log("stores.js - checkDuplicate:>> " + error);
        });
    },
    async addStore({ commit, dispatch }) {
      let storeParam = {
        brandId: this.state.stores.BrandId,
        storeCode: this.state.stores.storeCode,
        storeName: this.state.stores.storeName,
        group: this.state.stores.group,
      };
      await axios.post(API_URL + "api/Stores", storeParam).then((response) => {
        if (response.status == 200) {
          commit("setPageIndex", 1);
          dispatch("countStores");
          dispatch("getStoresList");
        } else {
          console.log("store.js: Create FAIL ");
          console.log(response.data);
        }
      });
    },
    async saveStore() {
      let params = this.state.stores.updateParams;
      for (const param of params) {
        let reqParam = {
          storeId: param.storeId,
          brandId: param.BrandId,
          storeCode: param.storeCode,
          storeName: param.storeName,
          group: param.group,
        };
        let id = param.storeId;
        await axios
          .put(API_URL + "api/Stores/" + id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("store.js: Save SUCCESS");
            } else {
              console.log("store.js: Save FAIL ");
              console.log(response.data);
            }
          });
      }
    },
    async hideStore() {
      let params = this.state.stores.hideParams;
      for (const param of params) {
        let reqParam = {
          storeId: param.storeId,
          delFlg: true,
        };
        await axios
          .put(API_URL + "api/Stores/" + param.storeId, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("store.js: Delete SUCCESS");
            } else {
              console.log("store.js: Delete FAIL ");
              console.log(response.data);
            }
          });
      }
    },
  },
};
