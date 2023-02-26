import "es6-promise/auto";
import axios from "axios";
import { API_URL } from "../API_KEY";

export const promotion_detail = {
  namespaced: true,
  state: {
    brandId: "",
    promotionId: "",
    promotionTiers: [
      {
        conditionRule: {
          conditionGroup: [
            {
              membershipCondition: [{}],
              orderCondition: [{}],
              productCondition: [{}],
            },
          ],
        },
        action: {},
        membershipAction: {},
      },
    ],
    promotionDetail: {
      promotionStoreMapping: [
        {
          id: "",
          storeId: "",
        },
      ],
    },
    promotionInfo: {},
    promotionConfig: {},
    createPromotionTierParam: {
      promotionId: "",
      conditionRule: {},
      conditionGroups: [],
      action: {},
      membershipAction: {},
    },
    updatePromotionTierParam: {},
    deleteParam: {},
    voucherGroupId: "",
    taskList: [],
    storeOfPromo: [],
    channelOfPromo: [],
    updateChannel: {},
    updateStore: {},
    promotionDetailUpdate: {},
    redempVouchers: [],
    channelVouchers: [],
    storeVouchers: [],
    actionIdUpdate: "",
    giftIdUpdate: "",
    voucherGroupIdUpdate: "",
    conditionRuleIdUpdate: "",
    totalVoucherUpdate: 0,
    tierUpdate: {},
    checkChannelVouchers: [],
    checkChannelId: "",
    checkChannelPageSize: 10,
    checkChannelPageIndex: 1,
    checkChannelCounter: 0,
    checkStoreVouchers: [],
    checkStoreId: "",
    checkStorePageSize: 10,
    checkStorePageIndex: 1,
    checkStoreCounter: 0,
    deleteTierId: "",
  },

  mutations: {
    setDeleteTierId(state, context) {
      state.deleteTierId = context;
    },
    setCheckStoreId(state, context) {
      state.checkStoreId = context;
    },
    setCheckStoreVoucher(state, context) {
      state.checkStoreVouchers = context;
    },
    setCheckStorePageSize(state, context) {
      state.checkStorePageSize = context;
    },
    setCheckStorePageIndex(state, context) {
      state.checkStorePageIndex = context;
    },
    setCheckStoreCounter(state, context) {
      state.checkStoreCounter = context;
    },
    setCheckChannelId(state, context) {
      state.checkChannelId = context;
    },
    setCheckChannelVoucher(state, context) {
      state.checkChannelVouchers = context;
    },
    setCheckChannelPageSize(state, context) {
      state.checkChannelPageSize = context;
    },
    setCheckChannelPageIndex(state, context) {
      state.checkChannelPageIndex = context;
    },
    setCheckChannelCounter(state, context) {
      state.checkChannelCounter = context;
    },
    setTierUpdate(state, context) {
      state.tierUpdate = context;
    },
    setTotalVoucherUpdate(state, context) {
      state.totalVoucherUpdate = context;
    },
    setActionIdUpdate(state, context) {
      state.actionIdUpdate = context;
    },
    setPostActionIdUpdate(state, context) {
      state.giftIdUpdate = context;
    },
    setVoucherGroupIdUpdate(state, context) {
      state.voucherGroupIdUpdate = context;
    },
    setConditionRuleIdUpdate(state, context) {
      state.conditionRuleIdUpdate = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setPromotionId(state, context) {
      state.promotionId = context;
    },
    setPromotionTier(state, context) {
      state.promotionTiers = context;
    },
    setPromotionDetail(state, context) {
      let promotionDetail = context;
      // Convert observer array to normal array
      let levelMapping = Array.from(promotionDetail.memberLevelMapping);
      let storeMapping =Array.from(promotionDetail.promotionStoreMapping);
      let channelMapping =Array.from(promotionDetail.promotionChannelMapping);
      let tiers = Array.from(promotionDetail.promotionTier);
      promotionDetail.promotionStoreMapping = storeMapping
      promotionDetail.promotionChannelMapping = channelMapping
      promotionDetail.promotionTier = tiers
      console.log(promotionDetail)
      if (levelMapping.length > 0) {
        let levelMappId = [];
        levelMapping.forEach((level) => {
          levelMappId.push(level.memberLevelId);
        });
        promotionDetail.memberLevelMapping = levelMappId;
      }
      state.promotionDetail = promotionDetail;
    },
    setIsActive(state, context) {
      state.promotionDetail.voucherGroup.isActive = context;
    },
    setCreatePromotionTierParam(state, context) {
      state.createPromotionTierParam = context;
    },
    setUpdatePromotionTierParam(state, context) {
      state.updatePromotionTierParam = context;
    },
    setDeleteParam(state, context) {
      state.deleteParam = context;
    },
    setVoucherGroupId(state, context) {
      state.voucherGroupId = context;
    },
    clearPromotionDetail(state) {
      state.promotionDetail = {};
    },
    clearPromotionTiers(state) {
      state.promotionTiers = [];
    },
    addTask(state, context) {
      state.taskList.push(context);
    },
    removeTask(state, context) {
      let index = state.taskList.indexOf(context);
      state.taskList.splice(index, 1);
    },
    clearVoucherGroup(state) {
      state.promotionDetail.voucherGroup = null;
    },
    setStoreOfPromo(state, context) {
      state.storeOfPromo = context;
      console.log("state.storeOfPromo :>> ", state.storeOfPromo);
    },
    setChannelOfPromo(state, context) {
      state.channelOfPromo = context;
    },
    setUpdateChannel(state, context) {
      state.updateChannel = context;
    },
    setUpdateStore(state, context) {
      state.updateStore = context;
    },
    setPromotionDetailUpdate(state, context) {
      state.promotionDetailUpdate = context;
    },
    setStatus(state, context) {
      state.promotionDetail.status = context;
    },
    setRedempVoucher(state, context) {
      state.promotionDetail.redempVouchers = context;
      console.log("redempVouchers :>> ", state.promotionDetail.redempVouchers);
    },
    setChannelVoucher(state, context) {
      state.channelVouchers = context;
      console.log("channelVouchers :>> ", state.channelVouchers);
    },
    setStoreVoucher(state, context) {
      state.storeVouchers = context;
      console.log("storeVouchers :>> ", state.storeVouchers);
    },
  },
  actions: {
    async getRedempVoucher({ commit }) {
      let promotionId = this.state.promotion_detail.promotionId;
      let brandId = this.state.promotion_detail.brandId;
      await axios
        .get(API_URL + "api/statistic/promotion/distribution", {
          params: {
            promotionId: promotionId,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("response :>> ", response);
            commit("setChannelVoucher", response.data.channelStat);
            commit("setStoreVoucher", response.data.storeStat);
          }
        })
        .catch((error) => {
          console.log("promotion_detail :>> ", error);
        });
    },
    async getPromotionTier({ commit }) {
      let id = this.state.promotion_detail.promotionId;
      await axios
        .get(API_URL + "api/promotions/" + id + "/promotion-tier-detail")
        .then((response) => {
          commit("setPromotionTier", response.data);
        });
      // .catch((error) => {
      //   console.log(error);
      // });
    },
    async getPromotionInfo({ commit }) {
      let id = this.state.promotion_detail.promotionId;
      return await axios
        .get(API_URL + "api/promotions/" + id)
        .then((response) => {
          if (response.status == 200) {
            commit("setPromotionDetail", response.data);
          }
          return response;
        })
        .catch((error) => {
          throw error;
        });
    },
    async activeVoucherGroup() {
      let param = this.state.promotion_detail.promotionDetail.voucherGroup;
      let id = this.state.promotion_detail.promotionDetail.voucherGroup
        .voucherGroupId;
      await axios
        .put(API_URL + "api/voucher-groups/" + id, param)
        .then((response) => {
          if (response.status != 200) {
            throw "Update error";
          }
        });
    },
    async createPromotionTier() {
      let params = this.state.promotion_detail.createPromotionTierParam;
      let id = params.promotionId;
      await axios
        .post(API_URL + "api/promotions/" + id + "/create-tier", params)
        .then((response) => {
          if (response.status != 200) {
            throw "Create error";
          }
        });
    },
    async createDependTier() {
      let params = this.state.promotion_detail.createPromotionTierParam;
      await axios
        .post(API_URL + "api/promotions/create-tier", params)
        .then((response) => {
          if (response.status != 200) {
            throw "Create error";
          }
        });
    },
    async updatePromotionTier() {
      let params = this.state.promotion_detail.updatePromotionTierParam;
      let id = params.promotionTierId;
      return await axios
        .put(API_URL + "api/promotion-tiers/" + id, params)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async deletePromotionTier() {
      let tierId = this.state.promotion_detail.deleteTierId;
      return await axios
        .delete(API_URL + "api/promotion-tiers/" + tierId)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async deleteVoucherGroup({ dispatch }) {
      let promotionId = this.state.promotion_detail.promotionId;
      let id = this.state.promotion_detail.voucherGroupId;
      await axios
        .delete(API_URL + "api/voucher-groups", {
          params: {
            voucherGroupId: id,
            promotionId: promotionId,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            dispatch("getPromotionInfo");
          } else {
            throw "Delete failed";
          }
        });
    },
    async updatePromotionDetail() {
      let param = this.state.promotion_detail.promotionDetailUpdate;
      let id = this.state.promotion_detail.promotionDetail.promotionId;
      param.promotionId = id;
      return await axios
        .put(API_URL + "api/promotions/" + id, param)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw error;
        });
    },
    async getStoreOfPromotion({ commit }) {
      let id = this.state.promotion_detail.promotionId;
      let brandId = this.state.promotion_detail.brandId;
      await axios
        .get(API_URL + "api/stores/promotion/" + id, {
          params: {
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            let result = response.data;
            console.log("getStoreOfPromotion :>> ", result);
            commit("setStoreOfPromo", result);
          }
        });
    },
    async getChannelOfPromotion({ commit }) {
      let id = this.state.promotion_detail.promotionId;
      let brandId = this.state.promotion_detail.brandId;
      await axios
        .get(API_URL + "api/channels/promotion/" + id, {
          params: {
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            commit("setChannelOfPromo", response.data);
          }
        });
    },
    async updateChannelOfPromotion({ commit }) {
      let id = this.state.promotion_detail.promotionId;
      let brandId = this.state.promotion_detail.brandId;
      let body = this.state.promotion_detail.updateChannel;
      body.promotionId = id;
      body.brandId = brandId;
      return await axios
        .put(API_URL + "api/channels/promotion/" + id, body)
        .then((response) => {
          if (response.status == 200) {
            commit("setChannelOfPromo", response.data);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async updateStoreOfPromotion({ commit }) {
      let id = this.state.promotion_detail.promotionId;
      let brandId = this.state.promotion_detail.brandId;
      let body = this.state.promotion_detail.updateStore;
      body.promotionId = id;
      body.brandId = brandId;
      await axios
        .put(API_URL + "api/stores/promotion/" + id, body)
        .then((response) => {
          if (response.status == 200) {
            commit("setStoreOfPromo", response.data);
          }
        });
    },
    async checkChannelOfVoucher({ commit }) {
      let pageSize = this.state.promotion_detail.checkChannelPageSize;
      let pageIndex = this.state.promotion_detail.checkChannelPageIndex;
      let channelId = this.state.promotion_detail.checkChannelId;
      let promotionId = this.state.promotion_detail.promotionId;
      return await axios
        .get(API_URL + "api/vouchers", {
          params: {
            PageSize: pageSize,
            PageIndex: pageIndex,
            ChannelId: channelId,
            PromotionId: promotionId,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setCheckChannelVoucher", result.data["data"]);
            commit(
              "setCheckChannelCounter",
              result.data["metadata"].totalItems
            );
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async checkStoreOfVoucher({ commit }) {
      let pageSize = this.state.promotion_detail.checkStorePageSize;
      let pageIndex = this.state.promotion_detail.checkStorePageIndex;
      let storeId = this.state.promotion_detail.checkStoreId;
      let promotionId = this.state.promotion_detail.promotionId;
      return await axios
        .get(API_URL + "api/vouchers", {
          params: {
            PageSize: pageSize,
            PageIndex: pageIndex,
            StoreId: storeId,
            PromotionId: promotionId,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setCheckStoreVoucher", result.data["data"]);
            commit("setCheckStoreCounter", result.data["metadata"].totalItems);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
