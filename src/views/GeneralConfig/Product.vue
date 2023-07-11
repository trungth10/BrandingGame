<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-7" />
    <div class="ml-4 mr-4 mb-4 p-4 mt--7">
      <product-table />
    </div>
  </div>
</template>

<script>
import ProductTable from "./ProductTable.vue";
export default {
  components: { ProductTable },
  created() {
    let user = this.$session.get("user-info");
    if (user != undefined) {
      let brandId = user.brandId;
      if (brandId != undefined) {
        this.$store.commit("product/setBrandId", brandId);
      } else {
        this.$router.push("/login").catch(() => {});
      }
    } else {
      this.$router.push("/login").catch(() => {});
    }
  },
  methods: {},
  props: {},
  watch: {},
  data() {
    return {};
  },
};
</script>

<style>
</style>