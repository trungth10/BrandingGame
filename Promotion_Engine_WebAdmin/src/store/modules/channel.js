import "es6-promise/auto";
import axios from "axios";
import { API_URL } from "../API_KEY";

export const channel = {
  namespaced: true,
  state: {
    channelList: [],
    counter: 0,
    PageSize: 10,
    PageIndex: 1,
    isDuplicate: false,
    updateParams: [],
    hideParams: [],
    channelCode: "",
    channelName: "",
    channelId: "",
    channelType: "",
    group: 0,
    brandId: "",
    channelForVoucher: {},
  },
  getters: {
    channelList: (state) => state.channelList,
    PageSize: (state) => state.PageSize,
    PageIndex: (state) => state.PageIndex,
  },
  mutations: {
    setChannelForVoucher(state, context) {
      state.channelForVoucher = context;
    },
    setIndex(state, result) {
      let PageSize = this.state.channel.PageSize;
      let PageIndex = this.state.channel.PageIndex;
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
      state.channelList = result;
    },
    setChannelList(state, context) {
      state.channelList = context;
    },
    setChannelCode(state, context) {
      state.channelCode = context;
    },
    setChannelType(state, context) {
      state.channelType = context;
    },
    setIsDuplicate(state, context) {
      state.isDuplicate = context;
    },
    setChannelName(state, context) {
      state.channelName = context;
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setChannelId(state, context) {
      state.channelId = context;
    },
    setUpdateParams(state, context) {
      state.updateParams.push(...context);
    },
    setHideParams(state, context) {
      state.hideParams.push(...context);
    },
    setGroup(state, context) {
      state.group = context;
    },
  },
  actions: {
    async getChannelForVoucher({ commit }) {
      let brandId = this.state.channel.brandId;
      return await axios
        .get(API_URL + "api/channels", {
          params: {
            PageSize: 0,
            PageIndex: 0,
            BrandId: brandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setChannelForVoucher", result['data']);
          }
          return response;
        })
        .catch((error) => {
          throw error;
        });
    },
    async countChannel({ commit }) {
      let brandId = this.state.channel.brandId;
      await axios
        .get(API_URL + "api/channels/count", {
          params: {
            BrandId: brandId,
          },
        })
        .then((response) => {
          var result = response.data;
          commit("setCounter", result);
        });
    },
    async getChannelList({ commit }) {
      let PageSize = this.state.channel.PageSize;
      let PageIndex = this.state.channel.PageIndex;
      let brandId = this.state.channel.brandId;
      await axios
        .get(API_URL + "api/channels", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            BrandId: brandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setIndex", result.data);
          }
        })
        .catch((error) => {
          console.log("channel.js: Get FAIL ");
          console.log(error);
        });
    },
    //# check Duplicate
    async checkDuplicate({ commit }) {
      let channelId = this.state.channel.channelId;
      let params = {};
      if (channelId) {
        params = {
          brandID: this.state.channel.brandId,
          channelCode: this.state.channel.channelCode,
          channelId: channelId,
        };
      } else {
        params = {
          brandID: this.state.channel.brandId,
          channelCode: this.state.channel.channelCode,
        };
      }

      return await axios
        .post(API_URL + "api/channels/checkChannelCodeExist", params)
        .then((response) => {
          if (response.status === 200) {
            commit("setIsDuplicate", response.data);
          } else {
            console.log("Check duplicate FAILED!");
          }
          return response;
        })
        .catch((error) => {
          console.log("channel.js - checkDuplicate:>> " + error);
        });
    },
    async addChannel({ commit, dispatch }) {
      let channelParam = {
        brandId: this.state.channel.brandId,
        channelCode: this.state.channel.channelCode,
        channelName: this.state.channel.channelName,
        group: this.state.channel.group,
        channelType: this.state.channel.channelType,
      };
      await axios
        .post(API_URL + "api/channels", channelParam)
        .then((response) => {
          if (response.status == 200) {
            commit("setPageIndex", 1);
            dispatch("countChannel");
            dispatch("getChannelList");
          } else {
            console.log("channel.js: Create FAIL ");
            console.log(response.data);
          }
        });
    },
    async saveChannel() {
      let params = this.state.channel.updateParams;
      console.log("updateParams", params);
      for (const param of params) {
        let reqParam = {
          channelId: param.channelId,
          brandId: param.brandId,
          channelCode: param.channelCode,
          channelName: param.channelName,
          group: param.group,
          channelType: param.channelType,
        };
        let id = param.channelId;
        await axios
          .put(API_URL + "api/channels/" + id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("channel.js: Save SUCCESS");
            } else {
              console.log("channel.js: Save FAIL ");
              console.log(response.data);
            }
          });
      }
    },
    async hideChannel() {
      let params = this.state.channel.hideParams;
      for (const param of params) {
        let reqParam = {
          channelId: param.channelId,
          delFlg: true,
        };
        await axios
          .put(API_URL + "api/channels/" + param.channelId, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("channel.js: Delete SUCCESS");
            } else {
              console.log("channel.js: Delete FAIL ");
              console.log(response.data);
            }
          });
      }
    },
  },
};
