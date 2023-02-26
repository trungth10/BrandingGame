import axios from "axios";
import { API_URL } from "../API_KEY";

export const game_campaign = {
  namespaced: true,
  state: {
    brandId: "",
    pageSize: 10,
    pageIndex: 1,
    counter: 0,
    gameConfigs: [],
    gameMaster: [],
    gamePromo: [],
    gameConfig: {},
    updateGameCampaign: {},
    gameConfigInfo: {},
    deleteId: "",
    gameConfigId: "",
    stores: [],
  },
  mutations: {
    setUpdateGameCampaign(state, context) {
      state.updateGameCampaign = context;
    },
    setGameCampaignInfo(state, context) {
      let gameConfigInfo = context;
      let promotions = this.state.game_campaign.gamePromo;
      let promotionIdGameCampaign = gameConfigInfo.promotionId;
      let gameMasters = this.state.game_campaign.gameMaster;
      let storesMapp = gameConfigInfo.storeGameCampaignMapping;
      let hasGameMaster = gameMasters.find(
        (f) => f.id == gameConfigInfo.gameMasterId
      );
      if (!hasGameMaster) {
        gameConfigInfo.gameMasterId = "Not found";
        gameConfigInfo.gameStyle = "border:1px solid red";
      }
      if (promotions.length > 0) {
        let exist = promotions.find(
          (o) => o.promotionId == promotionIdGameCampaign
        );
        if (exist) {
          gameConfigInfo.style = "";
        } else {
          gameConfigInfo.promotionId = "Not found";
          gameConfigInfo.style = "border:1px solid red";
          let gameItems = gameConfigInfo.gameItems;

          gameItems.forEach((item) => {
            item.promotionTierId = "Not found";
            item.style = "border:1px solid red";
          });
        }
      }
      if (storesMapp.length > 0) {
        gameConfigInfo.storeIdList = [];
        storesMapp.forEach((e) => {
          gameConfigInfo.storeIdList.push(e.storeId);
        });
        console.log(gameConfigInfo.storeIdList);
      }
      state.gameConfigInfo = gameConfigInfo;
    },
    setGameCampaignId(state, context) {
      state.gameConfigId = context;
    },
    setDeleteId(state, context) {
      state.deleteId = context;
    },
    setGameCampaign(state, context) {
      state.gameConfig = context;
    },
    setGamePromo(state, context) {
      state.gamePromo = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setPageSize(state, context) {
      state.pageSize = context;
    },
    setPageIndex(state, context) {
      state.pageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setGameCampaigns(state, context) {
      state.gameConfigs = context;
    },
    setGameCampaignStores(state, context) {
      state.stores = context;
    },
    setGameMaster(state, context) {
      state.gameMaster = context;
    },
  },
  actions: {
    async updateGameCampaign() {
      let gameConfig = this.state.game_campaign.updateGameCampaign;
      gameConfig.startGame =  new Date(gameConfig.startGame).toLocaleString("vn", { timeZone: "Asia/Ho_Chi_Minh" });
      gameConfig.endGame =  new Date(gameConfig.endGame).toLocaleString("vn", { timeZone: "Asia/Ho_Chi_Minh" });
      let id = gameConfig.id;
      return await axios
        .put(API_URL + "api/game-campaign", gameConfig, {
          params: {
            gameConfigId: id,
          },
        })
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getGameCampaignInfo({ commit }) {
      let gameConfigId = this.state.game_campaign.gameConfigId;
      let brandId = this.state.game_campaign.brandId;
      return await axios
        .get(API_URL + "api/game-campaign/info", {
          params: {
            gameConfigId: gameConfigId,
            brandId: brandId,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setGameCampaignInfo", result.data);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async deleteConfig() {
      let id = this.state.game_campaign.deleteId;
      return await axios
        .delete(API_URL + "api/game-campaign/" + id)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async createGameCampaign() {
      let brandId = this.state.game_campaign.brandId;
      let gameConfig = this.state.game_campaign.gameConfig;
      gameConfig.brandId = brandId;
      gameConfig.startGame =  new Date(gameConfig.startGame).toLocaleString("vn", { timeZone: "Asia/Ho_Chi_Minh" });
      gameConfig.endGame =  new Date(gameConfig.endGame).toLocaleString("vn", { timeZone: "Asia/Ho_Chi_Minh" });
      return await axios
        .post(API_URL + "api/game-campaign", gameConfig)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getPromoForGameCampaign({ commit }) {
      let brandId = this.state.game_campaign.brandId;
      return await axios
        .get(API_URL + "api/promotions/for-game-campaign/" + brandId)
        .then((result) => {
          if (result.status == 200) {
            commit("setGamePromo", result.data["data"]);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getStoresList({ commit }) {
      let brandId = this.state.game_campaign.brandId;
      //# get store depends on pageIndex
      return await axios
        .get(API_URL + "api/Stores", {
          params: {
            BrandId: brandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setGameCampaignStores", result.data);
            return response;
          }
        })
        .catch((error) => {
          console.log("store.js: Get FAIL ");
          console.log(error);
        });
    },
    async getGameCampaignList({ commit }) {
      let pageSize = this.state.game_campaign.pageSize;
      let pageIndex = this.state.game_campaign.pageIndex;
      let brandId = this.state.game_campaign.brandId;
      return await axios
        .get(API_URL + "api/game-campaign", {
          params: {
            PageSize: pageSize,
            PageIndex: pageIndex,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            let result = response.data;
            let outcome = result.metadata;
            commit("setGameCampaigns", result["data"]);
            commit("setCounter", outcome.totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getGameMasterList({ commit }) {
      let brandId = this.state.game_campaign.brandId;
      return await axios
        .get(API_URL + "api/game-master", {
          params: {
            PageSize: 0,
            PageIndex: 0,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            let result = response.data;
            commit("setGameMaster", result["data"]);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
