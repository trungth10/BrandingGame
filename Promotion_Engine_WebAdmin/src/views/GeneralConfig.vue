<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-7" />
    <div class="ml-4 mr-4 mb-4 p-4 mt--7">
      <device-table />
      <product-cate-table />
      <product-table />
      <member-level-table />
    </div>
  </div>
</template>
<script>
import ProductCateTable from "./GeneralConfig/ProductCateTable.vue";
import MemberLevelTable from "./GeneralConfig/MemberLevelTable.vue";
import ProductTable from "./GeneralConfig/ProductTable.vue";
import DeviceTable from "./GeneralConfig/DeviceTable.vue";
export default {
  components: { ProductCateTable, MemberLevelTable, ProductTable, DeviceTable },
  watch: {},
  data() {
    return {};
  },
  methods: {},
  props: {},
  created() {
    let user = this.$session.get("user-info");
    if (user != undefined) {
      let brandId = user.brandId;
      if (brandId != undefined) {
        this.$store.commit("device/setBrandId", brandId);
        this.$store.commit("product/setBrandId", brandId);
        this.$store.commit("product_cate/setBrandId", brandId);
        this.$store.commit("member_level/setBrandId", brandId);
      } else {
        this.$router.push("/login").catch(() => {});
      }
    } else {
      this.$router.push("/login").catch(() => {});
    }
  },
};
</script>
<style>
</style>