import axios from "axios";
import { API_URL } from "../API_KEY";

export const voucher = {
  namespaced: true,
  state: {
    voucherList: [],
    PageSize: 10,
    PageIndex: 1,
    counter: 0,
    availPageSize: 10,
    availPageIndex: 1,
    availCounter: 0,
    availVouchers: [],
    assignVoucherId: "",
    assignPromoId: "",
    SearchContent: "",
    voucherType: "",
    brandId: "",
    voucherGroup: {},
    voucherForm: {},
    promotionId: "",
    voucherGroupId: "",
    vouchers: [],
    moreQuantity: 0,
    detailPageSize: 10,
    detailPageIndex: 1,
    detailCounter: 0,
    detailVoucher: [],
    detailPromoCode: "",
    indexInfo: {},
    checkIndexId: "",
    voucherGroupDetail: {},
    checkPageSize: 10,
    checkPageIndex: 1,
    checkCounter: 0,
    checkVouchers: [],
    actionType: 0,
    postActionType: 0,
    actionId: "",
    giftId: "",
    actions: [],
    gifts: [],
    conditions: [],
    searchCode: "",
    voucherStatus: 1,
    checkVoucherInfo: {},
    checkQuantityInfo: {},
    checkCode: "",
    checkStatus: 1,
    promoVoucherCount: {
      total: 0,
      redemped: 0,
      unused: 0,
      used: 0,
    },
    checkChannelVouchers: [],
    checkChannelId: "",
    checkChannelPageSize: 10,
    checkChannelPageIndex: 1,
    checkChannelCounter: 0,
    beforeAddInfo: {},
    updateVoucherGroupParam: {},
  },
  mutations: {
    setUpdateVoucherGroupParam(state, context) {
      state.updateVoucherGroupParam = context;
    },
    setCheckChannelId(state, context) {
      state.checkChannelId = context;
    },
    setBeforeAddInfo(state, context) {
      state.beforeAddInfo = context;
    },
    setCheckChannelVoucher(state, context) {
      state.checkChannelVouchers = context;
    },
    setCheckChannelPageSize(state, context) {
      state.checkChannelPageSize = context;
    },
    setCheckChannelPageIndex(state, context) {
      state.checkChannelPageIndex = context;
    },
    setCheckChannelCounter(state, context) {
      state.checkChannelCounter = context;
    },
    setPromoVoucherCount(state, context) {
      state.promoVoucherCount = context;
    },
    setCheckStatus(state, context) {
      state.checkStatus = context;
    },
    setCheckVoucherInfo(state, context) {
      state.checkVoucherInfo = context;
    },
    setCheckCode(state, context) {
      state.checkCode = context;
    },
    setSearchCode(state, context) {
      state.searchCode = context;
    },
    setVoucherStatus(state, context) {
      state.voucherStatus = context;
    },
    setConditions(state, context) {
      state.conditions = context;
    },
    setPostActions(state, context) {
      state.gifts = context;
    },
    setActions(state, context) {
      state.actions = context;
    },
    setActionId(state, context) {
      state.actionId = context;
    },
    setActionType(state, context) {
      state.actionType = context;
    },
    setPostActionType(state, context) {
      state.postActionType = context;
    },
    setPostActionId(state, context) {
      state.giftId = context;
    },
    setCheckVoucher(state, context) {
      state.checkVouchers = context;
    },
    setCheckPageSize(state, context) {
      state.checkPageSize = context;
    },
    setCheckPageIndex(state, context) {
      state.checkPageIndex = context;
    },
    setCheckCounter(state, context) {
      state.checkCounter = context;
    },
    setVoucherGroupDetail(state, context) {
      state.voucherGroupDetail = context;
    },
    setCheckIndexId(state, context) {
      state.checkIndexId = context;
    },
    setIndexInfo(state, context) {
      state.indexInfo = context;
    },
    setDetailPromoCode(state, context) {
      state.detailPromoCode = context;
    },
    setDetailPageSize(state, context) {
      state.detailPageSize = context;
    },
    setDetailPageIndex(state, context) {
      state.detailPageIndex = context;
    },
    setDetailCounter(state, context) {
      state.detailCounter = context;
    },
    setDetailVoucher(state, context) {
      state.detailVoucher = context;
    },
    setAssignVoucherId(state, context) {
      state.assignVoucherId = context;
    },
    setAssignPromoId(state, context) {
      state.assignPromoId = context;
    },
    setAvailVouchers(state, context) {
      state.availVouchers = context;
    },
    setAvailPageSize(state, context) {
      state.availPageSize = context;
    },
    setAvailPageIndex(state, context) {
      state.availPageIndex = context;
    },
    setAvailCounter(state, context) {
      state.availCounter = context;
    },
    setVoucherList(state, context) {
      state.voucherList = context;
    },
    setVoucherType(state, context) {
      state.voucherType = context;
    },
    setVoucherGroup(state, context) {
      state.voucherGroup = context;
    },
    setVoucherForm(state, context) {
      state.voucherForm = context;
    },
    setPromotionId(state, context) {
      state.promotionId = context;
    },
    setPageDefault(state, context) {
      state.pageDefault = context;
    },
    setPageIndex(state, context) {
      state.PageIndex = context;
    },
    setPageSize(state, context) {
      state.PageSize = context;
    },
    setCounter(state, context) {
      state.counter = context;
    },
    setSearchContent(state, context) {
      state.SearchContent = context;
    },
    setVoucherGroupId(state, context) {
      state.voucherGroupId = context;
    },
    setVouchers(state, context) {
      state.vouchers = context;
    },
    clearVouchers(state) {
      state.vouchers = [];
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setMoreQuantity(state, context) {
      state.moreQuantity = context;
    },
  },
  actions: {
    async updateVoucherGroup() {
      let param = this.state.voucher.updateVoucherGroupParam;
      let id = param.voucherGroupId;
      return await axios
        .put(API_URL + "api/voucher-groups/" + id, param)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async checkBeforeAdd({ commit }) {
      let voucherGroupId = this.state.voucher.voucherGroupId;
      return await axios
        .get(
          API_URL + "api/voucher-groups/check-before-add-more/" + voucherGroupId
        )
        .then((result) => {
          if (result.status == 200) {
            commit("setBeforeAddInfo", result.data);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getPromoVoucherCount({ commit }) {
      let promotionId = this.state.voucher.checkIndexId;
      let voucherGroupId = this.state.voucher.voucherGroupId;
      return await axios
        .get(API_URL + "api/vouchers/promotion-voucher-count", {
          params: {
            PromotionId: promotionId,
            VoucherGroupId: voucherGroupId,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setPromoVoucherCount", result.data);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getConditions({ commit }) {
      let brandId = this.state.voucher.brandId;
      return await axios
        .get(API_URL + "api/condition-rules", {
          params: {
            brandId: brandId,
            PageSize: 0,
            PageIndex: 0,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setConditions", result.data["data"]);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getPostAction({ commit }) {
      let brandId = this.state.voucher.brandId;
      let postActionType = this.state.voucher.postActionType;
      return await axios
        .get(API_URL + "api/post-actions", {
          params: {
            brandId: brandId,
            PageSize: 0,
            PageIndex: 0,
            PostActionType: postActionType,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setPostActions", result.data["data"]);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },

    async getAction({ commit }) {
      let brandId = this.state.voucher.brandId;
      let actionType = this.state.voucher.actionType;
      return await axios
        .get(API_URL + "api/actions", {
          params: {
            brandId: brandId,
            PageSize: 0,
            PageIndex: 0,
            actionType: actionType,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setActions", result.data["data"]);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async checkChannelOfVoucher({ commit }) {
      let pageSize = this.state.voucher.checkChannelPageSize;
      let pageIndex = this.state.voucher.checkChannelPageIndex;
      let voucherGroupId = this.state.voucher.voucherGroupId;
      let channelId = this.state.voucher.checkChannelId;
      return await axios
        .get(API_URL + "api/vouchers", {
          params: {
            PageSize: pageSize,
            PageIndex: pageIndex,
            VoucherGroupId: voucherGroupId,
            ChannelId: channelId,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setCheckChannelVoucher", result.data["data"]);
            commit(
              "setCheckChannelCounter",
              result.data["metadata"].totalItems
            );
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },

    async checkPromoOfVoucher({ commit }) {
      let pageSize = this.state.voucher.checkPageSize;
      let pageIndex = this.state.voucher.checkPageIndex;
      let voucherGroupId = this.state.voucher.voucherGroupId;
      let promotionId = this.state.voucher.checkIndexId;
      let checkStatus = this.state.voucher.checkStatus;
      return await axios
        .get(API_URL + "api/vouchers", {
          params: {
            PageSize: pageSize,
            PageIndex: pageIndex,
            VoucherGroupId: voucherGroupId,
            PromotionId: promotionId,
            VoucherStatus: checkStatus,
          },
        })
        .then((result) => {
          if (result.status == 200) {
            commit("setCheckVoucher", result.data["data"]);
            commit("setCheckCounter", result.data["metadata"].totalItems);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getVoucherGroupDetail({ commit }) {
      let id = this.state.voucher.voucherGroupId;
      return await axios
        .get(API_URL + "api/voucher-groups/" + id)
        .then((result) => {
          if (result.status == 200) {
            commit("setVoucherGroupDetail", result.data);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getIndexInfo({ commit }) {
      let id = this.state.voucher.checkIndexId;
      return await axios
        .get(API_URL + "api/voucher-groups/index-info/" + id)
        .then((result) => {
          if (result.status == 200) {
            commit("setIndexInfo", result.data);
          }
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getVoucherDetailList({ commit }) {
      let id = this.state.voucher.voucherGroupId;
      let PageSize = this.state.voucher.detailPageSize;
      let PageIndex = this.state.voucher.detailPageIndex;
      return await axios
        .get(API_URL + "api/vouchers", {
          params: {
            PageIndex: PageIndex,
            PageSize: PageSize,
            VoucherGroupId: id,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            commit("setDetailVoucher", response.data["data"]);
            commit("setDetailCounter", response.data["metadata"].totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async checkVoucher({ commit }) {
      let id = this.state.voucher.voucherGroupId;
      let SearchCode = this.state.voucher.checkCode;
      return await axios
        .get(API_URL + "api/vouchers/check-voucher", {
          params: {
            VoucherGroupId: id,
            SearchCode: SearchCode,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            commit("setCheckVoucherInfo", response.data);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async searchVoucherList({ commit }) {
      let id = this.state.voucher.voucherGroupId;
      let PageSize = this.state.voucher.detailPageSize;
      let PageIndex = this.state.voucher.detailPageIndex;
      let PromotionId = this.state.voucher.promotionId;
      let VoucherStatus = this.state.voucher.voucherStatus;
      let SearchCode = this.state.voucher.searchCode;
      return await axios
        .get(API_URL + "api/vouchers", {
          params: {
            PageIndex: PageIndex,
            PageSize: PageSize,
            VoucherGroupId: id,
            PromotionId: PromotionId,
            VoucherStatus: VoucherStatus,
            SearchCode: SearchCode,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            commit("setDetailVoucher", response.data["data"]);
            commit("setDetailCounter", response.data["metadata"].totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async deleteVoucherGroup() {
      let id = this.state.voucher.voucherGroupId;
      return await axios
        .delete(API_URL + "api/voucher-groups", {
          params: {
            voucherGroupId: id,
          },
        })
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async addMore() {
      let quantity = this.state.voucher.moreQuantity;
      let voucherGroupId = this.state.voucher.voucherGroupId;
      return await axios
        .put(API_URL + "api/voucher-groups/add-more", null, {
          params: {
            voucherGroupId: voucherGroupId,
            quantity: quantity,
          },
        })
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async rejectVoucher() {
      let promotionId = this.state.voucher.assignPromoId;
      let voucherGroupId = this.state.voucher.assignVoucherId;
      return await axios
        .put(API_URL + "api/voucher-groups/reject", null, {
          params: {
            promotionId: promotionId,
            voucherGroupId: voucherGroupId,
          },
        })
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async assginVoucher() {
      let promotionId = this.state.voucher.assignPromoId;
      let voucherGroupId = this.state.voucher.assignVoucherId;
      return await axios
        .put(API_URL + "api/voucher-groups/assign", null, {
          params: {
            promotionId: promotionId,
            voucherGroupId: voucherGroupId,
          },
        })
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getAvailableVoucher({ commit }) {
      let brandId = this.state.voucher.brandId;
      let PageSize = this.state.voucher.availPageSize;
      let PageIndex = this.state.voucher.availPageIndex;
      return await axios
        .get(API_URL + "api/voucher-groups/available", {
          params: {
            brandId: brandId,
            PageIndex: PageIndex,
            PageSize: PageSize,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            let outcome = result.metadata;
            commit("setAvailVouchers", result["data"]);
            commit("setAvailCounter", outcome.totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getVoucherList({ commit }) {
      let brandId = this.state.voucher.brandId;
      let PageSize = this.state.voucher.PageSize;
      let PageIndex = this.state.voucher.PageIndex;
      let SearchContent = this.state.voucher.SearchContent;
      let ActionType = this.state.voucher.actionType;
      let PostActionType = this.state.voucher.postActionType;
      return await axios
        .get(API_URL + "api/voucher-groups", {
          params: {
            SearchContent: SearchContent,
            PageSize: PageSize,
            PageIndex: PageIndex,
            brandId: brandId,
            ActionType: ActionType,
            PostActionType: PostActionType,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            let outcome = result.metadata;
            console.log("outcome.totalItems :>> ", outcome.totalItems);
            commit("setVoucherList", result);
            commit("setCounter", outcome.totalItems);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getVoucherListForPromo({ commit }) {
      let brandId = this.state.voucher.brandId;
      return await axios
        .get(API_URL + "api/voucher-groups/for-promo/" + brandId)
        .then((response) => {
          if (response.status === 200) {
            let result = response.data;
            console.log(result);
            commit("setVoucherList", result);
          }
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async saveVoucherGroup({ commit }) {
      let brandId = this.state.voucher.brandId;
      let form = this.state.voucher.voucherForm;
      let promotionId = this.state.voucher.promotionId;
      console.log(form.customCharset);
      let params = {
        brandId: brandId,
        voucherName: form.groupName,
        quantity: form.quantity,
        charset: form.charset,
        prefix: form.prefix,
        postfix: form.postfix,
        customCharset: form.customCharset,
        codeLength: form.codeLength,
        isLimit: form.isUnLimit,
        customCode: form.customCode,
        promotionId: promotionId,
        conditionRuleId: form.conditionRuleId,
        actionId: form.actionId,
        giftId: form.giftId,
      };
      return await axios
        .post(API_URL + "api/voucher-groups", params)
        .then((response) => {
          let result = response.data;
          commit("setVoucherGroup", result);
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async getVouchers({ commit }) {
      let id = this.state.voucher.voucherGroupId;
      let PageSize = this.state.voucher.PageSize;
      let PageIndex = this.state.voucher.PageIndex;
      await axios
        .get(API_URL + "api/vouchers", {
          params: {
            PageIndex: PageIndex,
            PageSize: PageSize,
            VoucherGroupId: id,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            commit("setVouchers", response.data["data"]);
            commit("setCounter", response.data["metadata"].totalItems);
          }
        });
    },
  },
};
