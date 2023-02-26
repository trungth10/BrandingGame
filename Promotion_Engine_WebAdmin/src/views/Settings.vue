<template>
  <div class="align-center">
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8"> </base-header>

    <div class="ml-4 mr-4 mb-0 pt-3 pl-4 pr-4 pb-0 mt--9" id="settings">
      <!-- container-fluid card shadow -->
      <div class="container-fluid mt-3 mb-0 pb-2 settings">
        <div class="row align-items-center justify-content-start pt-3 pb-0">
          <!-- //# Store & channel -->
          <div class="card shadow distributor-container col-12 mb-2 mr-3 pb-2">
            <span class="h1 row mt-2 ml-0 mb-0 font-weight-bolder"> Distributor </span>
            <el-divider class="mt-0 mb-3"></el-divider>
            <center class="row justify-content-start ml-0">
              <el-button
                @click="redirectPage('/store')"
                class="col-3 ml-0 mb-2 mr-3"
                type="success"
                plain
              >
                <center>
                  <i
                    class="icon row justify-content-center fa fa-store-alt mr-0 ml-0"
                  ></i>
                  <span class="row justify-content-center">Store</span>
                </center>
              </el-button>
              <el-button
                @click="redirectPage('/channel')"
                class="col-3 ml-0 mb-2 mr-1"
                type="success"
                plain
              >
                <center>
                  <i
                    class="icon row justify-content-center fa fa-network-wired mr-0 ml-0"
                  ></i>
                  <span class="row justify-content-center">Channel</span>
                </center>
              </el-button>
            </center>
          </div>
        </div>
        <div class="row align-items-center justify-content-start pt-0 pb-0">
          <!-- //# Product cate & product -->
          <div class="card shadow distributor-container col-12 mb-2 mr-3 pb-2">
            <span class="h1 row mt-2 ml-0 mb-0 font-weight-bolder"> Product </span>
            <el-divider class="mt-0 mb-3"></el-divider>
            <center class="row justify-content-start ml-0">
              <el-button
                @click="redirectPage('/product-cate')"
                class="col-3 ml-0 mb-2 mr-3"
                type="success"
                plain
              >
                <center>
                  <i class="icon row justify-content-center fa fa-list-ul mr-0 ml-0"></i>
                  <span class="row justify-content-center">Product Category</span>
                </center>
              </el-button>
              <el-button
                @click="redirectPage('/product')"
                class="col-3 ml-0 mb-2 mr-1"
                type="success"
                plain
              >
                <center>
                  <i
                    class="icon row justify-content-center fa fa-shopping-cart mr-0 ml-0"
                  ></i>
                  <span class="row justify-content-center">Product</span>
                </center>
              </el-button>
            </center>
          </div>
        </div>

        <div class="row align-items-center justify-content-start pt-0 pb-0">
          <!-- //# Others -->
          <div class="card shadow distributor-container col-12 mb-2 mr-3 pb-2">
            <span class="h1 row mt-2 ml-0 mb-0 font-weight-bolder"> Other</span>
            <el-divider class="mt-0 mb-3"></el-divider>
            <center class="row justify-content-start ml-0">
              <el-button
                @click="redirectPage('/game-campaign')"
                class="col-3 ml-0 mb-2 mr-3"
                type="success"
                plain
              >
                <center>
                  <i class="icon row justify-content-center fa fa-gamepad mr-0 ml-0"></i>
                  <span class="row justify-content-center">Game campaign</span>
                </center>
              </el-button>
              <el-button
                @click="redirectPage('/device')"
                class="col-3 ml-0 mb-2 mr-3"
                type="success"
                plain
              >
                <center>
                  <i class="icon row justify-content-center fa fa-tablet mr-0 ml-0"></i>
                  <span class="row justify-content-center">Device</span>
                </center>
              </el-button>
              <el-button
                @click="redirectPage('/memlv')"
                class="col-3 ml-0 mb-2 mr-1"
                type="success"
                plain
              >
                <center>
                  <i
                    class="icon row justify-content-center fa fa-address-card mr-0 ml-0"
                  ></i>
                  <span class="row justify-content-center">Membership level</span>
                </center>
              </el-button>
            </center>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {},
  props: {},
  methods: {
    redirectPage(link) {
      this.$router.push(link);
    },
  },
  created() {},
};
</script>

<style>
#settings .container-fluid {
  padding-left: 10px !important;
  padding-right: 10px !important;
  /* width: 50vw !important; */
  color: transparent !important;
}
#settings .distributor-container {
  border-radius: 5px;
  /* border-left: 6.5px solid #0cc28c; */
  background: #fff;
}
#settings .products-container {
  border-radius: 5px;
  border-left: 6.5px solid #8033ff;
  background-color: #a977fc33;
}
#settings .others-container {
  border-radius: 5px;
  border-left: 6.5px solid grey;
  background-color: #c0c0c033;
}
#settings .el-button--success.is-plain:hover,
.el-button--success.is-plain:focus {
  background: #0cc28c;
  border-color: #0cc28c;
  color: #ffffff;
}
#settings .el-button--success.is-plain {
  color: #0cc28c;
  background: #ffffff;
  border-color: #0cc28c80;
}
#settings .icon {
  font-size: 2.5rem;
}
#settings .game {
  background-color: #ffc107;
  border: 0;
}
#settings .store {
  background-color: #20c997;
  border: 0;
}
#settings .channel {
  background-color: #17a2b8;
  border: 0;
}
#settings .device {
  background-color: #2b91ff;
  border: 0;
}
#settings .memlv {
  background-color: #ff3245;
  border: 0;
}
#settings .prodcate {
  background-color: #8033ff;
  border: 0;
}
#settings .prod {
  background-color: #e83e8c;
  border: 0;
}
</style>
