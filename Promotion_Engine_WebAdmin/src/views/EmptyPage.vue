<template>
  <div></div>
</template>

<script>
export default {
  methods: {},
  beforeCreate() {
    if (this.$session.exists()) {
      this.$session.destroy();
    }
    this.$store.commit("account/setUserInfo", null);
    this.$router.push("/login").catch(() => {});
  },
};
</script>

<style></style>
