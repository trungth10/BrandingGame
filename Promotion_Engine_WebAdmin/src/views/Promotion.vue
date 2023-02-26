<template>
  <div id="promotion">
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8"> </base-header>
    <div class="container-fluid mt--9">
      <div class="card shadow">
        <div class="card-header bg-transparent promotion">
          <el-row type="flex" justify="space-between">
            <el-col :span="22" class="mt-2">
              <h2 class="mb-0">Manage Promotion</h2>
            </el-col>
            <el-col :span="2" class="float-right mt-1">
              <el-button size="medium" type="success" @click="addPromotion" icon="el-icon-plus"
                >New Promotion</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
      <el-row class="mt-3">
        <promotions-table />
      </el-row>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import PromotionsTable from "./Promotion/PromotionTable.vue";
Vue.use(VueClipboard);
export default {
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  components: {
    PromotionsTable,
  },
  data() {
    return {};
  },
  created() {},
  beforeMount() {
    // let user = this.$session.get("user-info");
    // let brandId = user.brandId;
    // this.$store.commit("promotion/setBrandId", brandId);
  },
  methods: {
    addPromotion() {
      // window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/"); ---> Quay lai trang truoc
      this.$router.push("/campaign/promotion/wizard");
    },
  },
};
</script>
<style>
.el-icon-circle-plus {
  font-size: 2.5vh;
}
#promotion .promotion .el-button {
  border: 0px;
  float: right;
  background-color: #2dcecc;
}
</style>
