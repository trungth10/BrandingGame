import axios from "axios";
import { API_URL } from "../API_KEY";

export const member_level = {
  namespaced: true,
  state: {
    brandId: '',
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    memberLevelList: [],
    name: '',
    hideParams: [],
    updateParams: [],
  },
  mutations: {
    setBrandId(state, context) {
      state.brandId = context;
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setName(state, context) {
      state.name = context;
    },
    setHideParams(state, context) {
      state.hideParams = context;
    },
    setMemberLevelList(state, context) {
      state.memberLevelList = context;
      console.log('memberLevelList :>> ', state.memberLevelList);
    },
    setUpdateParams(state, context) {
      state.updateParams = context;
    },
  },
  actions: {
    async getMemberLevel({ commit }) {
      let PageSize = this.state.member_level.PageSize;
      let PageIndex = this.state.member_level.PageIndex;
      let brandId = this.state.member_level.brandId;
      await axios
        .get(API_URL + "api/member-level", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            brandId: brandId,
          },
        })
        .then((response) => {
          let result = response.data.data;
          let outcome = response.data.metadata;
          commit("setMemberLevelList", result);
          commit("setCounter", outcome.totalItems);
        })
        .catch((error) => {
          console.log('member-level.js - getMemberLevel:>> ' + error);
        })
    },

    async addMemLv({commit}) {
      let reqParam = {
        brandId: this.state.member_level.brandId,
        name: this.state.member_level.name,
      };
      await axios
        .post(API_URL + "api/member-level", reqParam)
        .then((response) => {
          if (response.status == 200) {
            commit("setPageIndex", 1);
            console.log("member-level.js: Save SUCCESS");
            console.log('response.date :>> ', response.data);
          } else {
            console.log("member-level.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log('member-level.js - addMemLv:>> ' + error);
        })
    },

    async saveMemLv() {
      console.log('saveMemLv trigger!');
      let params = this.state.member_level.updateParams;
      for (const param of params) {
        let reqParam = {
          memberLevelId: param.memberLevelId,
          name: param.name,
        };
        let id = param.memberLevelId;

        await axios
          .put(API_URL + "api/member-level/" + id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("member-level.js: Save SUCCESS");
              console.log('response.date :>> ', response.data);
            } else {
              console.log("member-level.js: Save FAIL ");
            }
          })
          .catch((error) => {
            console.log('member-level.js - saveMemLv:>> ' + error);
          })
      }
    },

    async hideMemLv() {
      let params = this.state.member_level.hideParams;
      for (const param of params) {
        let reqParam = {
          memberLevelId: param.memberLevelId,
          delFlg: true,
        };
        console.log('reqParam :>> ', reqParam);
        await axios
          .put(API_URL + "api/member-level/" + param.memberLevelId, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("member-level.js: Delete SUCCESS");
            } else {
              console.log("member-level.js: Delete FAIL ");
              console.log(response.data);
            }
          })
          .catch((error) => {
            console.log('member-level.js - hideMemLv:>> ' + error);
          });
      }
    },
  },
};