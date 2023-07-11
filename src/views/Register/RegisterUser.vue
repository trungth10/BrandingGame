<template>
  <div>
    <el-form
      label-position="top"
      :model="userProfile"
      :rules="rules"
      ref="userRegister"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-12">
            <el-form-item label="Username" prop="username">
              <el-input v-model="userProfile.username" />
            </el-form-item>
            <div v-loading="loadCheckUsername"></div>
          </div>
          <div class="col-lg-12">
            <el-form-item label="Password" prop="password">
              <el-input v-model="userProfile.password" type="password" />
            </el-form-item>
            <ul v-show="userProfile.password != ''">
              <li>
                Contain 8 - 16 characters
                <i
                  v-show="validPassword.isValidLength"
                  class="el-icon-check"
                  style="color: green"
                ></i>
                <i
                  v-show="!validPassword.isValidLength"
                  class="el-icon-close"
                  style="color: red"
                ></i>
              </li>
              <li>
                Contain at least 1 number
                <i
                  v-show="validPassword.isValidContainNumber"
                  class="el-icon-check"
                  style="color: green"
                ></i>
                <i
                  v-show="!validPassword.isValidContainNumber"
                  class="el-icon-close"
                  style="color: red"
                ></i>
              </li>
              <li>
                Contain at least 1 character
                <i
                  v-show="validPassword.isValidContainChar"
                  class="el-icon-check"
                  style="color: green"
                ></i>
                <i
                  v-show="!validPassword.isValidContainChar"
                  class="el-icon-close"
                  style="color: red"
                ></i>
              </li>
              <li>
                Contain at least 1 special character
                <i
                  v-show="validPassword.isValidContainSpecialChar"
                  class="el-icon-check"
                  style="color: green"
                ></i>
                <i
                  v-show="!validPassword.isValidContainSpecialChar"
                  class="el-icon-close"
                  style="color: red"
                ></i>
              </li>
            </ul>
          </div>
          <div class="col-lg-12">
            <el-form-item label="Password Confirm" prop="passwordConfirm">
              <el-input v-model="userProfile.passwordConfirm" type="password" />
            </el-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <el-form-item label="First Name" prop="firstName">
              <el-input v-model="userProfile.firstName" />
            </el-form-item>
          </div>
          <div class="col-lg-8">
            <el-form-item label="Last Name" prop="lastName">
              <el-input v-model="userProfile.lastName" />
            </el-form-item>
          </div>
          <div class="col-lg-12">
            <el-form-item label="Phone Number" prop="phoneNumber">
              <el-input type="number" v-model="userProfile.phoneNumber" maxlength="10" />
            </el-form-item>
          </div>
          <div class="col-lg-12">
            <el-form-item label="Email" prop="email">
              <el-input v-model="userProfile.email" />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var validatorPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please input your Password"));
      } else {
        this.handleChangePassword(value);
        if (
          !value.match(
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$"
          )
        ) {
          callback(
            new Error(
              "Password contain 8-16 characters, at least 1 character, at least 1 number and at least 1 special character"
            )
          );
        } else callback();
      }
    };
    var validatorPasswordConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please input your Password"));
      } else {
        if (value !== this.userProfile.password) {
          callback(new Error("Password is not match"));
        } else callback();
      }
    };
    var validatorEmail = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please input your email"));
      } else {
        if (!value.match("^[\\w-\\.]+@([\\w-]{3,}\\.)+[\\w-]{2,4}$")) {
          callback(new Error("Please enter valid email"));
        } else {
          await this.checkEmailExisiting(value).then(() => {
            if (this.isEmailExist) {
              callback(new Error("This Email is existing"));
            } else {
              callback();
            }
          });
        }
      }
    };
    var validatorUsername = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please input your Username"));
      } else {
        if (!value.match("^[a-z0-9_-]{6,25}$")) {
          callback(
            new Error(
              "The username is from 6-25 characters and do not contain special characters"
            )
          );
        }
        await this.checkUsernameExisting(value).then(() => {
          if (this.isUserNameExist) {
            callback(new Error("This Username is existing"));
          } else {
            callback();
          }
        });
      }
    };
    var validatorPhoneNo = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("Please input your Phone number"));
      } else {
        if (!value.match("^\\d{10}$")) {
          callback(new Error("This phone number is not valid"));
        } else {
          await this.checkPhoneExisiting(value).then(() => {
            if (this.isPhoneExist) {
              callback(new Error("This Phone number is existing"));
            } else {
              callback();
            }
          });
        }
      }
    };
    return {
      userProfile: {
        username: "",
        firstName: "",
        password: "",
        passwordConfirm: "",
        lastName: "",
        phoneNumber: "",
        email: "",
      },
      rules: {
        email: [
          {
            validator: validatorEmail,
            trigger: ["blur", "change"],
          },
          {
            required: true,
            message: "Please input Email",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: "Please input Username",
            trigger: "blur",
          },
          {
            validator: validatorUsername,
            trigger: ["blur"],
          },
        ],
        phoneNo: [
          {
            required: true,
            message: "Please input Phone number",
            trigger: "blur",
          },
          {
            validator: validatorPhoneNo,
            trigger: ["blur"],
          },
        ],
        password: [
          {
            validator: validatorPassword,
            trigger: "change",
          },
          {
            required: true,
            message: "Please input password",
            trigger: "blur",
          },
        ],
        passwordConfirm: [
          {
            validator: validatorPasswordConfirm,
            trigger: "change",
          },
          {
            required: true,
            message: "Please input password",
            trigger: "blur",
          },
        ],
        firstName: [
          {
            required: true,
            message: "Please input First name",
            trigger: ["blur", "change"],
          },
        ],
        lastName: [
          {
            required: true,
            message: "Please input Last name",
            trigger: ["blur", "change"],
          },
        ],
      },
      loadCheckUsername: false,
      validPassword: {
        isValidLength: false,
        isValidContainNumber: false,
        isValidContainChar: false,
        isValidContainSpecialChar: false,
      },
    };
  },
  computed: {
    isUserNameExist() {
      return this.$store.state.account.isUserNameExist;
    },
    isEmailExist() {
      return this.$store.state.account.isEmailExist;
    },
    isPhoneExist() {
      return this.$store.state.account.isPhoneExist;
    },
  },
  methods: {
    handleChangePassword(value) {
      if (value) {
        //Check length
        if (value.length >= 8 && value.length <= 16) {
          this.validPassword.isValidLength = true;
        } else {
          this.validPassword.isValidLength = false;
        }
        //Check contain at least number
        if (value.match("(?=.*?[0-9])")) {
          this.validPassword.isValidContainNumber = true;
        } else {
          this.validPassword.isValidContainNumber = false;
        }
        //Check contain character
        if (value.match("(?=.*?[a-zA-Z])")) {
          this.validPassword.isValidContainChar = true;
        } else {
          this.validPassword.isValidContainChar = false;
        }
        //Check contain special character
        if (value.match("(?=.*?[#?!@$%^&*-])")) {
          this.validPassword.isValidContainSpecialChar = true;
        } else {
          this.validPassword.isValidContainSpecialChar = false;
        }
      }
    },
    async checkUsernameExisting(value) {
      if (value) {
        this.$store.commit("account/setProfile", this.userProfile);
        await this.$store.dispatch("account/checkUsernameExisiting");
      }
    },
    async checkEmailExisiting(value) {
      if (value) {
        this.$store.commit("account/setProfile", this.userProfile);
        await this.$store.dispatch("account/checkEmailExisiting");
      }
    },
    async checkPhoneExisiting(value) {
      if (value) {
        this.$store.commit("account/setProfile", this.userProfile);
        await this.$store.dispatch("account/checkPhoneExisiting");
      }
    },
    nextToBrand(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.$store.commit("account/setProfile", this.userProfile);
          this.$emit("change-page", 1);
        } else {
          this.$message.error("Please input required fields");
          return false;
        }
      });
    },
  },
};
</script>
