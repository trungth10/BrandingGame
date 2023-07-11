<template>
  <div>
    <base-header type="gradient-success" class="pb-6 mb-2 pt-1"> </base-header>
    <div class="container-fluid pt-2 pb-2">
      <el-card v-loading="loading">
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
                <el-switch
                  v-model="gameConfig.hasCode"
                  active-text="Yes"
                  inactive-text="No"
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

            <el-col :span="8">
              <el-form-item label="Time" prop="startGame">
                <el-col :span="8">
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
                <el-col :span="8">
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
            <el-col :span="8" v-if="gameConfig.hasCode">
              <el-form-item prop="expiredDuration" label="Game code duration">
                <el-row>
                  <el-col :span="9">
                    <el-input-number
                      v-model="gameConfig.expiredDuration"
                      :min="1"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="3"> minutes </el-col>
                </el-row>
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

            <el-col :span="8">
              <el-form-item label="Promotion" prop="promotionId">
                <el-select
                  :style="gameConfig.style"
                  v-model="gameConfig.promotionId"
                  :default-first-option="true"
                  :filterable="true"
                  placeholder="Select promotion"
                  @change="changePromo"
                  style="width: 18vw"
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

            <el-col :span="6">
              <el-form-item prop="storeIdList" label="Store">
                <el-select
                  v-model="gameConfig.storeIdList"
                  placeholder="Select"
                  multiple=""
                  collapse-tags=""
                >
                  <el-option
                    v-for="(store, index) in stores"
                    :key="index"
                    :label="store.storeName"
                    :value="store.storeId"
                  >
                  </el-option>
                </el-select> </el-form-item
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
        <el-divider class="custom-divider"></el-divider>
        <el-row :gutter="20">
          <el-col
            class="mb-3"
            v-for="(item, index) in gameConfig.gameItems"
            :key="index"
            :span="8"
          >
            <el-card :style="item.style">
              <el-form
                :ref="'gameItemForm-' + index"
                :rules="gameItemRules"
                :model="item"
                label-position="left"
                label-width="100"
              >
                <el-row>
                  <el-col :span="12">
                    <h4>Game Item {{ index + 1 }}</h4>
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      class="float-right text-dark"
                      size="mini"
                      style="outline: none; border: 0px"
                      icon="el-icon-close"
                      circle=""
                      @click="removeItem(index)"
                      type="text"
                      plain
                    ></el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="Promotion Tier" prop="promotionTierId">
                    <el-select
                      v-if="isAction"
                      v-model="item.promotionTierId"
                      :default-first-option="true"
                      :filterable="true"
                      placeholder="Select promotion tier"
                    >
                      <el-option
                        v-for="(tier, index) in tiers"
                        :key="index"
                        :label="tier.action.name"
                        :value="tier.promotionTierId"
                      >
                      </el-option>
                    </el-select>
                    <el-select
                      v-if="!isAction"
                      v-model="item.promotionTierId"
                      :default-first-option="true"
                      :filterable="true"
                      placeholder="Select promotion tier"
                    >
                      <el-option
                        v-for="(tier, index) in tiers"
                        :key="index"
                        :label="tier.gift.name"
                        :value="tier.promotionTierId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-row>

                <el-row>
                  <el-col :span="16">
                    <el-form-item label="Display Text" prop="displayText">
                      <el-col :span="14"
                        ><el-input v-model="item.displayText" :max="30"> </el-input
                      ></el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="textColor">
                      <el-color-picker
                        ref="textColorPicker"
                        @active-change="activeChangeTextColor(index)"
                        :predefine="predefineColors"
                        v-model="item.textColor"
                      ></el-color-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="Priority" prop="priority">
                    <el-col :span="20"
                      ><el-slider
                        v-model="item.priority"
                        :min="1"
                        :max="1000"
                        :marks="marks"
                      ></el-slider
                    ></el-col>
                    <!-- <el-select
                      v-model="item.priority"
                      :default-first-option="true"
                      :filterable="true"
                      placeholder="Select priority"
                    >
                      <el-option
                        v-for="(priority, index) in priorityLevel"
                        :key="index"
                        :label="priority | priorityFilter"
                        :value="priority"
                      >
                      </el-option>
                    </el-select>--></el-form-item
                  ></el-row
                >
                <el-row class="ml-2 mt-3">
                  <el-form-item label="Item Color" prop="itemColor">
                    <el-color-picker
                      ref="itemColorPicker"
                      @active-change="activeChangeItemColor(index)"
                      :predefine="predefineColors"
                      v-model="item.itemColor"
                    ></el-color-picker> </el-form-item
                ></el-row>
              </el-form>
            </el-card>
          </el-col>
          <el-col class="p-2" :span="8">
            <center>
              <el-button type="primary" plain @click="addItem" icon="el-icon-plus"
                >New Item</el-button
              >
            </center>
          </el-col>
        </el-row>
        <el-divider class="custom-divider mt-4"></el-divider>
        <el-row class="mt-3">
          <el-col :span="24">
            <el-button
              type="primary"
              class="float-right"
              icon="el-icon-edit-outline"
              @click="updateConfig"
              >Update Configuration</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
