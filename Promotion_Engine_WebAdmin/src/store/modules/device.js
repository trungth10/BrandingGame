import axios from "axios";
import { API_URL } from "../API_KEY";

export const device = {
  namespaced: true,
  state: {
    deviceList: [],
    storeSelectList: [],
    brandId: "",
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    updateParams: [],
    hideParams: [],
    cateId: "",
    name: "",
    deviceId: "",
    imei: "",
    storeId: "",
    gameConfigId: "",
  },
  mutations: {
    setGameCampaignId(state, context) {
      state.gameConfigId = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setDeviceList(state, context) {
      state.deviceList = context;
      console.log("deviceList :>> ", state.deviceList);
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setUpdateParams(state, context) {
      state.updateParams = context;
      console.log("updateParams :>> ", state.updateParams);
    },
    setCateId(state, context) {
      state.cateId = context;
    },
    setName(state, context) {
      state.name = context;
    },
    setDeviceId(state, context) {
      state.deviceId = context;
    },
    setIMEI(state, context) {
      state.imei = context;
    },
    setStoreId(state, context) {
      state.storeId = context;
    },
    setHideParams(state, context) {
      state.hideParams = context;
    },
    setStoreSelectList(state, context) {
      state.storeSelectList = context;
    },
  },
  actions: {
    async getDevice({ commit }) {
      let PageSize = this.state.device.PageSize;
      let PageIndex = this.state.device.PageIndex;
      let brandId = this.state.device.brandId;
      console.log("brandId :>> ", brandId);
      await axios
        .get(API_URL + "api/devices/brand", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            console.log("device.js: Save SUCCESS");
            console.log("response.date :>> ", response.data);
            let result = response.data.data;
            let outcome = response.data.metadata;
            commit("setDeviceList", result);
            commit("setCounter", outcome.totalItems);
          } else {
            console.log("device.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log("device.js - getDevice:>> " + error);
        });

      //# get All
      await axios
        .get(API_URL + "api/stores", {
          params: {
            PageSize: 0,
            PageIndex: 0,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            let result = response.data.data;
            console.log("store select list :>> ", result);
            commit("setStoreSelectList", result);
          } else {
            console.log("device.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log("stores.js - getStoresList:>> " + error);
        });
    },
    async saveDev() {
      console.log("saveDev trigger!");
      let params = this.state.device.updateParams;
      console.log("params :>> ", params);
      for (const param of params) {
        let reqParam = {
          // imei: param.imei,
          name: param.name,
          storeId: param.storeId,
          deviceId: param.deviceId,
          gameConfigId: param.gameConfigId,
        };
        console.log("reqParam :>> ", reqParam);
        let id = param.deviceId;
        await axios
          .put(API_URL + "api/devices/" + id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("device.js: Save SUCCESS");
              console.log("response.date :>> ", response.data);
            } else {
              console.log("device.js: Save FAIL ");
            }
          })
          .catch((error) => {
            console.log("device.js - saveDev:>> " + error);
          });
      }
    },
    async addDev() {
      let reqParam = {
        storeId: this.state.device.storeId,
        name: this.state.device.name,
        gameCampaignId: this.state.device.gameConfigId,
      };
      console.log("reqParam :>> ", reqParam);
      await axios
        .post(API_URL + "api/devices", reqParam)
        .then((response) => {
          if (response.status == 200) {
            console.log("device.js: Save SUCCESS");
            console.log("response.date :>> ", response.data);
          } else {
            console.log("device.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log("device.js - addDev:>> " + error);
        });
    },
    async hideDev() {
      let params = this.state.device.hideParams;
      console.log("Cái param để xóa nó ở đâu :>> ", params);
      for (const param of params) {
        let reqParam = {
          deviceId: param.deviceId,
          delFlg: true,
        };
        console.log("reqParam :>> ", reqParam);
        await axios
          .put(API_URL + "api/devices/" + param.deviceId, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("device.js: Delete SUCCESS");
            } else {
              console.log("device.js: Delete FAIL ");
              console.log(response.data);
            }
          })
          .catch((error) => {
            console.log("device.js - hideDev:>> " + error);
          });
      }
    },
  },
};
