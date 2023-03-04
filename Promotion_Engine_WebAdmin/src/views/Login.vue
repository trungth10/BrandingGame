<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Sign in with credentials</small>
          </div>
          <form role="form">
            <base-input
              class="input-group-alternative mb-3"
              placeholder="Username"
              addon-left-icon="ni ni-email-83"
              v-model="loginForm.username"
              v-on:keydown.enter="login"
            >
            </base-input>

            <base-input
              class="input-group-alternative"
              placeholder="Password"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
              v-model="loginForm.password"
              v-on:keydown.enter="login"
            >
            </base-input>
            <el-alert v-show="error" :title="error" type="error"> </el-alert>
            <!-- <base-checkbox class="custom-control-alternative">
              <span class="text-muted">Remember me</span>
            </base-checkbox> -->

            <div class="text-center">
              <base-button @click="login" type="primary" class="my-4"
                >Sign in</base-button
              >
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light"><small>Forgot password?</small></a>
        </div>
        <div class="col-6 text-right">
          <router-link to="/register" class="text-light"
            ><small>Create new account</small></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    error() {
      return this.$store.state.account.error;
    },
  },
  beforeCreate() {
    if (this.$session.exists()) {
      let session = JSON.parse(sessionStorage.getItem("vue-session-key"));
      let user = session["user-info"];
      if (user != null && user.roleName != undefined) {
        if (user.roleName == this.$ENV.ROLE.ADMIN) {
          this.$router.push("/admin").catch(() => {});
        } else {
          this.$router.push("/");
        }
      } else {
        this.$router.push("/login").catch(() => {});
      }
    }
  },
  methods: {
    login() {
      this.$store.commit("account/setLoginForm", this.loginForm);
      console.log("1");
      this.$store
        .dispatch("account/login")
        .then(() => {
          let user = this.$store.state.account.userInfo;
          console.log("2: ", user);
          if (user != null && user != undefined) {
            this.$session.start();
            this.$session.set("user-info", user);

            this.$store.commit("profile/setUsername", this.loginForm.username);
            this.$router.push("/").catch(() => {});
          }
        })
        .catch(() => {
          this.$router.push("/login").catch(() => {});
        });
    },
  },
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
};
</script>
<style></style>
