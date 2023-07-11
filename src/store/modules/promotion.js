import axios from "axios";
import { API_URL } from "../API_KEY";

export const promotion = {
  namespaced: true,
  state: {
    promotionTypeForm: {},
    promotionConfigurationForm: {},
    prmotion: {},
    brandId: "",
    isLimitForStore: false,
    promoCode: "",
    isExistPromoCode: false,
    deleteId: "",
    insertTierParam: {},
    exclusives: [
      {
        label: "None",
        value: 0,
      },
      {
        label: "Global",
        value: 1,
      },
    ],
  },
  mutations: {
    setExclusives(state, context) {
      state.exclusives = context;
    },
    setInsertTierParam(state, context) {
      state.insertTierParam = context;
    },
    setPromotionTypeForm(state, context) {
      state.promotionTypeForm = context;
    },
    setPromotionConfigurationForm(state, context) {
      state.promotionConfigurationForm = context;
    },
    setPromotion(state, context) {
      state.promotion = context;
    },
    setPromotionImage(state, context) {
      state.promotionConfigurationForm.imgUrl = context;
    },
    setIsLimitForStore(state, context) {
      state.isLimitForStore = context;
    },
    setBrandId(state, context) {
      state.brandId = context;
    },
    setPromoCode(state, context) {
      state.promoCode = context;
    },
    setDeleteId(state, context) {
      state.deleteId = context;
    },
    setIsExistPromoCode(state, context) {
      state.isExistPromoCode = context;
    },
  },
  actions: {
    async savePromotion({ commit }) {
      let promotionTypeForm = this.state.promotion.promotionTypeForm;
      let promotionConfigurationForm = this.state.promotion
        .promotionConfigurationForm;
      let brandId = this.state.promotion.brandId;
      let postParams = {
        brandId: brandId,
        promotionName: promotionTypeForm.promotionName,
        promotionCode: promotionTypeForm.promotionCode,
        description: promotionTypeForm.description,
        imgUrl: promotionConfigurationForm.imgUrl,
        startDate: promotionTypeForm.startDate.toLocaleString("vn", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
        endDate: promotionTypeForm.endDate.toLocaleString("vn", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
        exclusive: promotionConfigurationForm.exclusive,
        applyBy: promotionConfigurationForm.applyByNum,
        saleMode: promotionConfigurationForm.salesModeNum,
        gender: promotionConfigurationForm.customerGenderNum,
        paymentMethod: promotionConfigurationForm.paymentMethodNum,
        forHoliday: promotionConfigurationForm.isHolidayApplyNum ? 1 : 0,
        forMembership: promotionConfigurationForm.customerTypeNum,
        dayFilter: promotionTypeForm.dateFilterNum,
        hourFilter: promotionTypeForm.hourFilterNum,
        status: 1,
        promotionStoreMapping: promotionConfigurationForm.storeApply,
        memberLevelMapping: promotionConfigurationForm.memberLevels,
        isForGame: promotionConfigurationForm.isForGame,
        actionType: promotionTypeForm.actionType,
        postActionType: promotionTypeForm.postActionType,
        isAuto: promotionTypeForm.isAuto,
        hasVoucher: promotionTypeForm.hasVoucher,
        voucherGroupId: promotionTypeForm.voucherGroupId,
        conditionRuleId: promotionTypeForm.conditionRuleId,
        voucherQuantity: promotionTypeForm.voucherQuantity,
      };
      console.log("post param");
      console.log(postParams);
      return await axios
        .post(API_URL + "api/promotions", postParams)
        .then((response) => {
          let result = response.data;
          commit("setPromotion", result);
          return response;
        })
        .catch((error) => {
          throw error;
        });
    },

    async CheckExistPromoCode({ commit }) {
      let promoCode = this.state.promotion.promoCode;
      let brandId = this.state.promotion.brandId;
      await axios
        .get(API_URL + "api/promotions/check-exist-promoCode", {
          params: {
            brandId: brandId,
            promoCode: promoCode,
          },
        })
        .then((response) => {
          commit("setIsExistPromoCode", response.data);
        });
    },
    async DeletePromotion() {
      let id = this.state.promotion.deleteId;
      return axios
        .delete(API_URL + "api/promotions/" + id)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    },
    async CreatePromotionTier() {
      let params = this.state.promotion.insertTierParam;
      return await axios
        .post(API_URL + "api/promotion-tiers", params)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
};
