<template>
  <div v-loading="loading">
    <el-form
      label-position="top"
      :model="brandProfile"
      :rules="rules"
      ref="brandRegister"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-12">
            <el-form-item label="Brand name" prop="brandName"
              ><el-input
                input-classes="form-control-alternative"
                v-model="brandProfile.brandName"
            /></el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <el-form-item label="Address" prop="address"
              ><el-input v-model="brandProfile.address"
            /></el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <el-form-item label="Brand Code" prop="brandCode">
              <el-input v-model="brandProfile.brandCode"
            /></el-form-item>
          </div>
          <div class="col-lg-8">
            <el-form-item label="Hotline" prop="phoneNumber">
              <el-input type="number" v-model="brandProfile.phoneNumber"
            /></el-form-item>
          </div>
          <div class="col-lg-12">
            <el-form-item label="Company Name" prop="companyName"
              ><el-input v-model="brandProfile.companyName"
            /></el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  methods: {
    nextToFinish(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.$store.commit("account/setBrandProfile", this.brandProfile);
          console.log(this.$store.state.account.userProfile);
          this.loading = true;
          this.$store.dispatch("account/registerAccount").then(() => {
            this.loading = false;
            this.$emit("change-page", 3);
          });
        } else {
          this.$message.error("Please input required fields");
          return false;
        }
      });
    },
  },
  data() {
    return {
      loading: false,
      brandProfile: {
        brandCode: "",
        phoneNumber: "",
        brandName: "",
        companyName: "",
        address: "",
      },
      rules: {
        brandCode: [
          {
            required: true,
            message: "Please input Brand Code",
            trigger: ["blur", "change"],
          },
        ],
        brandName: [
          {
            required: true,
            message: "Please input Brand Name",
            trigger: ["blur", "change"],
          },
        ],
        companyName: [
          {
            required: true,
            message: "Please input Company Name",
            trigger: ["blur", "change"],
          },
        ],
        address: [
          {
            required: true,
            message: "Please input Address",
            trigger: ["blur", "change"],
          },
        ],
        hotline: [
          {
            required: true,
            message: "Please input Hotline",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
};
</script>

<style></style>
