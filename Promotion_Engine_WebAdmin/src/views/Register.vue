<template>
  <div class="row justify-content-center">
    <div class="col-lg-7 col-md-7" v-loading="loading">
      <div class="card bg-secondary shadow border-0">
        <div class="px-lg-5 py-lg-2">
          <div class="text-center text-muted mb-4">
            <small>Sign up your Brand</small>
            <div class="mt-3 pt-3 pb-2 pr-0 pl-0">
              <div class="bg-transparent">
                <el-steps :active="formIndex" finish-status="success" align-center>
                  <el-step title="User Information"></el-step>
                  <el-step title="Brand Information"></el-step>
                  <el-step title="Finish"></el-step>
                </el-steps>
              </div>
            </div>
          </div>
          <div>
            <div class="row">
              <div class="col-xl-11 order-xl-1">
                <template>
                  <register-user
                    @change-page="changeForm"
                    ref="userRegister"
                    v-show="formIndex == 0"
                  />
                  <register-brand
                    @change-page="changeForm"
                    @loading="load"
                    ref="brandRegister"
                    v-show="formIndex == 1"
                  ></register-brand>
                  <div class="text-center" v-show="formIndex == 3">
                    <h2>Congratulation!</h2>
                    <div>
                      <p>Your account has been sign up successfuly</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div>
          <el-button
            @click="next()"
            class="float-right mb-3 mr-7"
            type="success"
            style="width: 25vw"
            v-show="formIndex < 2"
          >
            Next
          </el-button>
          <el-button
            v-show="formIndex == 2"
            @click="register('userProfile')"
            class="float-right mb-3 mr-7"
            type="success"
            style="width: 25vw"
          >
            Register
          </el-button>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light">
            <small>Forgot password?</small>
          </a>
        </div>
        <div class="col-6 text-right">
          <router-link to="/login" class="text-light">
            <small>Login into your account</small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RegisterUser from "./Register/RegisterUser.vue";
import RegisterBrand from "./Register/RegisterBrand.vue";

export default {
  name: "register",
  components: {
    RegisterUser,
    RegisterBrand,
  },
  data() {
    return {
      loading: false,
      formIndex: 0,
    };
  },
  methods: {
    load(value) {
      this.loading = value;
    },
    changeForm(formIndex) {
      this.formIndex = formIndex;
    },
    next() {
      switch (this.formIndex) {
        case 0:
          this.$refs.userRegister.nextToBrand("userRegister");
          break;
        case 1:
          this.$refs.brandRegister.nextToFinish("brandRegister");
          break;
      }
    },
  },
};
</script>
<style></style>
