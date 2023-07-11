import "es6-promise/auto";
import axios from "axios";
import { API_URL } from "../API_KEY";

export const gift = {
  namespaced: true,
  state: {
    insertPostAction: {},
    brandId: "",
    giftList: [],
  },
  mutations: {
    setPostActionList(state, context) {
      state.giftList = context;
    },
    setInsertPostAction(state, context) {
      state.insertAction = context;
    },

    setBrandId(state, context) {
      state.brandId = context;
    },
  },
  actions: {
    async getPostActionList({ commit }) {
      let brandId = this.state.gift.brandId;
      return await axios
        .get(API_URL + "api/post-actions", {
          params: {
            brandId: brandId,
            PageSize: 0,
            PageIndex: 0,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setPostActionList", result.data["data"]);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async insertPostAction() {
      let brandId = this.state.gift.brandId;
      let action = this.state.gift.insertAction;
      action.brandId = brandId;
      console.log(action);
      return await axios
        .post(API_URL + "api/post-actions", action)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
