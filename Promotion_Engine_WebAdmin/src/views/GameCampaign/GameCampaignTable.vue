<template>
  <div v-loading="loading" class="card shadow" id="gameConfig">
    <div>
      <el-table
        ref="gameConfig"
        :data="gameConfigList"
        style="width: 100%"
        cell-class-name="modifyCell"
        stripe
      >
        <el-table-column type="index" label="#" width="100" />

        <el-table-column width="300" label="Name">
          <template slot-scope="scope">
            <router-link
              style="word-break: break-word"
              type="primary"
              :to="{
                name: 'Update Game Configuration',
                params: { id: scope.row.id },
              }"
            >
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="updDate" label="Quantity of item">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              style="outline: none; border: 0px"
              class="p-0"
              icon="el-icon-delete-solid"
              type="text text-dark"
              @click="deleteConfig(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- //# Pagination -->
    <div
      class="card-footer d-flex justify-content-end"
      :class="type === 'dark' ? 'bg-transparent' : ''"
    >
      <base-pagination
        :page-count="pageCount"
        v-model="pagination.default"
        @input="changePage"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "game-campaign-table",
  props: {
    type: {
      type: String,
    },
    title: String,
  },
  data() {
    return {
      pagination: {
        default: 1,
      },
      search: "",
      loading: false,
      pageCount: 1,
    };
  },
  computed: {
    gameConfigList() {
      this.setPageCount();
      return this.$store.state.game_campaign.gameConfigs;
    },
  },
  watch: {},
  methods: {
    deleteConfig(id) {
      this.$confirm("Do you want to delete ?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$store.commit("game_campaign/setDeleteId", id);
        this.$store
          .dispatch("game_campaign/deleteConfig")
          .then((result) => {
            this.loading = false;
            if (result.status == 200) {
              this.$notify({
                icon: "el-icon-circle-check",
                title: "Success",
                message: "Delete successfully",
                type: "success",
              });
              this.getGameCampaignList();
            } else {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Error occur when deleting. Please try again",
                type: "danger",
              });
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when deleting. Please try again",
              type: "danger",
            });
          });
      });
    },
    changePage(index) {
      this.$store.commit("game_campaign/setPageIndex", index);
      this.loading = true;
      this.getGameCampaignList();
    },
    setPageCount() {
      let pageSize = this.$store.state.game_campaign.pageSize;
      this.pageCount = Math.ceil(this.$store.state.game_campaign.counter / pageSize);
    },

    getGameCampaignList() {
      this.loading = true;
      this.$store
        .dispatch("game_campaign/getGameCampaignList")
        .then((res) => {
          this.loading = false;
          if (res.status != 200) {
            console.log(res.data.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when getting Game Configuration. Please try again",
              type: "danger",
            });
          } else {
            if (this.gameConfigList.length == 0 && this.pagination.default > 1) {
              this.pagination.default--;
              this.changePage(this.pagination.default);
            }
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.message);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error occur when getting Game Configuration. Please try again",
            type: "danger",
          });
        });
    },
  },
  created() {
    this.getGameCampaignList();
  },
};
</script>
<style>
.modifyCell {
  padding: 0px;
  height: 4vh;
}
#gameConfig .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
}
</style>
