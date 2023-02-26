import axios from "axios";
import { API_URL } from "../API_KEY";

export const profile = {
  namespaced: true,
  state: {
    profile: {},
    userName: "",
    newImage: "",
    brandId: "",
  },
  mutations: {
    setProfile(state, context) {
      state.profile = context;
    },
    setNewImg(state, context) {
      state.newImage = context;
    },
    setUsername(state, context) {
      let session = JSON.parse(sessionStorage.getItem("vue-session-key"));
      console.log(session)
      if (session) {
        let user = session["user-info"];
        if (user) {
          let token = user.token;
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
      }
      state.userName = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
  },
  actions: {
    async getProfile({ commit }) {
      let brandId = this.state.profile.brandId;
      await axios
        .get(API_URL + "api/brands/" + brandId)
        .then((response) => {
          let result = response.data;
          commit("setProfile", result);
        })
        .catch((error) => {
          console.log("profile.js " + error);
        });
    },
    async saveProfile({ commit }) {
      let params = this.state.profile.profile;
      let brandId = this.state.profile.brandId;
      await axios
        .put(API_URL + "api/brands/" + brandId, params)
        .then((response) => {
          let result = response.data;
          commit("setProfile", result);
        })
        .catch((error) => {
          console.log("profile.js " + error);
        });
    },
    async saveProfileImage({ commit }) {
      let img = this.state.profile.newImage;
      let brandId = this.state.dashboard.brandId;
      let params = {
        brandId: brandId,
        imgUrl: img,
      };
      await axios
        .put(API_URL + "api/brands/" + brandId, params)
        .then((response) => {
          let result = response.data;
          commit("setProfile", result);
        })
        .catch((error) => {
          console.log("profile.js " + error);
        });
    },
  },
};
