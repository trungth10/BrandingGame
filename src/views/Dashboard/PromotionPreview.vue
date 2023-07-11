<template>
  <div class="container">
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-container v-loading="loading">
        <el-aside width="20vw">
          <el-image
            class="image"
            :src="promotion.imgUrl"
            :alt="promotion.imgUrl"
          ></el-image>
        </el-aside>
        <el-container class="promotion">
          <el-row>
            <el-col class="title">
              <h1>
                {{ promotion.promotionName }}
              </h1>
            </el-col>
            <el-col>
              <el-main>
                <div>
                  <h3>
                    Apply from {{ promotion.startDate | dateFormat }} to
                    {{ promotion.endDate | dateFormat }}
                  </h3>
                </div>
                <div><h3>Apply for Store</h3></div>
                <div>
                  <h3>Conditions Apply</h3>
                  <ul>
                    <li>Payment: {{ promotion.paymentMethod }}</li>
                    <li>Sale mode: {{ promotion.saleMode | salemode }}</li>
                    <li>Membership</li>
                    <li>Gender</li>
                    <li>Conditions and actions</li>
                    <li>Apply by: {{ promotion.applyBy | applyBy }}</li>
                    <li>Limit per day: {{ promotion.limitCount }}</li>
                    <li>
                      Exclusive: {{ promotion.exclusive | exclusiveRule }}
                    </li>
                  </ul>
                </div>
              </el-main>
            </el-col>
          </el-row>
        </el-container>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "promotion-preview",
  props: {
    title: String,
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      promotion: {},
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.$store.dispatch("dashboard/getPromotionPreview").then(
        () => {
          this.promotion = this.$store.state.dashboard.promotionPreview;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
  filters: {
    salemode(value) {
      let saleModes = [];
      let eatIn = 1;
      let takeAway = 2;
      let delivery = 4;
      if ((value & eatIn) == eatIn) {
        saleModes.push("Eat-in");
      }
      if ((value & takeAway) == takeAway) {
        saleModes.push("Take Away");
      }
      if ((value & delivery) == delivery) {
        saleModes.push("Delivery");
      }
      let result = "";
      if (saleModes.length == 1) return (result += saleModes[0]);
      for (let index = 0; index < saleModes.length -1; index++) {
        result += saleModes[index] + ', '
      }
      result += 'and ' + saleModes[saleModes.length -1]
      return result;
    },
    dateFormat(value) {
      if (value) {
        return moment(value).format("HH:mm DD/MM/YYYY");
      }
    },
    applyBy(value) {
      switch (value) {
        case "1":
          return "In-store";
        case "2":
          return "Online";
      }
    },
    exclusiveRule(value) {
      switch (value) {
        case "0":
          return "This promotion can be combined with other promotions.";
        case "1":
          return "This promotion cannot be combined with other promotions.";
        case "2":
          return "This promotion cannot be combined with a promotion of the same promotion level. ";
      }
    },
  },
};
</script>

<style lang="scss">
.promotion li {
  word-break: keep-all;
}
.title h1 {
  font-size: 35px;
  text-align: center;
  font-weight: bold;
  word-break: keep-all;
}
.el-footer {
  background-color: #b94f73;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
  text-align: center;
}

.el-main {
  color: #333;
  text-align: left;
  line-height: 3vh;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.el-main::-webkit-scrollbar {
  display: none;
}

body > .el-container {
  margin-bottom: 40vh;
}
</style>
