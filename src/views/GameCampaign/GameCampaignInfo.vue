<template>
  <div>
    <el-form
      ref="gameConfigForm"
      :model="gameConfig"
      label-position="left"
      :rules="gameConfigRules"
    >
      <h3>Game Campaign</h3>
      <el-divider class="custom-divider"></el-divider>
      <el-row>
        <el-col :span="4" class="ml-2">
          <el-form-item label="Has Code? ">
            <el-switch v-model="gameConfig.hasCode" active-text="Yes" inactive-text="No"
              >>
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="name" label="Name">
            <el-col :span="18">
              <el-input :maxlength="50" v-model="gameConfig.name"> </el-input>
            </el-col>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="Time" prop="startGame">
            <el-col :span="6">
              <el-date-picker
                prop="startGame"
                type="date"
                placeholder="Pick a start date"
                v-model="gameConfig.startGame"
                @change="changeStartGame"
                :picker-options="pickerOptionsstartGame"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :offset="1" :span="1">-</el-col>
            <el-col :span="6">
              <el-date-picker
                type="date"
                prop="endGame"
                placeholder="Pick a end date"
                v-model="gameConfig.endGame"
                style="width: 100%"
                :picker-options="pickerOptionEndGame"
                :disabled="!gameConfig.startGame || gameConfig.isUnlimited"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="gameMasterId" label="Game">
            <el-select
              v-model="gameConfig.gameMasterId"
              :filterable="true"
              :style="gameConfig.gameStyle"
              @change="changeGameMaster"
              placeholder="Select game"
              style="width: 15vw"
            >
              <el-option
                v-for="(game, index) in gameMasterList"
                :key="index"
                :label="game.name | nameFilter"
                :value="game.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Store" prop="storeId">
            <el-select
              v-model="gameConfig.storeId"
              :default-first-option="true"
              :filterable="true"
              placeholder="Select Store"
              style="width: 7.2vw"
            >
              <el-option
                v-for="(store, index) in stores"
                :key="index"
                :label="store.storeName | nameFilter"
                :value="store.storeId"
              >
              </el-option
            ></el-select> </el-form-item
        ></el-col>
        <el-col :span="6">
          <el-form-item label="Promotion" prop="promotionId">
            <el-select
              :style="gameConfig.style"
              v-model="gameConfig.promotionId"
              :default-first-option="true"
              :filterable="true"
              placeholder="Select promotion"
              @change="changePromo"
            >
              <el-option
                v-for="(promo, index) in promotion"
                :key="index"
                :label="promo.promotionName | nameFilter"
                :value="promo.promotionId"
              >
              </el-option
            ></el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row class="ml-2">
        <el-col class="mt-2" :span="4">
          <label> <b>Minimum item(s):</b> {{ minItem }}</label>
        </el-col>
        <el-col class="mt-2" :span="4">
          <label> <b>Maximum item(s):</b> {{ maxItem }}</label>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "game-campaign-info",
  props: {
    gameConfig: Object,
    gameConfigRules: Object,
  },
  methods: {
    changePromo(value) {
      this.$emit("changePromo", value);
    },
  },
};
</script>

<style></style>
