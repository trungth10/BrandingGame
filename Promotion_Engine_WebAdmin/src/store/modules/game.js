import axios from "axios";
import { API_URL } from "../API_KEY";

export const game = {
  namespaced: true,
  state: {
    gameList: [],
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    updateParams: [],
    hideParams: [],
    newGame: {},
    gameId: "",
  },
  mutations: {
    setGameList(state, context) {
      state.gameList = context;
      console.log("gameList :>> ", state.gameList);
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
    setNewGame(state, context) {
      state.newGame = context;
    },
    setHideParams(state, context) {
      state.hideParams = context;
    },
  },
  actions: {
    async getGame({ commit }) {
      let PageSize = this.state.game.PageSize;
      let PageIndex = this.state.game.PageIndex;
      await axios
        .get(API_URL + "api/game-master/", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            let result = response.data.data;
            let outcome = response.data.metadata;
            commit("setGameList", result);
            commit("setCounter", outcome.totalItems);
          } else {
            console.log("game.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log("game.js " + error);
        });
    },
    async saveGame() {
      let params = this.state.game.updateParams;
      for (const param of params) {
        let reqParam = {
          id: param.id,
          name: param.name,
          minItem: param.minItem,
          maxItem: param.maxItem,
        };
        console.log("reqParam :>> ", reqParam);
        let id = param.id;
        await axios
          .put(API_URL + "api/game-master/" + id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("game.js: Save SUCCESS");
              console.log("response.date :>> ", response.data);
            } else {
              console.log("game.js: Save FAIL ");
            }
          })
          .catch((error) => {
            console.log("game.js - saveDev:>> " + error);
          });
      }
    },
    async addGame() {
      let reqParam = {
        name: this.state.game.newGame.name,
        minItem: this.state.game.newGame.minItem,
        maxItem: this.state.game.newGame.maxItem,
      };
      console.log("reqParam :>> ", reqParam);
      await axios
        .post(API_URL + "api/game-master", reqParam)
        .then((response) => {
          if (response.status == 200) {
            console.log("game.js: Save SUCCESS");
            console.log("response.date :>> ", response.data);
          } else {
            console.log("game.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log("game.js - addDev:>> " + error);
        });
    },
    async hideGame() {
      let params = this.state.game.hideParams;
      console.log("Cái param để xóa nó ở đâu :>> ", params);
      for (const param of params) {
        let reqParam = {
          id: param.id,
          delFlg: true,
        };
        console.log("reqParam :>> ", reqParam);
        await axios
          .put(API_URL + "api/game-master/" + param.id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("game.js: Delete SUCCESS");
            } else {
              console.log("game.js: Delete FAIL ");
              console.log(response.data);
            }
          })
          .catch((error) => {
            console.log("game.js - hideDev:>> " + error);
          });
      }
    },
  },
};
