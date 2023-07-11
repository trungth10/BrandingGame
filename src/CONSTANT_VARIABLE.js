export const ENV = {
  CHARSET_TYPE: {
    ALPHANUMERIC: "Alphanumeric",
    ALPHABETIC: "Alphabetic",
    ALPHABETIC_LOWERCASE: "Alphabetic Lowercase",
    ALPHABETIC_UPERCASE: "Alphabetic Uppercase",
    NUMBERS: "Numbers",
    CUSTOM: "Custom",
  },
  CHANNEL_TYPE: {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
  },
  PROMOTION_STATUS: {
    DRAFT: 1,
    PUBLISH: 2,
    UNPUBLISH: 3,
    EXPIRED: 4,
  },
  EXCLUSIVE: {
    NONE: 0,
    GLOBAL: 1,
    LEVEL_ORDER: 2,
    LEVEL_PRODUCT: 3,
    LEVEL_SHIPPING: 4,
    LEVEL_GIFT: 5,
  },
  GENDER: {
    MALE: 1,
    FEMALE: 2,
  },
  PAYMENT: {
    CASH: 1,
    CREDIT_CARDS: 2,
    BANK_TRANSFERS: 4,
    EWALLETS: 8,
    MOBILE_BANKING: 16,
    COD: 32,
  },
  UNLIMIT: "0",
  ISLIMIT: "1",
  PRODUCT_CONDITION_TYPE: {
    INCLUDE: 0,
    EXCLUDE: 1,
  },
  ACTION_TYPE: {
    EMPTY: 0,
    ORDER_AMOUNT: 1,
    ORDER_PERCENT: 2,
    ORDER_SHIPPING: 3,
    PRODUCT_AMOUNT: 4,
    PRODUCT_PERCENT: 5,
    PRODUCT_UNIT: 6,
    PRODUCT_FIXED: 7,
    PRODUCT_LADDER: 8,
    PRODUCT_BUNDLE: 9,
  },
  POST_ACTION_TYPE: {
    EMPTY: 0,
    GIFT_PRODUCT: 1,
    GIFT_VOUCHER: 2,
    GIFT_POINT: 3,
    GIFT_GAME_CODE: 4,
  },
  OPERATOR_PARAM: {
    GREATER_THAN: 1,
    GREATER_THAN_OR_EQUAL: 2,
    LESS_THAN: 3,
    LESS_THAN_OR_EQUAL: 4,
    EQUAL: 5,
  },
  ROLE: {
    ADMIN: "Admin",
    Brand: "Brand Manager",
  },
  NEXT_OPERATOR: {
    OR: 1,
    AND: 2,
  },
  NEXT_OPERATOR_PARAM: [
    {
      id: 1,
      name: "Or",
    },
    {
      id: 2,
      name: "And",
    },
  ],
  CONTAIN_CODE: {
    INCLUDE: 1,
    EXCLUDE: 2,
  },
  CONTAIN_CODE_PARAM: [
    {
      id: 1,
      name: "Include",
    },
    {
      id: 2,
      name: "Exclude",
    },
  ],
  OPERATOR: [
    {
      id: 1,
      name: ">",
    },
    {
      id: 2,
      name: ">=",
    },
    {
      id: 3,
      name: "=",
    },
    {
      id: 4,
      name: "<",
    },
    {
      id: 5,
      name: "<=",
    },
  ],
  TEXT_EXPLAIN: {
    Exclusive:
      "Whether promotion excludes others or not.",
      // The exclusivity attribute lets you specify if promotions are mutually exclusive, either in general or relative to a promotion's class.
    Rank: "Define which promotions take precedence.",
    Sale_mode: "The mode in which you sell your products.",
    Apply_by: "Where yours customers can use promotion.",
    For_holiday: "This promotion can be used on holidays or not.",
    Customer_type: "Kind of customer can use your promotion.",
    Customer_gender: "Gender of customer can use your promotion.",
    Member_level: "Level of customer",
    Payment: "Payment method can use this promotion",
    Store: "Stores that customer can use promotion",
    Game: "Customer can play game and get promotion",
    Action:
      "Action is the action that affect to the order or add a gift to order.",
    Condition:
      "Condition is the constraint of the order when Customer check or apply for a promotion.",
    Voucher:
      "A voucher is a bond of the redeemable transaction type which is worth a certain monetary value and which may be spent only for specific reasons or on specific goods.",
    Voucher_Advance: "More configuration about Charset, Prefix and Postfix",
    Action_Welcome_Text:"Please select voucher group"
  },
  COLORS: {
    Main_colors: "#2DCE89",
  },
  GUID:{
    EMPTY:"00000000-0000-0000-0000-000000000000"
  }
};
