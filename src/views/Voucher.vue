<template>
  <div>
    <base-header type="gradient-success" class="pb-8 pt-5 pt-md-8"> </base-header>

    <div class="container-fluid mt--9">
      <div class="card shadow">
        <div class="card-header bg-transparent promotion">
          <el-row>
            <el-col :span="8" class="mt-2">
              <h2 class="mb-0">Manage Voucher</h2>
            </el-col>
            <el-col :span="2" class="float-right mt-1">
              <el-button size="medium" type="success" @click="addPromotion" icon="el-icon-plus"
                >New Voucher</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
      <el-row class="mt-3">
        <voucher-group-table />
      </el-row>
    </div>
  </div>
</template>
<script>
import VoucherGroupTable from "./Voucher/VoucherGroupTable.vue";
export default {
  data() {
    return {};
  },
  created() {
    // let user = this.$session.get("user-info");
    // if (user != undefined) {
    //   let brandId = user.brandId;
    //   if (brandId != undefined) {
    //     this.$store.commit("voucher/setBrandId", brandId);
    //     this.countPromotion();
    //   } else {
    //     this.$router.push("/login").catch(() => {});
    //   }
    // } else {
    //   this.$router.push("/login").catch(() => {});
    // }
  },
  components: {
    //# VoucherGroupTable
    VoucherGroupTable,
  },
  methods: {
    addPromotion() {
      // window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/"); ---> Quay lai trang truoc
      this.$router.push("/campaign/voucher/wizard");
    },
  },
};
</script>
<style>
.el-icon-circle-plus {
  font-size: 2.5vh;
}
.promotion .el-button {
  border: 0px;
  float: right;
  background-color: #2dcecc;
}
</style>