const PROMO_NAME_LENGTH = 40;
export default {
  name: "update-game-campaign",
  components: {},

  data() {
    return {
      loading: false,
      minItem: 0,
      maxItem: 100,
      tiers: [],
      emptyGuid: "00000000-0000-0000-0000-000000000000",
      gameConfigRules: {
        name: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please input name",
          },
        ],
        startGame: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please choose start time",
          },
        ],
        endGame: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please choose end time",
          },
        ],
        gameMasterId: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please select Game",
          },
        ],
        promotionId: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please select Promotion",
          },
        ],
        storeIdList: [
          {
            required: true,
            trigger: ["change"],
            message: "Store is required",
          },
        ],
        expiredDuration: [
          {
            required: true,
            trigger: ["change"],
            message: "Store is required",
          },
        ],
      },
      pickerOptionsstartGame: {
        disabledDate(time) {
          return (
            time.getTime() <=
            new Date(new Date().setDate(new Date().getDate() - 1)).getTime()
          );
        },
      },
      marks: {
        1: "Rarely",
        250: "Sometimes",
        500: "Often",
        750: "Usually",
        1000: "Always",
      },
      predefineColors: [
        "#000000",
        "#ffffff",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
      colorIndex: 2,
      pickerOptionEndGame: {
        disabledDate: this.handleDueDate,
      },
      gameItemRules: {
        displayText: [
          {
            required: true,
            trigger: ["change"],
            message: "Please enter display text",
          },
        ],
        promotionTierId: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please select Promotion tier",
          },
        ],
        priority: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "Please select Priority",
          },
        ],
      },
      isAction: true,
      priorityLevel: [1, 2, 3, 4, 5],
    };
  },
  computed: {
    gameMasterList() {
      return this.$store.state.game_campaign.gameMaster;
    },
    promotion() {
      return this.$store.state.game_campaign.gamePromo;
    },
    gameConfigId() {
      return this.$router.currentRoute.params.id;
    },
    gameConfig() {
      console.log("info ", this.$store.state.game_campaign.gameConfigInfo);
      return this.$store.state.game_campaign.gameConfigInfo;
    },
    stores() {
      return this.$store.state.game_campaign.stores;
    },
  },
  async created() {
    await this.getGameMaster();
    await this.getPromoForGameCampaign();
    this.getStoreForGameCampaign();
    await this.getGameCampaign();
    this.getTierList();
    this.checkAction();
  },
  filters: {
    priorityFilter(value) {
      switch (value) {
        case 1:
          return "Rarely";
        case 2:
          return "Sometimes";
        case 3:
          return "Often";
        case 4:
          return "Usually";
        case 5:
          return "Always";
      }
    },
    nameFilter(value) {
      if (value.length > PROMO_NAME_LENGTH) {
        return value.substring(0, PROMO_NAME_LENGTH) + "...";
      }
      return value;
    },
  },
  methods: {
    checkAction() {
      this.tiers.forEach((e) => {
        if (e.action) {
          this.isAction = true;
        } else {
          this.isAction = false;
        }
        return;
      });
      if (this.isAction) {
        this.tiers.push({
          promotionTierId: this.emptyGuid,
          action: {
            name: "Good Luck",
          },
        });
      } else {
        this.tiers.push({
          promotionTierId: this.emptyGuid,
          gift: {
            name: "Good Luck",
          },
        });
      }
    },
    getStoreForGameCampaign() {
      this.loading = true;
      this.$store
        .dispatch("game_campaign/getStoresList")
        .then((result) => {
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when getting Stores. Please try again",
              type: "danger",
            });
          }
          this.loading = false;
          return result.data;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.message);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error occur when getting Stores. Please try again",
            type: "danger",
          });
        });
    },
    getTierList() {
      let tiers = "";
      this.promotion.forEach((e) => {
        if (e.promotionId == this.gameConfig.promotionId) {
          tiers = e.promotionTier;
        }
      });
      this.tiers = tiers;
    },
    async getGameCampaign() {
      this.$store.commit("game_campaign/setGameCampaignId", this.gameConfigId);
      await this.$store
        .dispatch("game_campaign/getGameCampaignInfo")
        .then((result) => {
          if (result.status != 200) {
            console.log(result.data.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when getting info. Please try again",
              type: "danger",
            });
          } else {
            let gameMasterId = this.gameConfig.gameMasterId;
            let gameMaster = this.gameMasterList.filter((o) => o.id == gameMasterId);
            if (gameMaster.length > 0) {
              this.maxItem = gameMaster[0].maxItem;
              this.minItem = gameMaster[0].minItem;
            } else {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Game is not exist. Please select again",
                type: "warning",
              });
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error occur when getting info. Please try again",
            type: "danger",
          });
        });
    },
    changeQuantity(value) {
      if (this.gameConfig.gameItems.length > value) {
        let start = value - 1;
        let spliceQuan = this.gameConfig.gameItems.length - value;
        this.gameConfig.gameItems.splice(start, spliceQuan);
      }
    },
    changeEndGame(val) {
      console.log(val);
      if (val === null) {
        console.log("hehe");
        this.gameConfig.endGame = this.gameConfig.startGame;
      }
    },
    changePromo(promotionId) {
      // let item = this.gameConfig.gameItems[index];
      // let promoId = item.promotionId;
      // let promo = this.promotion.filter((o) => o.promotionId == promoId)[0];
      // item.description = promo.description;
      // item.style = "";
      let tier = "";
      this.promotion.forEach((e) => {
        if (e.promotionId == promotionId) {
          tier = e.promotionTier;
        }
      });
      this.gameConfig.style = "";
      this.gameConfig.gameItems = [];
      this.tiers = [];
      if (tier.length > 0) {
        this.tiers = tier;

        tier.forEach((e) => {
          let colorIndex = this.colorIndex;
          let name = "";
          if (e.action) {
            this.isAction = true;
            name = e.action.name;
          } else {
            this.isAction = false;
            name = e.gift.name;
          }
          let item = {
            promotionTierId: e.promotionTierId,
            priority: 1,
            displayText: "",
            description: "",
            style: "",
            itemColor: this.predefineColors[colorIndex],
            textColor: "#FFFFFF",
            name: name,
            insDate: new Date().toLocaleString("vn", {
              timeZone: "Asia/Ho_Chi_Minh",
            }),
            updDate: new Date().toLocaleString("vn", {
              timeZone: "Asia/Ho_Chi_Minh",
            }),
          };
          this.gameConfig.gameItems.push(item);
          if (colorIndex < this.predefineColors.length - 1) {
            this.colorIndex++;
          } else {
            this.colorIndex = 2;
          }
        });
        if (this.isAction) {
          this.tiers.push({
            promotionTierId: this.emptyGuid,
            action: {
              name: "Good Luck",
            },
          });
        } else {
          this.tiers.push({
            promotionTierId: this.emptyGuid,
            gift: {
              name: "Good Luck",
            },
          });
        }
      }
    },
    checkExistPromotion(promotionId) {
      let result = true;
      let exist = this.promotion.filter((o) => o.promotionId == promotionId).length > 0;
      if (!exist) {
        this.$notify({
          icon: "el-icon-warning",
          title: "Error",
          message: "Promotion is not exist",
          type: "warning",
        });
        result = false;
      }
      return result;
    },
    updateConfig() {
      let items = this.gameConfig.gameItems;
      let countItem = items.length;
      console.log("update >>>>>>", this.gameConfig);
      if (countItem < this.minItem || countItem < this.gameConfig.quantity) {
        this.$notify({
          icon: "el-icon-warning",
          title: "Error",
          message: "Not enough Item for Game",
          type: "warning",
        });
        return;
      }

      let isValid = true;
      if (this.gameConfig.style !== "") {
        this.$notify({
          icon: "el-icon-warning",
          title: "Error",
          message: "Promotion is not exist",
          type: "warning",
        });
        return;
      }
      console.log(this.gameConfig.gameStyle);
      if (this.gameConfig.gameStyle !== undefined) {
        this.$notify({
          icon: "el-icon-warning",
          title: "Error",
          message: "Game is not exist",
          type: "warning",
        });
        return;
      }
      items.forEach((item) => {
        if (item.style !== undefined && item.style !== "") {
          isValid = false;
        }
      });
      if (!isValid) {
        this.$notify({
          icon: "el-icon-warning",
          title: "Error",
          message: "Promotion is not exist",
          type: "warning",
        });
      }
      this.$refs["gameConfigForm"].validate((valid) => {
        if (isValid) {
          isValid = valid;
        }
      });
      for (let i = 0; i < this.gameConfig.gameItems.length; i++) {
        let formName = "gameItemForm-" + i;
        let form = this.$refs[formName][0];
        form.validate((valid) => {
          console.log("valid of form " + valid);
          if (isValid) {
            isValid = valid;
          }
        });
      }
      if (isValid) {
        this.loading = true;
        this.$store.commit("game_campaign/setUpdateGameCampaign", this.gameConfig);
        this.$store
          .dispatch("game_campaign/updateGameCampaign")
          .then((result) => {
            this.loading = false;
            if (result.status != 200) {
              console.log(result.data.message);
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Error occur when Update. Please try again",
                type: "danger",
              });
            } else {
              this.$notify({
                icon: "el-icon-circle-check",
                title: "Success",
                message: "Update successfully",
                type: "success",
              });
              this.$router.push("/game-campaign").catch(() => {});
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when Update. Please try again",
              type: "danger",
            });
          });
      } else {
        window.scrollTo(0, 0);
        // this.$notify({
        //   icon: "el-icon-warning",
        //   title: "Error",
        //   message: "Please input required fields",
        //   type: "warning",
        // });
      }
    },
    activeChangeTextColor(index) {
      let color = this.$refs.textColorPicker[index].color.value;
      this.gameConfig.gameItems[index].textColor = color;
    },
    activeChangeItemColor(index) {
      let color = this.$refs.itemColorPicker[index].color.value;
      this.gameConfig.gameItems[index].itemColor = color;
    },
    handleDueDate(date) {
      let startGame = new Date(this.gameConfig.startGame);
      return !(date.getTime() > startGame.getTime());
    },
    changeStartGame() {
      if (this.gameConfig.endGame != "") {
        if (this.gameConfig.endGame <= this.gameConfig.startGame) {
          this.gameConfig.endGame = new Date(
            this.gameConfig.startGame + 24 * 60 * 60 * 1000
          );
        }
      } else {
        this.gameConfig.endGame = new Date(
          this.gameConfig.startGame.getTime() + 24 * 60 * 60 * 1000
        );
      }
    },
    removeItem(index) {
      this.gameConfig.gameItems.splice(index, 1);
      this.colorIndex--;
    },
    addItem() {
      if (this.gameConfig.gameItems.length < this.maxItem) {
        let item = {
          promotionId: "",
          priority: 1,
          displayText: "",
          description: "",
          itemColor: this.predefineColors[this.colorIndex],
          textColor: "#FFFFFF",
          insDate: new Date().toLocaleString("vn", {
            timeZone: "Asia/Ho_Chi_Minh",
          }),
          updDate: new Date().toLocaleString("vn", {
            timeZone: "Asia/Ho_Chi_Minh",
          }),
        };
        if (this.promotion.length > 0) {
          let promo = this.promotion[0];
          item.promotionId = promo.promotionId;
          item.description = promo.description;
        }
        this.gameConfig.gameItems.push(item);
        if (this.colorIndex < this.predefineColors.length - 1) {
          this.colorIndex++;
        } else {
          this.colorIndex = 2;
        }
        this.$store.commit("game_campaign/setGameCampaignInfo", this.gameConfig);
      } else {
        this.$notify({
          icon: "el-icon-warning",
          title: "Error",
          message: "Enough quantity of item",
          type: "warning",
        });
      }
    },
    async getPromoForGameCampaign() {
      this.loading = true;
      await this.$store
        .dispatch("game_campaign/getPromoForGameCampaign")
        .then((result) => {
          if (result.status != 200) {
            console.log(result.data.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when getting Promotion. Please try again",
              type: "danger",
            });
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.message);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error occur when getting Promotion. Please try again",
            type: "danger",
          });
        });
    },
    changeGameMaster(value) {
      this.gameConfig.gameStyle = "";
      var gameMaster = this.gameMasterList.filter((o) => o.id == value)[0];
      this.minItem = gameMaster.minItem;
      this.maxItem = gameMaster.maxItem;
      // this.gameConfig.gameItems = [];
      this.setupGameCampaignQuantity();
    },
    setupGameCampaignQuantity() {
      this.loading = true;
      if (this.gameConfig.quantity < this.minItem) {
        this.gameConfig.quantity = this.minItem;
      } else if (this.gameConfig.quantity > this.maxItem) {
        this.gameConfig.quantity = this.maxItem;
      }
      this.loading = false;
    },
    async getGameMaster() {
      this.loading = true;
      await this.$store
        .dispatch("game_campaign/getGameMasterList")
        .then((result) => {
          if (result.status != 200) {
            console.log(result.data.message);
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error occur when getting Game Master. Please try again",
              type: "danger",
            });
          }

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err.message);
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error occur when getting Game Master. Please try again",
            type: "danger",
          });
        });
    },
  },
};
</script>
<style>
.custom-divider {
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>
