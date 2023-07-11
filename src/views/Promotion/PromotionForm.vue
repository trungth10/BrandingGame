<template>
  <div>
    <base-header type="gradient-success" class="pb-6 mb-2 pt-1"> </base-header>

    <div class="container-fluid">
      <el-row>
        <div class="card shadow mt-3 pt-3 pb-2 pr-0 pl-0">
          <div class="bg-transparent">
            <el-steps :active="formIndex" finish-status="success" align-center>
              <el-step title="Select promotion type"></el-step>
              <el-step title="Setting"></el-step>
              <!-- <el-step title="3. Action Builder"></el-step> -->
              <el-step title="Save & Finish"></el-step>
            </el-steps>
          </div>
        </div>
      </el-row>
      <el-row>
        <promotion-type @change-page="changeForm" ref="type" v-show="formIndex == 0" />
        <promotion-configuration
          @change-page="changeForm"
          ref="configuration"
          v-show="formIndex == 1"
        />
        <promotion-preview v-loading="loading" v-show="formIndex == 2" />
      </el-row>
      <div class="card shadow mt-3 pt-3 pb-3 pr-4 pl-4">
        <div class="bg-transparent">
          <el-row class="ml-0">
            <el-col v-if="formIndex > 0" :span="2">
              <el-button @click="back" type="info"> Back </el-button>
            </el-col>
            <el-col v-if="formIndex < 2" :span="3">
              <el-button @click="nextStep" type="primary"> Next step </el-button>
            </el-col>
            <el-col v-if="formIndex == 2" :span="3">
              <el-button @click="finish" type="primary" v-loading="loading">
                Save & Finish
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PromotionType from "./PromotionForm/PromotionType.vue";
import PromotionConfiguration from "./PromotionForm/PromotionConfiguration.vue";
import PromotionPreview from "./PromotionForm/PromotionPreview.vue";

export default {
  name: "wizard",
  components: {
    PromotionType,
    PromotionConfiguration,
    PromotionPreview,
  },
  created() {
    let user = this.$session.get("user-info");
    if (user != undefined) {
      let brandId = user.brandId;
      if (brandId != undefined) {
        this.$store.commit("stores/setBrandId", brandId);
      } else {
        this.$router.push("/login").catch(() => {});
      }
    } else {
      this.$router.push("/login").catch(() => {});
    }
  },
  data() {
    return {
      formIndex: 0,
      loading: false,
      route: {
        path: "/campaign/promotion/wizard",
      },
      promotionType: true,
      isSaved: false,
    };
  },
  methods: {
    nextStep() {
      switch (this.formIndex) {
        case 0:
          this.$refs.type.nextStep("promotionTypeForm");
          this.backTop();
          break;
        case 1:
          this.$refs.configuration.nextStep("configurationForm");
          this.backTop();
          break;
        case 2:
          this.$refs.configuration.nextStep("");
          break;
      }
    },
    changeForm(formIndex) {
      this.formIndex = formIndex;
    },
    backTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    back() {
      this.formIndex--;
    },
    finish() {
      this.$refs.configuration.saveNewDraft();
      // this.$alert("Congras! Save promotion successful!", "SUCCESSFUL!", {
      //   confirmButtonText: "Great!",
      //   callback: () => {
      //     this.$router.push("/campaign/promotion");
      //   },
      // });
    },
  },
};
</script>

<style></style>
