import axios from "axios";
import { API_URL } from "../API_KEY";

export const product = {
  namespaced: true,
  state: {
    productList: [],
    productCodeList: [],
    productCode: '',
    productId: '',
    brandId: '',
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    updateParams: [],
    hideParams: [],
    cateId: '',
    productName: '',
    code: '',
    productCateId: '',
    isDuplicate: false,
  },
  mutations: {
    setBrandId(state, context) {
      state.brandId = context;
    },
    setProductList(state, context) {
      state.productList = context;
      console.log('productList :>> ', state.productList);
    },
    setProductCodeList(state, context) {
      state.productCodeList = context;
      console.log('productCodeList :>> ', this.state.product.productCodeList);
    },
    setIsDuplicate(state, context) {
      state.isDuplicate = context;
    },
    setProductCode(state, context) {
      state.productCode = context;
    },
    setProductId(state, context) {
      state.productId = context;
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setUpdateParams(state, context) {
      state.updateParams = context;
      console.log('updateParams :>> ', state.updateParams);
    },
    setCateId(state, context) {
      state.cateId = context;
    },
    setProductName(state, context) {
      state.productName = context;
    },
    setCode(state, context) {
      state.code = context;
    },
    setProductCateId(state, context) {
      state.productCateId = context;
    },
    setHideParams(state, context) {
      state.hideParams = context;
      console.log("hideParams :>> ", state.hideParams);
    }
  },
  actions: {
    async checkDuplicate({ commit }) {
      await axios
        .get(API_URL + "api/product/exist", {
          params: {
            BrandId: this.state.product.brandId,
            ProductCode: this.state.product.productCode,
            ProductId: this.state.product.productId,
          }
        })
        .then((response) => {
          if (response.status === 200) {
            commit("setIsDuplicate", response.data);
          } else {
            console.log("Check duplicate FAILED!");
          }
        })
        .catch((error) => {
          console.log('product.js - checkDuplicate:>> ' + error);
        });
    },
    async getProduct({ commit }) {
      let PageSize = this.state.product.PageSize;
      let PageIndex = this.state.product.PageIndex;
      let brandId = this.state.product.brandId;
      await axios
        .get(API_URL + "api/product/brand", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let results = response.data.data;
            let outcome = response.data.metadata;
            commit("setProductList", results);
            commit("setCounter", outcome.totalItems);
          } else {
            console.log("product.js: getProduct FAILED!");
          }
        })
        .catch((error) => {
          console.log('product.js - getProduct:>> ' + error);
        })
      await axios
        .get(API_URL + "api/product/brand", {
          params: {
            PageSize: 0,
            PageIndex: 0,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let results = response.data.data;
            let codes = [];
            for (const result of results) {
              codes.push(result.code);
            }
            commit("setProductCodeList", codes);
          } else {
            console.log("product.js: getProductCode FAIL ");
          }
        })
        .catch((error) => {
          console.log('product.js - getProduct:>> ' + error);
        })
    },
    async saveProd() {
      console.log('saveProd trigger!');
      let params = this.state.product.updateParams;
      for (const param of params) {
        let reqParam = {
          code: param.code,
          name: param.name,
          productCateId: param.productCateId,
          productId: param.productId,
        };
        console.log('reqParam :>> ', reqParam);
        let id = param.productId;
        await axios
          .put(API_URL + "api/product/" + id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("product.js: Save SUCCESS");
              console.log('response.date :>> ', response.data);
            } else {
              console.log("product.js: Save FAIL ");
            }
          })
          .catch((error) => {
            console.log('product.js - saveProd:>> ' + error);
          })
      }
    },
    async addProd({ commit }) {
      let reqParam = {
        brandId: this.state.product.brandId,
        productCateId: this.state.product.productCateId,
        name: this.state.product.productName,
        code: this.state.product.code,
      };
      console.log('reqParam :>> ', reqParam);
      await axios
        .post(API_URL + "api/product", reqParam)
        .then((response) => {
          if (response.status == 200) {
            commit("setPageIndex", 1);
            console.log("product.js: Save SUCCESS");
            console.log('response.date :>> ', response.data);
          } else {
            console.log("product.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log('product.js - addProd:>> ' + error);
        })
    },
    async hideProd() {
      let params = this.state.product.hideParams;
      for (const param of params) {
        let reqParam = {
          productId: param.productId,
          delFlg: true,
        };
        console.log('reqParam :>> ', reqParam);
        await axios
          .put(API_URL + "api/product/" + param.productId, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("product.js: Delete SUCCESS");
            } else {
              console.log("product.js: Delete FAIL ");
              console.log(response.data);
            }
          })
          .catch((error) => {
            console.log('product.js - hideProd:>> ' + error);
          });
      }
    },
  },
};
