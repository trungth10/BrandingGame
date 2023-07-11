<template>
  <div class="row justify-content-center">
    <div class="col-lg-12 col-md-7">
      <div class="card bg-secondary shadow border-0">
        <base-header
          v-if="promotionDetail.imgUrl != ''"
          v-loading="loadingImage"
          :class="headerClass"
          :style="headerStyle"
        >
          <!-- Mask -->
          <span class="mask opacity-2"></span>
          <!-- Header container -->
        </base-header>
        <div class="container-fluid">
          <div class="row justify-content-md-center">
            <div class="col-xl-8 order-xl-1">
              <el-form :model="customerProfile" :rules="rules" ref="customerProfile">
                <card v-loading="loading" shadow type="secondary">
                  <template>
                    <h3 class="heading-small mb-1">
                      <h1>{{ promotionDetail.promotionName }}</h1>
                    </h3>
                    <h4>Mô tả:</h4>
                    <el-row>
                      <el-col :span="24">
                        <pre>{{ promotionDetail.description }}</pre>
                      </el-col>
                    </el-row>
                    <div v-show="!isEmailSent">
                      <h6><span style="color: red">(*)</span> bắt buộc</h6>
                      <div class="pl-lg-4">
                        <div class="row">
                          <div class="col-lg-10">
                            <el-form-item label="Họ và Tên" prop="fullName">
                              <el-input v-model="customerProfile.fullName" />
                            </el-form-item>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-10">
                            <el-form-item label="Giới tính" prop="gender"
                              ><el-radio-group v-model="customerProfile.gender">
                                <el-radio label="Male">Nam</el-radio> <br />
                                <el-radio label="Female">Nữ</el-radio><br />
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-10">
                            <el-form-item label="Số điện thoại" prop="phoneNumber">
                              <el-input
                                type="text"
                                input-classes="form-control-alternative"
                                v-model="customerProfile.phoneNumber"
                            /></el-form-item>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-10">
                            <el-form-item label="Email" prop="email">
                              <el-input v-model="customerProfile.email" />
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-show="isEmailSent" class="mt-3 pl-lg-4">
                      <div v-show="!isAllDistributed">
                        <h3>
                          Chúng tôi đã gửi voucher tới email của bạn
                          <a href="https://mail.google.com/" target="_blank">
                            {{ customerProfile.email }}</a
                          >. Hi vọng bạn sẽ tận hưởng chương trình này.
                        </h3>
                        <h4 class="float-right mr-4">Cảm ơn!</h4>
                      </div>
                      <div v-show="isAllDistributed">
                        <h3>
                          Xin lỗi, Voucher đã được phát hết. Xin bạn hãy đợi những sự kiện
                          kế tiếp
                        </h3>
                      </div>
                    </div>
                  </template>
                </card>
              </el-form>
              <el-row v-show="!isEmailSent">
                <el-col :span="3" :offset="10" class="mt-3 mb-3">
                  <el-button
                    icon="el-icon-message"
                    @click="saveAndSendEmail('customerProfile')"
                    type="primary"
                    >Nhận qua Email</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "customer-form",
  data() {
    var validatorPhoneNo = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please input your Phone number"));
      } else {
        if (!value.match("^\\d{10}$")) {
          callback(new Error("This phone number is not valid"));
        } else {
          callback();
        }
        // callback();
      }
    };
    return {
      customerProfile: {},
      isEmailSent: false,
      isOutSession: false,
      loading: true,
      isAllDistributed: false,
      loadingImage: true,
      headerClass: "header d-flex center img-fluid mt-3",
      rules: {
        email: [
          {
            required: true,
            message: "Please input your email",
            trigger: ["blur", "change"],
          },
          {
            type: "email",
            message: "Please input correct email format",
            trigger: ["blur"],
          },
        ],
        fullName: [
          {
            required: true,
            message: "Please input your full name",
            trigger: ["blur", "change"],
          },
        ],
        gender: [
          {
            required: true,
            message: "Please input gender",
            trigger: ["blur", "change"],
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: "Please input phone number",
            trigger: ["blur", "change"],
          },
          {
            validator: validatorPhoneNo,
            trigger: ["blur", "change"],
          },
        ],
      },
      headerStyle: "",
    };
  },
  methods: {
    checkSessionTimeout() {
      this.$store.dispatch("customer/isExpiredUrl");
    },
    getPromotionDetail() {
      this.$store
        .dispatch("promotion_detail/getPromotionInfo")
        .then(() => {
          this.headerStyle =
            "min-height: 40vh; width:65vw; background-size: cover; margin-right:0; background-position: center top; background-image: url(" +
            this.promotionDetail.imgUrl +
            "); ";
          this.loadingImage = false;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
    async saveAndSendEmail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store.commit("customer/setCustomerForm", this.customerProfile);
          this.$store.dispatch("customer/saveCustomer").then((res) => {
            if (res != 200) {
              this.isAllDistributed = !this.isAllDistributed;
            }
            this.loading = false;
            this.isEmailSent = !this.isEmailSent;
          });
        } else {
          this.$message.error("Please input required fields");
          return false;
        }
      });
    },
  },

  created() {
    let id = this.$route.params.id;
    let channelCode = this.$route.params.channelCode;
    let tierId = this.$route.query.tierId;
    let sst = this.$route.query.sst;
    if (sst) {
      this.$store.commit("customer/setSst", sst);
      this.checkSessionTimeout();
      this.$store.commit("promotion_detail/setPromotionId", id);
      this.$store.commit("customer/setPromotionId", id);
      this.$store.commit("customer/setTierId", tierId);
      this.$store.commit("customer/setChannelCode", channelCode);
      this.getPromotionDetail();
    } else this.$router.push("/403");
  },
  computed: {
    promotionDetail() {
      // Lấy thông tin của promotion
      return this.$store.state.promotion_detail.promotionDetail;
    },
  },
};
</script>

<style>
#customer-form .el-radio__label {
  font-size: 18px;
}
#customer-form .el-radio__inner {
  width: 18px;
  height: 18px;
}

#customer-form .el-radio {
  margin-bottom: 17px;
}
pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  font-size: 1vw;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
