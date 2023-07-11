<template>
  <div>
    <div class="card-body">
      
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BTooltipDirective from "bootstrap-vue";

Vue.use(VueClipboard);
export default {
  name: "promotion-action",
  directives: {
    "b-tooltip": BTooltipDirective,
  },
  props: {
    promotionTier: Array,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style></style>
