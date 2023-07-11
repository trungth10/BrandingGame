import axios from "axios";
import { API_URL } from "../API_KEY";
import AuthService from "../services/auth-service";

export const account = {
  namespaced: true,
  state: {
    userProfile: {
      brand: {},
    },
    username: "",
    isUserNameExist: false,
    isEmailExist: false,
    isPhoneExist: false,
    loginForm: {},
    userInfo: {},
    error: null,
  },
  mutations: {
    setProfile(state, context) {
      state.userProfile = context;
    },
    setBrandProfile(state, context) {
      state.userProfile.brand = context;
    },
    setNewImg(state, context) {
      state.newImage = context;
    },
    setUsername(state, context) {
      state.username = context;
    },
    setUserNameExist(state, context) {
      state.isUserNameExist = context;
    },
    setEmailExist(state, context) {
      state.isEmailExist = context;
    },
    setPhoneExist(state, context) {
      state.isPhoneExist = context;
    },
    setLoginForm(state, context) {
      state.loginForm = context;
    },
    setUserInfo(state, context) {
      state.userInfo = context;
    },
    setError(state, context) {
      state.error = context;
    },
  },
  actions: {
    async checkUsernameExisiting({ commit }) {
      let params = { username: this.state.account.userProfile.username };
      await axios
        .post(API_URL + "api/accounts/checkUserExisting", params)
        .then((response) => {
          if (response.status == 200) {
            let result = response.data;
            commit("setUserNameExist", result);
          }
        })
        .catch((error) => {
          console.log("account.js " + error);
        });
    },
    async checkEmailExisiting({ commit }) {
      let params = { email: this.state.account.userProfile.email };
      await axios
        .post(API_URL + "api/accounts/checkEmailExisting", params)
        .then((response) => {
          let result = response.data;
          commit("setEmailExist", result);
        })
        .catch((error) => {
          console.log("account.js " + error);
        });
    },
    async checkPhoneExisiting({ commit }) {
      let params = { phoneNumber: this.state.account.userProfile.phoneNo };
      await axios
        .post(API_URL + "api/accounts/checkPhoneExisting", params)
        .then((response) => {
          let result = response.data;
          commit("setPhoneExist", result);
        })
        .catch((error) => {
          console.log("account.js " + error);
        });
    },
    async registerAccount() {
      let params = this.state.account.userProfile;
      console.log(params);
      await axios
        .post(API_URL + "api/accounts/register", params)
        .then((response) => {
          console.log(response.status);
        })
        .catch((error) => {
          console.log("account.js " + error);
        });
    },
    async login({ commit }) {
      let params = this.state.account.loginForm;
      let rersult = await AuthService.login(params).catch((e) => {
        console.log("account.js " + e);
      });
      if (rersult.status == 200) {
        commit("setUserInfo", rersult.data);
        commit("setError", null);
      } else {
        commit("setError", "Username or password are not correct");
      }
    },
  },
};
