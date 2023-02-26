<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-7" />
    <div class="ml-4 mr-4 mb-4 p-4 mt--5 float-center">
      <admin-table />
    </div>
  </div>
</template>
<script>
import AdminTable from "./Admin/AdminTable.vue";
import AuthService from "../store/services/auth-service";
export default {
  beforeCreate() {
    let session = this.$session;
    let isValidation = AuthService.validation(session);
    if (!isValidation) {
      this.$router.push("/login").catch(() => {});
    } else {
      let user = session.get("user-info");
      if (user.roleName == this.$ENV.ROLE.ADMIN) {
        this.$router.push("/admin").catch(() => {});
      } else {
        this.$router.push("/");
      }
    }
  },
  data() {
    return {};
  },
  components: { AdminTable },
  methods: {},
};
</script>
<style></style>
