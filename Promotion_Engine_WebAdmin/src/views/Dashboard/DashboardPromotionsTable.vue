<template>
  <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
    <div class="card-header border-0" :class="type === 'dark' ? 'bg-transparent' : ''">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0" :class="type === 'dark' ? 'text-white' : ''">
            Promotions Table
          </h3>
        </div>
        <div class="col text-right">
          <el-input placeholder="Type to search" v-model="search"> </el-input>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <!-- <div v-if="!promotionList">No data</div> -->
      <el-table
        ref="filterTable"
        v-loading="loading"
        :data="promotionList"
        style="width: 100%"
      >
        //# No.
        <el-table-column label="No." type="index" :index="indexMethod" width="50" fixed />
        <!-- <el-table-column prop="img" label="" width="90">
          <template slot-scope="scope">
            <el-image
              class="image"
              :src="scope.row.imgUrl"
              style="height: 50px; width: 50px"
              :alt="scope.row.imgUrl"
            ></el-image>
          </template>
        </el-table-column> -->
        //# Name
        <el-table-column
          prop="promotionName"
          label="Promotion"
          column-key="date"
          width="165"
          sortable
        />

        //# ID
        <!-- <el-table-column prop="promotionId" label="ID" /> -->

        //# Code
        <el-table-column prop="promotionCode" label="Code" width="80">
          abcxyz
        </el-table-column>

        //# Insert Date
        <el-table-column prop="insDate" label="Ins Date" width="200" sortable>
          <template slot-scope="scope">
            {{ scope.row.insDate | dateFormat }}
          </template>
        </el-table-column>

        //# Status
        <el-table-column
          :filters="[
            { text: 'Publish', value: '2' },
            { text: 'Draft', value: '1' },
            { text: 'Expired', value: '3' },
          ]"
          :filter-method="filterStatus"
          prop="status"
          label="Status"
          width="110"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              type="info"
              v-show="scope.row.status === '1'"
              disable-transitions
              >{{ scope.row.status | status }}</el-tag
            >
            <el-tag
              effect="dark"
              type="success"
              v-show="scope.row.status === '2'"
              disable-transitions
              >{{ scope.row.status | status }}</el-tag
            >
            <el-tag
              effect="dark"
              type="danger"
              v-show="scope.row.status === '3'"
              disable-transitions
              >{{ scope.row.status | status }}</el-tag
            >
          </template>
        </el-table-column>

        //# Start Date
        <el-table-column prop="startDate" label="Start Date" sortable width="200">
          <template slot-scope="scope"> {{ scope.row.startDate | dateFormat }}</template>
        </el-table-column>

        //# End Date
        <el-table-column prop="endDate" label="End Date" sortable width="200">
          <template slot-scope="scope"> {{ scope.row.endDate | dateFormat }}</template>
        </el-table-column>
        <!-- <el-table-column prop="completion" label="Voucher Used">
        </el-table-column> -->

        //# Preview
        <el-table-column label="Operations" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button @click="getDetail(scope.row.promotionId)" type="text" size="small">
              Preview
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <promotion-preview title="Preview" ref="promotionPreview" />
    </div>
    <div
      class="card-footer d-flex justify-content-end"
      :class="type === 'dark' ? 'bg-transparent' : ''"
    >
      <base-pagination
        :page-count="pageCount"
        v-model="pagination.default"
        @input="changePage"
      ></base-pagination>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import PromotionPreview from "./PromotionPreview";
import { debounce } from "debounce";
export default {
  name: "dashboard-promotion-table",
  components: {
    PromotionPreview,
  },
  props: {
    type: {
      type: String,
    },
    title: String,
  },
  data() {
    return {
      pagination: {
        default: 1,
      },
      search: "",
      loading: true,
      pageCount: 1,
    };
  },
  computed: {
    promotionList() {
      this.setPageCount();
      return this.$store.state.dashboard.promotionList;
    },
  },
  watch: {
    search() {
      if (this.search !== "") {
        this.$store.commit("dashboard/setSearchContent", this.search);
        this.loading = true;
        this.getSearch();
      } else {
        this.getPromotionList();
      }
    },
  },
  methods: {
    getDetail(index) {
      this.$store.commit("dashboard/setPromotionId", index);
      this.$refs.promotionPreview.openDialog();
    },
    changePage(index) {
      if (this.search !== "") {
        this.$store.commit("dashboard/setPageIndex", index);
        this.loading = true;
        this.getSearch();
      } else {
        this.$store.commit("dashboard/setPageIndex", index);
        this.loading = true;
        this.getPromotionList();
      }
    },
    setPageCount() {
      let pageSize = this.$store.state.dashboard.PageSize;
      this.pageCount = Math.ceil(this.$store.state.dashboard.counter / pageSize);
    },
    getSearch: debounce(function () {
      //Count
      this.$store
        .dispatch("dashboard/countSearchPromotion")
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });

      //Get Promotions
      this.$store
        .dispatch("dashboard/searchPromotion")
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
    }, 1000),
    getPromotionList() {
      //Count
      this.$store
        .dispatch("dashboard/countPromotion")
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            message: err.message + ", please try again.",
            type: "error",
          });
        });
      this.$store
        .dispatch("dashboard/getPromotionList")
        .then(() => {
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
    filterStatus(value, row) {
      return row.status === value;
    },
    indexMethod(index) {
      let PageSize = this.$store.state.dashboard.PageSize;
      let PageIndex = this.$store.state.dashboard.PageIndex;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
  },
  created: function () {
    let user = this.$session.get("user-info");
    if (user != undefined) {
      let brandId = user.brandId;
      if (brandId != undefined) {
        this.$store.commit("dashboard/setBrandId", brandId);
        this.getPromotionList();
      }
    }
  },
  filters: {
    status: function (status) {
      switch (status) {
        case "1":
          return "Draft";
        case "2":
          return "Publish";
        case "3":
          return "Expired";
      }
    },
    dateFormat(value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY, HH:mm:ss");
      }
    },
  },
};
</script>
<style>
.pre-formatted {
  white-space: pre-line;
}
</style>
