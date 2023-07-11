<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8"> </base-header>

    <div class="container-fluid mt--7">
      <el-row>
        <div class="card shadow">
          <div class="card-header bg-transparent promotion">
            <el-col :span="12" class="mt-2">
              <h2 class="mb-0">Game Campaign</h2>
            </el-col>
            <el-col :span="12" type="primary">
              <el-button
                type="primary"
                @click="createGameCampaign"
                class="float-right"
                icon="el-icon-plus"
                >New Game Campaign</el-button
              >
            </el-col>
          </div>
        </div>
      </el-row>
      <el-row class="mt-5">
        <game-campaign-table ref="gameConfigTable" />
      </el-row>
    </div>
  </div>
</template>
<script>
import GameCampaignTable from "./GameCampaign/GameCampaignTable.vue";
export default {
  created() {
    // this.$refs["gameConfigTable"].getGameCampaignList();
  },
  data() {
    return {
      loading: false,
    };
  },
  components: { GameCampaignTable },
  methods: {
    createGameCampaign() {
      this.$router.push("/game-campaign/create");
    },
  },
};
</script>
<style></style>
