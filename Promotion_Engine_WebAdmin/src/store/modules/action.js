import "es6-promise/auto";
import axios from "axios";
import { API_URL } from "../API_KEY";

export const action = {
  namespaced: true,
  state: {
    insertAction: {},
    updAction: {},
    brandId: "",
    PageSizeAction: 10,
    PageIndexAction: 1,
    counteraction: 0,
    PageSizePost: 10,
    PageIndexPost: 1,
    counterpost: 0,
    actionRequestParam: {},
    actionType: 0,
    actionList: [],
    actionId: "",
    actionParam: {},
    id: "",
    postActionType: 0,
    giftList: [],
    conditionRules: [
      {
        membershipCondition: [],
        orderCondition: [],
        productCondition: [],
      },
    ],
    productTypes: [
      {
        id: "1",
        type: "Single products",
      },
      {
        id: "2",
        type: "Collection",
      },
      {
        id: "3",
        type: "Category",
      },
      {
        id: "4",
        type: "Tag",
      },
      {
        id: "5",
        type: "General",
      },
      {
        id: "6",
        type: "Combo",
      },
      {
        id: "7",
        type: "Complex",
      },
      {
        id: "8",
        type: "Extra",
      },
    ],
    // condition request param
    condition: {
      conditionRule: {
        brandId: "",
        ruleName: "",
        description: "",
        groupNo: 0,
      },
      productConditions: [],
      orderConditions: [],
      membershipConditions: [],
      giftParam: {},
      giftId: "",
      updGift: {},
    },
  },
  mutations: {
    setGiftId(state, context) {
      state.giftId = context;
    },
    setUpdGift(state, context) {
      state.updGift = context;
    },
    setUpdAction(state, context) {
      state.updAction = context;
    },
    setActionParam(state, context) {
      console.log(context);
      let listProduct = Array.from(context.listProduct);
      let listProductMapp = Array.from(context.listProductMapp);
      context.listProduct = listProduct;
      context.listProductMapp = listProductMapp;
      state.actionParam = context;
    },
    setGiftParam(state, context) {
      state.giftParam = context;
    },
    setNewActionType(state, context) {
      state.actionType = context;
    },
    setId(state, context) {
      state.id = context;
    },
    setActionList(state, context) {
      state.actionList = context;
    },

    setPostActionList(state, context) {
      state.giftList = context;
    },
    setPostActionType(state, context) {
      state.postActionType = context;
    },
    setInsertAction(state, context) {
      state.insertAction = context;
    },
    setConditionRules(state, context) {
      state.conditionRules = context;
    },
    addProductConditionToRequestParam(state, context) {
      state.condition.productConditions.push(context);
    },
    addOrderConditionToRequestParam(state, context) {
      state.condition.orderConditions.push(context);
    },
    addMembershipConditionToRequestParam(state, context) {
      state.condition.membershipConditions.push(context);
    },
    clearRequestParam(state) {
      state.condition.productConditions = [];
      state.condition.orderConditions = [];
      state.condition.membershipConditions = [];
    },
    setConditionRule(state, context) {
      state.condition.conditionRule = context;
    },

    setBrandId(state, context) {
      state.brandId = context;
      console.log("state.brandId :>> ", state.brandId);
    },
    setPageIndexAction(state, context) {
      state.PageIndexAction = context;
    },
    setPageSizeAction(state, context) {
      state.PageSizeAction = context;
    },
    setCounterAction(state, context) {
      state.counteraction = context;
    },
    setPageIndexPost(state, context) {
      state.PageIndexPost = context;
    },
    setPageSizePost(state, context) {
      state.PageSizePost = context;
    },
    setCounterPost(state, context) {
      state.counterpost = context;
    },
  },
  actions: {
    async insertAction() {
      let brandId = this.state.action.brandId;
      let action = this.state.action.insertAction;
      action.brandId = brandId;
      console.log(action);
      return await axios
        .post(API_URL + "api/actions", action)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getAvailableRules({ commit }) {
      let brandId = this.state.action.brandId;
      let available = true;
      await axios
        .get(API_URL + "api/condition-rules", {
          params: {
            BrandId: brandId,
            available: available,
          },
        })
        .then(
          (response) => {
            console.log(response.data["data"]);
            commit("setConditionRules", response.data["data"]);
          },
          (error) => {
            console.log(error);
          }
        );
    },
    async getAction({ commit }) {
      let brandId = this.state.action.brandId;
      let PageSize = this.state.action.PageSizeAction;
      let PageIndex = this.state.action.PageIndexAction;
      let ActionType = this.state.action.actionType;
      return await axios
        .get(API_URL + "api/actions", {
          params: {
            brandId: brandId,
            PageSize: PageSize,
            PageIndex: PageIndex,
            ActionType: ActionType,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            let results = response.data.data;
            let outcome = response.data.metadata;
            commit("setActionList", results);
            commit("setCounterAction", outcome.totalItems);
          } else {
            console.log(
              "action.js - getAction() failed with status :>> ",
              response.status
            );
          }
          return response;
        })
        .catch((error) => {
          console.log("action.js - getAction() :>> ", error);
          throw error;
        });
    },
    async getPostAction({ commit }) {
      let brandId = this.state.action.brandId;
      let PageSize = this.state.action.PageSizePost;
      let PageIndex = this.state.action.setPageIndexPost;
      let postActionType = this.state.action.postActionType;
      return await axios
        .get(API_URL + "api/post-actions", {
          params: {
            brandId: brandId,
            PageSize: PageSize,
            PageIndex: PageIndex,
            PostActionType: postActionType,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            let results = response.data.data;
            let outcome = response.data.metadata;
            console.log("results :>> ", results);
            commit("setPostActionList", results);
            commit("setCounterPost", outcome.totalItems);
          } else {
            console.log(
              "action.js - getPostAction() failed with status :>> ",
              response.status
            );
          }
          return response;
        })
        .catch((err) => {
          console.log("action.js - getPostAction() :>> ", err);
          throw err;
        });
    },
    async getActionDetail({ commit }) {
      let actionId = this.state.action.id;
      return await axios
        .get(API_URL + "api/actions/" + actionId)
        .then((response) => {
          let result = JSON.parse(JSON.stringify(response));
          if (result.status == 200) {
            commit("setActionParam", result.data);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async deleteAction() {
      let actionId = this.state.action.id;
      return await axios
        .delete(API_URL + "api/actions/" + actionId)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async deleteGift() {
      let giftId = this.state.action.giftId;
      return await axios
        .delete(API_URL + "api/post-actions/" + giftId)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getGiftDetail({ commit }) {
      let giftId = this.state.action.giftId;
      return await axios
        .get(API_URL + "api/post-actions/" + giftId)
        .then((response) => {
          if (response.status == 200) {
            commit("setGiftParam", response.data);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async updateAction() {
      let actionId = this.state.action.id;
      let updAction = this.state.action.updAction;
      return await axios
        .put(API_URL + "api/actions/" + actionId, updAction)
        .then((response) => {
          if (response.status == 200) {
            console.log("update success!");
            console.log("response.data :>> ", response.data);
          } else {
            console.log(
              "action.js - updateAction() failed with status :>> ",
              response.status
            );
          }
          return response;
        })
        .catch((err) => {
          console.log("action.js - updateAction() :>> ", err);
          throw err;
        });
    },
    async updateGift() {
      let updGift = this.state.action.updGift;
      let giftId = updGift.giftId;
      return await axios
        .put(API_URL + "api/post-actions/" + giftId, updGift)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
