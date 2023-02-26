<template>
  <div v-loading="loading" class="p-3" style="background-color: white">
    <h2>Available Rules</h2>
    <el-card shadow="">
      <el-table
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="availableRules"
        style="width: 100vw"
        class="p-2"
      >
        <el-table-column label="#" type="index" width="100"> </el-table-column>
        <el-table-column prop="date" label="Rule">
          <template slot-scope="scope"> {{ scope.row.ruleName }}</template>
        </el-table-column>
        <el-table-column prop="date" label="Description">
          <template slot-scope="scope"> {{ scope.row.description }}</template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-row class="mt-3">
      <el-col :span="12">
        <base-pagination
          :page-count="pageCount"
          :value="tableIndex"
          @input="changePage"
        ></base-pagination>
      </el-col>
      <el-col :span="12">
        <el-button
          :disabled="currentRow == null"
          type="primary"
          size="small"
          @click="assignPromo"
          icon="el-icon-paperclip"
          class="float-right m-2"
        >
          Select Rule
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";

Vue.use(VueClipboard);
export default {
  name: "available-rule-table",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  props: {
    actionTypeParam: String,
    discountTypeParam: String,
    promotionId: String,
  },
  data() {
    return {
      loading: false,
      pageCount: 10,
      pagination: {
        default: 1,
      },
      currentRow: null,
    };
  },
  computed: {
    availableRules() {
      this.setPageCount();
      return this.$store.state.condition.availableConditions;
    },
    tableIndex() {
      return this.$store.state.condition.availPageIndex;
    },
  },
  created() {
    this.getAvailableRules();
  },
  methods: {
    getAvailableRules() {
      console.log("Get avail");
      this.loading = true;
      this.$store.commit("condition/setAvailActionType", this.actionTypeParam);
      this.$store.commit("condition/setAvailDiscountType", this.discountTypeParam);
      this.$store
        .dispatch("condition/getAvailableConditions")
        .then((response) => {
          this.loading = false;
          if (response.status != 200) {
            this.$notify({
              title: "Error",
              message: response.data.message,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$notify({
            title: "Error",
            message: err.message,
          });
        });
    },
    assignPromo() {
      if (this.currentRow != null) {
        this.loading = true;
        this.$store.commit("condition/setAssignPromoId", this.promotionId);
        this.$store.commit("condition/setAssignTierId", this.currentRow.promotionTierId);
        this.$store
          .dispatch("condition/assignPromo")
          .then((response) => {
            this.loading = false;
            if (response.status == 200) {
              this.getAvailableRules();
              this.$notify({
                title: "Success",
                message: "Assign successfully",
              });
            } else {
              this.$notify({
                title: "Error",
                message: response.data.message,
              });
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$notify({
              title: "Error",
              message: err.message,
            });
          });
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    setPageCount() {
      let pageSize = this.$store.state.condition.availPageSize;
      this.pageCount = Math.ceil(this.$store.state.condition.availCounter / pageSize);
    },
    changePage(index) {
      this.loading = true;
      this.$store.commit("condition/setAvailPageIndex", index);
      this.$store
        .dispatch("condition/getAvailableConditions")
        .then((response) => {
          console.log(response);
          this.loading = false;
          if (response.status != 200) {
            this.$notify.error({
              title: "Error",
              message: response.data.message,
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
  },
};
</script>
<style></style>
