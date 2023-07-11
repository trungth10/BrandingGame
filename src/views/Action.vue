<template>
  <div id="action">
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8"> </base-header>
    <div class="container-fluid mt--9">
      <el-row>
        <div class="card shadow">
          <div class="card-header bg-transparent">
            <el-col :span="12" class="mt-2">
              <h2 class="mb-0">Manage Action</h2>
            </el-col>
            <el-col :span="12" type="primary">
              <el-button
                @click="createAction"
                type="primary"
                class="float-right"
                icon="el-icon-plus"
                size="medium"
                >New Action</el-button
              >
            </el-col>
          </div>
        </div>
      </el-row>
      <el-row class="mt-3">
        <action-table />
      </el-row>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";
import ActionTable from "./Action/ActionTable.vue";

Vue.use(VueClipboard);
export default {
  components: { ActionTable },
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  data() {
    return {};
  },
  methods: {
    createAction() {
      this.$router.push({ name: "Action builder", params: { isAction: true } });
    },
  },
};
</script>
<style>
#action .el-tabs__nav-scroll {
  border-radius: 1px;
}
#action .el-tabs--border-card {
  border-radius: 4px;
}
</style>
