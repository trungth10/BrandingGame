import axios from "axios";
import "es6-promise/auto";
import { API_URL } from "../API_KEY";

export const condition = {
  namespaced: true,
  state: {
    assignPromoId: "",
    assignTierId: "",
    conditionList: [],
    availPageSize: 10,
    availPageIndex: 1,
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    availCounter: 0,
    SearchContent: "",
    brandId: "",
    conditions: [],
    conditionRule: {
      brandId: "",
      ruleName: "",
      description: "",
    },
    conditionGroups: [],
    availableConditions: [],
    products: [],
    levels: [],
    deleteId: "",
    availActionType: "",
    availDiscountType: "",
    insertConditionDto: {},
    conditionForVoucher: [],
    detailId: "",
    conditionDetail: {},
    updateParam: {},
    updateId: "",
  },

  mutations: {
    setUpdateId(state, context) {
      state.updateId = context;
    },
    setUpdateParam(state, context) {
      state.updateParam = context;
    },
    setConditionDetail(state, context) {
      state.conditionDetail = context;
    },
    setDetailId(state, context) {
      state.detailId = context;
    },
    setInsertConditionDto(state, context) {
      state.insertConditionDto = context;
    },
    setDeleteId(state, context) {
      state.deleteId = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setConditionList(state, context) {
      state.conditionList = context;
    },
    setConditionRule(state, context) {
      state.conditionRule = context;
    },
    setConditions(state, context) {
      state.conditions = context;
    },
    addCondition(state, context) {
      state.conditions.push(context);
    },
    deleteCondition(state, context) {
      state.conditions.splice(context, 1);
    },
    setPromotionId(state, context) {
      state.promotionId = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setAvailCounter(state, context) {
      state.availCounter = context;
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setAvailPageIndex(state, context) {
      state.availPageIndex = context;
    },
    clearRequestParam(state) {
      state.requestParam.productConditions = [];
      state.requestParam.orderConditions = [];
      state.requestParam.membershipConditions = [];
    },
    addConditionGroup(state, context) {
      state.conditionGroups.push(context);
    },
    setConditionGroup(state, context) {
      state.conditionGroups = context;
    },
    clearConditionGroups(state) {
      state.conditionGroups = [];
    },
    clearConditionRule(state) {
      state.conditionRule = {
        brandId: "",
        ruleName: "",
        description: "",
      };
    },
    setAvailableConditions(state, context) {
      state.availableConditions = context;
    },
    setBrandProduct(state, context) {
      state.products = context;
    },
    setBrandLevel(state, context) {
      state.levels = context;
    },
    setAvailActionType(state, context) {
      state.availActionType = context;
    },
    setAvailDiscountType(state, context) {
      state.availDiscountType = context;
    },
    setAssignPromoId(state, context) {
      state.assignPromoId = context;
    },
    setAssignTierId(state, context) {
      state.assignTierId = context;
    },
    setConditionForVoucher(state, context) {
      state.conditionForVoucher = context;
    },
  },
  actions: {
    async updateCondition() {
      let params = this.state.condition.updateParam;
      let id = this.state.condition.updateId;
      return await axios
        .put(API_URL + "api/condition-rules/" + id, params)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getConditionDetail({ commit }) {
      let id = this.state.condition.detailId;
      return await axios
        .get(API_URL + "api/condition-rules/" + id)
        .then((result) => {
          commit("setConditionDetail", result.data);
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getConditionForGame({ commit }) {
      let brandId = this.state.condition.brandId;
      return await axios
        .get(API_URL + "api/condition-rules/for-voucher/" + brandId)
        .then((result) => {
          commit("setConditionForVoucher", result.data["data"]);
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async insertConditionRule() {
      let dto = this.state.condition.insertConditionDto;
      return await axios
        .post(API_URL + "api/condition-rules", dto)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async assignPromo() {
      let promotionId = this.state.condition.assignPromoId;
      let promotionTierId = this.state.condition.assignTierId;
      return await axios
        .put(API_URL + "api/promotion-tiers/assign", null, {
          params: {
            promotionId: promotionId,
            promotionTierId: promotionTierId,
          },
        })
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async deleteRule() {
      let id = this.state.condition.deleteId;
      return await axios
        .delete(API_URL + "api/condition-rules/" + id)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async createCondition() {
      await axios
        .post(
          API_URL + "api/condition-rules",
          this.state.condition.requestParam
        )
        .then((response) => {
          if (response.status != 200) {
            throw "Create failed";
          }
        });
    },
    async getConditionList({ commit }) {
      let PageSize = this.state.condition.PageSize;
      let PageIndex = this.state.condition.PageIndex;
      let BrandId = this.state.condition.brandId;
      return await axios
        .get(API_URL + "api/condition-rules", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            BrandId: BrandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            let outcome = result.metadata;
            commit("setConditionList", result);
            commit("setCounter", outcome.totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getAvailableConditions({ commit }) {
      let PageSize = this.state.condition.availPageSize;
      let PageIndex = this.state.condition.availPageIndex;
      let BrandId = this.state.condition.brandId;
      let actionType = this.state.condition.availActionType;
      // let actionType = "1";
      let discountType = this.state.condition.availDiscountType;
      // let discountType = "1";
      return await axios
        .get(API_URL + "api/promotion-tiers/available", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            brandId: BrandId,
            actionType: actionType,
            discountType: discountType,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            let outcome = result.metadata;
            commit("setAvailableConditions", result["data"]);
            commit("setAvailCounter", outcome.totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getBrandProduct({ commit }) {
      let brandId = this.state.condition.brandId;
      return await axios
        .get(API_URL + "api/product/brand/all/" + brandId)
        .then((response) => {
          if (response.status === 200) {
            commit("setBrandProduct", response.data);
          } else {
            throw "Something went wrong, please try again";
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getBrandLevel({ commit }) {
      let brandId = this.state.condition.brandId;
      return await axios
        .get(API_URL + "api/member-level", {
          params: {
            brandId: brandId,
            PageSize: 0,
            PageIndex: 0,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            commit("setBrandLevel", response.data["data"]);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
