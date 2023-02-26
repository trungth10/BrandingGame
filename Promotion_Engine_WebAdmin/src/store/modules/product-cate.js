import axios from "axios";
import { API_URL } from "../API_KEY";

export const product_cate = {
  namespaced: true,
  state: {
    brandId: '',
    productCateList: [],
    productCateSelectList: [],
    productCateIdList: [],
    productCateId: '',
    cateId: '',
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    updateParams: [],
    hideParams: [],
    name: '',
    isDuplicate: false,
  },
  mutations: {
    setBrandId(state, context) {
      state.brandId = context;
    },
    setProductCateList(state, context) {
      state.productCateList = context;
      console.log('productCateList :>> ', state.productCateList);
    },
    setProductCateIdList(state, context) {
      state.productCateIdList = context;
      console.log('productCateIdList :>> ', state.productCateIdList);
    },
    setIsDuplicate(state, context) {
      state.isDuplicate = context;
    },
    setCateId(state, context) {
      state.cateId = context;
    },
    setProductCateId(state, context) {
      state.productCateId = context;
    },
    setProductCateSelectList(state, context) {
      state.productCateSelectList = context;
      console.log('productCateList for select :>> ', state.productCateSelectList);
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setUpdateParams(state, context) {
      state.updateParams = context;
    },
    setName(state, context) {
      state.name = context;
    },
    setHideParams(state, context) {
      state.hideParams = context;
      console.log("hideParams :>> ", state.hideParams);
    }
  },
  actions: {
    async checkDuplicate({ commit }) {
      await axios
        .get(API_URL + "api/product-category/exist", {
          params: {
            BrandId: this.state.product_cate.brandId,
            CateId: this.state.product_cate.cateId,
            ProductCateId: this.state.product_cate.productCateId,
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
          console.log('product-cate.js - checkDuplicate:>> ' + error);
        });
    },
    async getProductCate({ commit }) {
      let PageSize = this.state.product_cate.PageSize;
      let PageIndex = this.state.product_cate.PageIndex;
      let brandId = this.state.product_cate.brandId;

      //# get with PageSize, PageIndex
      await axios
        .get(API_URL + "api/product-category", {
          params: {
            PageSize: PageSize,
            PageIndex: PageIndex,
            brandId: brandId,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data.data;
            let outcome = response.data.metadata;
            commit("setProductCateList", result);
            commit("setCounter", outcome.totalItems);
          } else {
            console.log("product.js: getProduct FAILED!");
          }
        })
        .catch((error) => {
          console.log('product-cate.js - getProductCate:>> ' + error);
        })

      //# get all product cate
      await axios
        .get(API_URL + "api/product-category", {
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
              codes.push(result.cateId);
            }
            commit("setProductCateSelectList", results);
            commit("setProductCateIdList", codes);
          } else {
            console.log("product-cate.js: getProductCateAll FAIL ");
          }
        })
        .catch((error) => {
          console.log('product-cate.js - getProductCate:>> ' + error);
        })
    },
    async saveProdCate() {
      console.log('saveProdCate trigger!');
      let params = this.state.product_cate.updateParams;
      for (const param of params) {
        let reqParam = {
          cateId: param.cateId,
          name: param.name,
          productCateId: param.productCateId,
        };
        let id = param.productCateId;

        await axios
          .put(API_URL + "api/product-category/" + id, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("product-cate.js: Save SUCCESS");
              console.log('response.date :>> ', response.data);
            } else {
              console.log("product-cate.js: Save FAIL ");
            }
          })
          .catch((error) => {
            console.log('product-cate.js - saveProdCate:>> ' + error);
          })
      }
    },
    async addProdCate({ commit }) {
      let reqParam = {
        brandId: this.state.product_cate.brandId,
        cateId: this.state.product_cate.cateId,
        name: this.state.product_cate.name,
      };
      await axios
        .post(API_URL + "api/product-category", reqParam)
        .then((response) => {
          if (response.status == 200) {
            commit("setPageIndex", 1);
            console.log("product-cate.js: Save SUCCESS");
            console.log('response.date :>> ', response.data);
          } else {
            console.log("product-cate.js: Save FAIL ");
          }
        })
        .catch((error) => {
          console.log('product-cate.js - addProdCate:>> ' + error);
        })
    },
    async hideProdCate() {
      let params = this.state.product_cate.hideParams;
      for (const param of params) {
        let reqParam = {
          productCateId: param.productCateId,
          delFlg: true,
        };
        console.log('reqParam :>> ', reqParam);
        await axios
          .put(API_URL + "api/product-category/" + param.productCateId, reqParam)
          .then((response) => {
            if (response.status == 200) {
              console.log("product-cate.js: Delete SUCCESS");
            } else {
              console.log("product-cate.js: Delete FAIL ");
              console.log(response.data);
            }
          })
          .catch((error) => {
            console.log('product-cate.js - hideProdCate:>> ' + error);
          });
      }
    },
  },
};
