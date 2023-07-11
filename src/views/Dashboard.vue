<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pt-8">
      <!-- Card stats -->
      <div class="row">
        <div class="col-xl-3 col-lg-6">
          <a href="#">
            <stats-card v-loading="loading" title="Total promotion" class="mb-4 mb-xl-0">
              <template slot="footer" class="mt-0 mb-0">
                <p class="mt-0 mb-0" style="font-size: 2.5vw; color: black">
                  {{ promotionByStatus.totalPromotion }}
                </p>
              </template>
            </stats-card>
          </a>
        </div>
        <div class="col-xl-3 col-lg-6">
          <a href="#"
            ><stats-card
              v-loading="loading"
              title="Running promotion "
              type="gradient-red"
              class="mb-4 mb-xl-0"
              style="background: rgb(192, 255, 184)"
            >
              <template slot="footer" class="mt-0 mb-0">
                <p class="mt-0 mb-0" style="font-size: 2.5vw; color: black">
                  {{ promotionByStatus.publishPromotion }}
                </p>
              </template>
            </stats-card></a
          >
        </div>
        <div class="col-xl-3 col-lg-6">
          <a href="#"
            ><stats-card
              v-loading="loading"
              title="Expired promotion"
              type="gradient-green"
              class="mb-4 mb-xl-0"
              style="background: rgb(255, 171, 171)"
            >
              <template slot="footer" class="mt-0 mb-0">
                <p class="mt-0 mb-0" style="font-size: 2.5vw; color: black">
                  {{ promotionByStatus.expiredPromotion }}
                </p>
              </template>
            </stats-card></a
          >
        </div>
        <div class="col-xl-3 col-lg-6">
          <a href="#">
            <stats-card
              v-loading="loading"
              title="Draft promotion"
              type="gradient-info"
              class="mb-4 mb-xl-0"
              style="background: rgb(230, 225, 215)"
            >
              <template slot="footer" class="mt-0 mb-0">
                <p class="mt-0 mb-0" style="font-size: 2.5vw; color: black">
                  {{ promotionByStatus.draftPromotion }}
                </p>
              </template>
            </stats-card></a
          >
        </div>
      </div>
    </base-header>
  </div>
</template>
<script>
export default {
  created() {
    let user = this.$session.get("user-info");
    let brandId = user.brandId;
    this.$store.commit("dashboard/setBrandId", brandId);
    this.countPromotion();
  },
  computed: {
    promotionByStatus() {
      return this.$store.state.dashboard.countByStatus;
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    //# get Promotion: toal, publish, expired, draft
    countPromotion() {
      this.$store
        .dispatch("dashboard/countByStatus")
        .then(() => {
          this.loading = false;
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
