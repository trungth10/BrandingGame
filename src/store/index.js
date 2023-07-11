import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { dashboard } from "./modules/dashboard";
import { profile } from "./modules/profile";
import { stores } from "./modules/stores";
import { channel } from "./modules/channel";
import { promotion } from "./modules/promotion";
import { voucher } from "./modules/voucher";
import { condition } from "./modules/condition";
import { promotion_detail } from "./modules/promotion-detail";
import { action } from "./modules/action";
import { notify } from "./modules/notify";
import { account } from "./modules/account";
import { admin } from "./modules/admin";
import { device } from "./modules/device";
import { product_cate } from "./modules/product-cate";
import { member_level } from "./modules/member-level";
import { product } from "./modules/product";
import { customer } from "./modules/customer";
import { game } from "./modules/game";
import { game_campaign } from "./modules/game-campaign";
import { gift } from "./modules/gift";
import { transaction } from "./modules/transaction";

export const store = new Vuex.Store({
  modules: {
    dashboard,
    profile,
    stores,
    channel,
    promotion,
    voucher,
    condition,
    promotion_detail,
    action,
    notify,
    account,
    admin,
    device,
    product_cate,
    member_level,
    product,
    customer,
    game,
    game_campaign,
    gift,
    transaction,
  },
});
