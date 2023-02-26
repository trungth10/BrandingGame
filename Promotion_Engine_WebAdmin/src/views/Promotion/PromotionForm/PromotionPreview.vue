<template>
  <div>
    <el-row class="mt-3" id="constraints">
      <div>
        <div class="card-header bg-transparent">
          <el-row>
            <el-col :span="10" class="mt-1"><h1>PREVIEW</h1></el-col>
            <el-col :offset="12" :span="2" class="mt-2">
              <a href="#"><i class="el-icon-question"></i> <span>Get Help</span></a>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row>
      <el-card shadow="always">
        <!-- <el-row>
          <el-col :span="12"
            ><h2>Name: {{ promotionTypeForm.promotionName }}</h2></el-col
          >
        </el-row> -->
        <el-row>
          <el-col :span="24"><b> Name: </b>{{ promotionTypeForm.promotionName }}</el-col>
        </el-row>
        <el-row class="mt-3">
          <el-col :span="12">
            <el-row>
              <el-col :span="10"> <b> Start Date: </b></el-col>
              <el-col :span="12">{{ promotionTypeForm.startDate | dateFormat }}</el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col :span="10"> <b> End Date: </b></el-col>

              <el-col :span="12">{{ promotionTypeForm.endDate | dateFormat }}</el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col :span="10"> <b> Exclusive:</b></el-col>
              <el-col :span="12">{{
                promotionConfigurationForm.exclusive | exclusiveFilter
              }}</el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col :span="10"> <b> Status:</b></el-col>
              <el-col :span="12">{{ promotionTypeForm.status | statusFilter }}</el-col>
            </el-row>
            <!-- <el-row class="mt-3">
              <el-col :span="10"> <b> Store count:</b></el-col>
              <el-col :span="12">
                {{
                  promotionConfigurationForm.storeApply == undefined
                    ? 0
                    : promotionConfigurationForm.storeApply.length
                }}
              </el-col>
            </el-row> -->
            <el-row class="mt-3">
              <el-col :span="10"><b> Payment methods:</b></el-col>
              <el-col :span="12">{{
                promotionConfigurationForm.paymentMethod == undefined
                  ? ""
                  : promotionConfigurationForm.paymentMethod.toString()
              }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="10"> <b> Sale mode:</b></el-col>
              <el-col :span="12">
                {{
                  promotionConfigurationForm.salesMode == undefined
                    ? ""
                    : promotionConfigurationForm.salesMode.toString()
                }}
              </el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col :span="10"> <b> Apply by: </b></el-col>
              <el-col :span="12">{{
                promotionConfigurationForm.applyBy == undefined
                  ? ""
                  : promotionConfigurationForm.applyBy.toString()
              }}</el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col :span="10"> <b> Available on holiday:</b></el-col>
              <el-col :span="12">{{ promotionConfigurationForm.isHolidayApply }}</el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col :span="10"> <b> Customer type:</b></el-col>
              <el-col :span="12">{{
                promotionConfigurationForm.customerType == undefined
                  ? ""
                  : promotionConfigurationForm.customerType.toString()
              }}</el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col :span="10"> <b> Customer gender:</b></el-col>
              <el-col :span="12">{{
                promotionConfigurationForm.customerGender == undefined
                  ? ""
                  : promotionConfigurationForm.customerGender.toString()
              }}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="mt-3">
          <el-col :span="12">
            <el-upload
              class="upload-demo"
              drag
              action=""
              :multiple="false"
              :http-request="uploadImage"
              :show-file-list="false"
              accept="image/png, image/jpeg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
            </el-upload></el-col
          >
          <el-col :span="6" v-loading="loadingImage">
            <img v-if="image" class="img-fluid" :src="image" />
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import firebase from "firebase";
import moment from "moment";
export default {
  name: "promotion-preview",
  computed: {
    promotionTypeForm() {
      return this.$store.state.promotion.promotionTypeForm;
    },
    promotionConfigurationForm() {
      return this.$store.state.promotion.promotionConfigurationForm;
    },
  },
  created() {},
  data() {
    return {
      image: "",
      imageData: null,
      loadingImage: false,
    };
  },
  methods: {
    async uploadImage(file) {
      this.image = null;
      this.imageData = file.file;
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
          console.log(error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.image = url;
            this.$store.commit("promotion/setPromotionImage", this.image);
            this.loadingImage = false;
          });
        }
      );
    },
  },
  filters: {
    statusFilter() {
      return "Draft";
    },
    exclusiveFilter(value) {
      switch (value) {
        case 0: {
          return "None";
        }
        case 1: {
          return "Global";
        }
        case 2: {
          return "Level Order";
        }
        case 3: {
          return "Level Product";
        }
        case 4: {
          return "Level Shipping";
        }
        case 5: {
          return "Level Gift";
        }
      }
    },
    promotionType(value) {
      switch (value) {
        case "1":
          return "Discount";
        case "2":
          return "Promotion";
        case "3":
          return "Gift";
        case "4":
          return "Bonus point";
      }
    },
    dateFormat(value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY - HH:mm");
      } else return "Unlimit";
    },
  },
};
</script>

<style scoped>
.el-upload-dragger {
  width: 30vw;
}
</style>
