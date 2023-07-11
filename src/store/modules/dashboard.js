import axios from "axios";
import { API_URL } from "../API_KEY";

export const dashboard = {
  namespaced: true,
  state: {
    promotionList: [
      {
        promotionTier: [],
        voucherGroup: [
          {
            voucherName: "",
          },
        ],
      },
    ],
    counter: 0,
    PageSize: 10,
    PageIndex: 1,
    SearchContent: "",
    promotionStatus: 0,
    countByStatus: {
      totalPromotion: 0,
      publishPromotion: 0,
      expiredPromotion: 0,
      draftPromotion: 0,
    },
    brandId: "",
    promotionPreviewId: "",
    promotionPreview: {},
    promotionDetail: {
      promotionTier: [],
      voucherGroup: [
        {
          voucherName: "",
        },
      ],
    },
    promoSearchStatus: 0,
  },
  getters: {
    PromotionList: (state) => state.promotionList,
    PageSize: (state) => state.PageSize,
    PageIndex: (state) => state.PageIndex,
  },
  mutations: {
    setPromotionList(state, context) {
      state.promotionList = context;
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setSearchContent(state, context) {
      state.SearchContent = context;
    },
    setSearchStatus(state, context) {
      state.promoSearchStatus = context;
    },
    setPromotionStatus(state, context) {
      state.promotionStatus = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setCountByStatus(state, context) {
      state.countByStatus = context;
      console.log("state.countByStatus :>> ", state.countByStatus);
    },
    setTotalPromotion(state, context) {
      state.countByStatus.totalPromotion = context;
    },
    setPublishPromotion(state, context) {
      state.countByStatus.publishPromotion = context;
    },
    setExpiredPromotion(state, context) {
      state.countByStatus.expiredPromotion = context;
    },
    setDraftPromotion(state, context) {
      state.countByStatus.draftPromotion = context;
    },
    setPromotionPreview(state, context) {
      state.promotionPreview = context;
    },
    setPromotionId(state, context) {
      state.promotionPreviewId = context;
    },
    setPromotionDetail(state, context) {
      state.promotionDetail = context;
    },
  },
  actions: {
    async countPromotion({ commit }) {
      let BrandId = this.state.dashboard.brandId;
      await axios
        .get(API_URL + "api/promotions/count", {
          params: {
            BrandId: BrandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setCounter", result);
          }
        })
        .catch((err) => {
          console.log("count promotion err");
          console.log(err);
        });
    },
    async countByStatus({ commit }) {
      let BrandId = this.state.dashboard.brandId;
      //# Count Promotion: toal, publish, expired, draft
      await axios
        .get(API_URL + "api/statistic/promotion/status/" + BrandId, { BrandId })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setTotalPromotion", result.total);
            commit("setPublishPromotion", result.publish);
            commit("setExpiredPromotion", result.expired);
            commit("setDraftPromotion", result.draft);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async getPromotionList({ commit }) {
      console.log(this.state.dashboard.brandId);
      let PageSize = this.state.dashboard.PageSize;
      let PageIndex = this.state.dashboard.PageIndex;
      let BrandId = this.state.dashboard.brandId;
      let status = this.state.dashboard.promotionStatus;
      await axios
        .get(API_URL + "api/promotions", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            BrandId: BrandId,
            status: status,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setPromotionList", result.data);
          }
        });
    },
    async countSearchPromotion({ commit }) {
      
      console.log("countSearchPromotion triggered");
      let PageSize = this.state.dashboard.PageSize;
      let PageIndex = this.state.dashboard.PageIndex;
      let SearchContent = this.state.dashboard.SearchContent;
      let BrandId = this.state.dashboard.brandId;
      await axios
        .get(API_URL + "api/promotions/countSearch", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            SearchContent: SearchContent,
            BrandId: BrandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setCounter", result);
          }
        });
    },
    async searchPromotion({ commit }) {
      let PageSize = this.state.dashboard.PageSize;
      let PageIndex = this.state.dashboard.PageIndex;
      let SearchContent = this.state.dashboard.SearchContent;
      let BrandId = this.state.dashboard.brandId;
      let Status = this.state.dashboard.promoSearchStatus;
      return await axios
        .get(API_URL + "api/promotions/search", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            SearchContent: SearchContent == "" ? null : SearchContent,
            BrandId: BrandId,
            Status: Status,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setPromotionList", result["data"]);
            commit("setCounter", result["metadata"].totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getPromotionPreview({ commit }) {
      let id = this.state.dashboard.promotionPreviewId;
      await axios.get(API_URL + "api/promotions/" + id).then((response) => {
        if (response.status === 200) {
          let result = response.data;
          commit("setPromotionPreview", result);
        }
      });
    },
    async getPromotionDetail({ commit }) {
      let id = this.state.dashboard.promotionPreviewId;
      let BrandId = this.state.dashboard.brandId;
      let status = this.state.dashboard.promotionStatus;
      await axios
        .get(API_URL + "api/promotions", {
          params: {
            PageSize: 0,
            PageIndex: 0,
            status: status,
            BrandId: BrandId,
            promotionId: id,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            commit("setPromotionDetail", result["data"][0]);
          }
        });
    },
  },
};
