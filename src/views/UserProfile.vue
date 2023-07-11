<template>
  <div>
    <base-header v-loading="loadingImage" :class="headerClass" :style="headerStyle">
      <!-- Mask -->
      <span class="mask opacity-2"></span>
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row mt-5">
          <div class="col-lg-12 col-md-10 mt-9">
            <el-button
              icon="el-icon-camera-solid"
              class="mt-5 opacity-4"
              type="info"
              plain
              @click="$refs.fileInput.click()"
              ><i class="bi bi-camera"></i> Upload Image
            </el-button>

            <input
              style="display: none"
              ref="fileInput"
              type="file"
              @change="chooseImage"
              enctype="multipart/form-data"
              accept="image/*"
            />
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-11 order-xl-1">
          <el-form
            :label-position="formPosition"
            :model="userProfile"
            :rules="rules"
            ref="userProfile"
            label-width="120px"
            class="demo-ruleForm"
          >
            <card shadow type="secondary" v-loading="loading">
              <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">My Profile</h3>
                  </div>
                  <div class="col-4 text-right">
                    <el-button
                      v-if="!isEdit"
                      size="small"
                      icon="el-icon-edit-outline"
                      type="primary"
                      @click="editProfile"
                      >Edit</el-button
                    >
                    <el-button
                      v-if="isEdit"
                      size="small"
                      icon="el-icon-circle-close"
                      type="info"
                      @click="cancelEdit('userProfile')"
                      >Close</el-button
                    >
                    <el-button
                      size="small"
                      icon="el-icon-document-checked"
                      type="primary"
                      v-if="!isDisable"
                      @click="saveProfile('userProfile')"
                      v-loading="loadingSave"
                      >Save</el-button
                    >
                  </div>
                </div>
              </div>
              <template>
                <!-- Brand -->
                <h6 class="heading-small text-muted mb-4">Brand information</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-4">
                      <el-form-item label="Brand Code" prop="brandCode">
                        <label
                          ><b> {{ userProfile.brandCode }} </b></label
                        >
                      </el-form-item>
                    </div>
                    <div class="col-lg-8">
                      <el-form-item label="Brand name" prop="brandName">
                        <label v-if="isDisable">
                          <b> {{ userProfile.brandName }}</b>
                        </label>
                        <el-input
                          v-if="!isDisable"
                          input-classes="form-control-alternative"
                          v-model="userProfile.brandName"
                      /></el-form-item>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-4">
                      <el-form-item label="Company" prop="companyName">
                        <label v-if="isDisable">
                          <b> {{ userProfile.companyName }}</b>
                        </label>
                        <el-input v-model="userProfile.companyName" v-if="!isDisable"
                      /></el-form-item>
                    </div>
                    <div class="col-lg-4">
                      <el-form-item label="Email" prop="brandEmail">
                        <label v-if="isDisable">
                          <b>{{ userProfile.brandEmail }}</b>
                        </label>
                        <el-input v-model="userProfile.brandEmail" v-if="!isDisable"
                      /></el-form-item>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <el-form-item label="Address" prop="address">
                        <label v-if="isDisable">
                          <b> {{ userProfile.address }}</b>
                        </label>
                        <el-input v-model="userProfile.address" v-if="!isDisable"
                      /></el-form-item>
                    </div>
                    <div class="col-lg-4">
                      <el-form-item label="Hotline" prop="phoneNumber">
                        <label v-if="isDisable">
                          <b> {{ userProfile.phoneNumber }}</b>
                        </label>
                        <el-input
                          type="number"
                          v-model="userProfile.phoneNumber"
                          v-if="!isDisable"
                      /></el-form-item>
                    </div>
                  </div>
                </div>
                <hr class="my-4" />
                <h6 class="heading-small text-muted mb-4">About Brand</h6>
                <div class="pl-lg-4">
                  <div class="form-group">
                    <base-input label="Discription" alternative="">
                      <textarea
                        v-model="userProfile.description"
                        :disabled="isDisable"
                        rows="4"
                        class="form-control form-control-alternative"
                        placeholder="A few words about you ..."
                      ></textarea>
                    </base-input>
                  </div>
                </div>
              </template>
            </card>
          </el-form>
        </div>
        <div class="col-xl-11 order-xl-1 mt-2">
          <card shadow type="" v-loading="loading">
            <h6 class="heading-small text-muted mb-4">Account</h6>
            <div class="pl-lg-4">
              <el-table
                v-loading="loading"
                :data="userProfile.account"
                style="width: 100%"
                class="mb-2"
                stripe
              >
                <el-table-column
                  label="No."
                  type="index"
                  width="45"
                  align="right"
                  fixed
                />
                <el-table-column label="Name" prop="brand" width="330">
                  <template slot-scope="scope">
                    {{ scope.row.lastName + " " + scope.row.firstName }}
                  </template>
                </el-table-column>
                <el-table-column label="Username" prop="username" width="280" />

                <el-table-column label="Phone" prop="phoneNumber" width="330">
                  <template slot-scope="scope">
                    {{ scope.row.phoneNumber }}
                  </template>
                </el-table-column>
                <el-table-column label="Email" prop="email" width="330">
                  <template slot-scope="scope">
                    {{ scope.row.email }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="Active"
                  prop="isActive"
                  fixed="right"
                  align="right"
                >
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.isActive" type="success" class="mr-3">
                      {{ scope.row.isActive | statusFilter }}
                    </el-tag>
                    <el-tag v-if="!scope.row.isActive" type="danger" class="mr-3">
                      {{ scope.row.isActive | statusFilter }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div class="col-12 text-right">
                <el-button
                  v-if="!isEdit"
                  size="small"
                  icon="el-icon-circle-plus-outline"
                  type="primary"
                  @click="addAccount"
                  >Add</el-button
                >
              </div> -->
            </div></card
          >
        </div>
      </div>
    </div>
    <el-dialog
      title="Account Information"
      :visible.sync="accountDialog"
      width="70%"
      :before-close="handleClose"
    >
      <el-form>
        <div class="pl-lg-4">
          <div class="row">
            <div class="col-lg-4">
              <el-form-item label="First Name" prop="firstName">
                <el-input v-model="account.firstName" />
              </el-form-item>
            </div>
            <div class="col-lg-4">
              <el-form-item label="Last Name" prop="lastName">
                <el-input v-model="account.lastName" />
              </el-form-item>
            </div>

            <div class="col-lg-4">
              <el-form-item label="Phone No" prop="phoneNumber"
                ><el-input
                  type="number"
                  input-classes="form-control-alternative"
                  v-model.number="account.phoneNumber"
              /></el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4">
              <el-form-item label="Username" prop="username">
                <el-input v-model="account.username" />
              </el-form-item>
            </div>
            <div class="col-lg-8">
              <el-form-item label="Email" prop="email">
                <el-input v-model="account.email" />
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="accountDialog = false">Cancel</el-button>
        <el-button type="primary" @click="accountDialog = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "user-profile",

  data() {
    return {
      account: {},
      loading: true,
      loadingImage: true,
      loadingSave: false,
      isDisable: true,
      accountDialog: false,
      headerClass: "header pb-8 pt-5 pt-lg-8 d-flex align-items-center img-fluid",
      rules: {
        brandEmail: [
          {
            required: true,
            message: "Please input Email",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Please input correct email format",
            trigger: ["blur", "change"],
          },
          // {
          //   validator: validatorEmail,
          //   trigger: ["blur", "change"],
          // },
        ],
        firstName: [
          {
            required: true,
            message: "Please input First name",
            trigger: "change",
          },
        ],
        lastName: [
          {
            required: true,
            message: "Please input Last name",
            trigger: "change",
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: "Please input Number",
            trigger: "change",
          },
        ],
        brandName: [
          {
            required: true,
            message: "Please input Brand Name",
            trigger: "change",
          },
        ],
        companyName: [
          {
            required: true,
            message: "Please input Company Name",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "Please input Address",
            trigger: "change",
          },
        ],
      },
      isEdit: false,
      image: "",
      imageData: null,
      headerStyle: "",
      formPosition: "left",
    };
  },
  created() {
    this.getProfile();
  },
  computed: {
    userProfile() {
      return this.$store.state.profile.profile;
    },
  },
  methods: {
    getProfile() {
      this.$store
        .dispatch("profile/getProfile")
        .then(
          () => {
            this.loading = false;
            this.headerStyle =
              "min-height: 600px; background-size: cover; background-position: center top; background-image: url(" +
              this.userProfile.imgUrl +
              "); ";
            this.loadingImage = false;
          },
          (error) => {
            this.loading = false;
            this.message =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
          }
        )
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
    editProfile() {
      this.isDisable = false;
      this.isEdit = true;
      this.formPosition = "top";
    },
    saveProfile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isEdit = false;
          this.loadingSave = true;
          console.log("Image: ", this.userProfile.imgUrl);
          this.$store.commit("profile/setProfile", this.userProfile);
          this.$store
            .dispatch("profile/saveProfile")
            .then(
              () => {
                this.loadingSave = false;
                this.isDisable = true;
                this.formPosition = "left";
              },
              (error) => {
                this.loadingSave = false;
                this.message =
                  (error.response && error.response.data) ||
                  error.message ||
                  error.toString();
              }
            )
            .catch((err) => {
              this.loading = false;
              this.$message({
                message: err.message + ", please try again.",
                type: "error",
              });
            });
        } else {
          this.openErrMsg();
          return false;
        }
      });
    },
    chooseImage(evt) {
      evt.preventDefault();
      console.log(evt);
      this.imageData = evt.target.files[0];
      this.uploadImage();
    },
    async uploadImage() {
      this.image = null;
      this.loadingImage = true;
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          this.loadingImage = false;
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.image = url;
            this.saveImage();
            this.headerStyle =
              "min-height: 600px; background-size: cover; background-position: center top; background-image: url(" +
              this.image +
              "); ";
            this.loadingImage = false;
          });
        }
      );
    },
    addAccount() {
      this.accountDialog = true;
    },
    saveImage() {
      this.isEdit = false;
      this.loadingSave = true;
      console.log("Image: ", this.userProfile.imgUrl);
      this.$store.commit("profile/setNewImg", this.image);
      this.$store
        .dispatch("profile/saveProfileImage")
        .then(
          () => {
            this.loadingImage = false;
            this.isDisable = true;
          },
          (error) => {
            this.loadingImage = false;
            this.message =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
          }
        )
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    },
    handleClose() {
      this.accountDialog = false;
    },
    openErrMsg() {
      this.$message.error("Please fill all fields!");
    },
    cancelEdit(formName) {
      this.formPosition = "left";
      this.$refs[formName].resetFields();
      this.loading = true;
      this.getProfile();
      this.isDisable = true;
      this.isEdit = false;
    },
  },
  filters: {
    statusFilter(value) {
      if (value) {
        return "Active";
      } else {
        return "Disable";
      }
    },
  },
};
</script>
<style>
.has-success:after {
  content: "";
  background-color: transparent;
}
.has-danger:after {
  content: "";
  background-color: transparent;
}
</style>
