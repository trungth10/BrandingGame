<template>
  <div id="condition">
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--9">
      <div class="card shadow">
        <div class="card-header bg-transparent promotion">
          <el-col :span="22" class="mt-2">
            <h2 class="mb-0">Manage Condition</h2>
          </el-col>
          <el-col :span="2" class="float-right mt-1">
            <el-button
              size="medium"
              type="success"
              @click="createCondition"
              icon="el-icon-plus"
              >New Condition</el-button
            >
          </el-col>
        </div>
      </div>
      <el-row class="mt-3">
        <condition-table />
      </el-row>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import ConditionTable from "./ConditionRule/ConditionTable.vue";
Vue.use(VueClipboard);
export default {
  components: { ConditionTable },
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  data() {
    return {};
  },
  created() {
    // let user = this.$session.get("user-info");
    // if (user != undefined) {
    //   let brandId = user.brandId;
    //   if (brandId != undefined) {
    //     this.$store.commit("condition/setBrandId", brandId);
    //   } else {
    //     this.$router.push("/login").catch(() => {});
    //   }
    // } else {
    //   this.$router.push("/login").catch(() => {});
    // }
  },
  methods: {
    createCondition() {
      this.$router.push("/campaign/condition/wizard");
    },
    onCopy() {
      this.$notify({
        type: "success",
        title: "Copied to clipboard",
      });
    },
  },
};
</script>
<style>
.el-icon-circle-plus {
  font-size: 2.5vh;
}
#condition .promotion .el-button {
  border: 0px;
  background-color: #2dcecc;
}
</style>
