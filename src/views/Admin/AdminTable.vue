<template>
  <div class="card shadow container-fluid mt-3 mb-3 pb-2 pr-0 pl-0 pt-2">
    <el-table
      v-loading="loading"
      :data="accountList"
      style="width: 100%"
      class="mb-2"
      stripe
    >
      <el-table-column label="No." type="index" width="45" align="right" fixed />
      <el-table-column label="Username" prop="username" width="280" />
      <el-table-column label="Brand" prop="brand.brandName" width="330">
        <template slot-scope="scope">
          {{ scope.row.brand != null ? scope.row.brand.brandName : "" }}
        </template>
      </el-table-column>
      <el-table-column label="Role" prop="roleId" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.roleId === 1"
            type="primary"
            class="mr-3"
            icon="el-icon-s-shop"
            size="small"
            plain
          >
            {{ scope.row.roleId | roleFilter }}
          </el-button>
          <el-button
            v-if="scope.row.roleId === 2"
            type="warning"
            class="mr-3"
            icon="el-icon-s-custom"
            size="small"
            plain
          >
            {{ scope.row.roleId | roleFilter }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Active" prop="isActive" fixed="right" align="right">
        <template slot-scope="scope">
          <!-- <el-tag v-if="scope.row.isActive" type="success" class="mr-3">
            {{ scope.row.isActive | statusFilter }}
          </el-tag>
          <el-tag v-if="!scope.row.isActive" type="danger" class="mr-3">
            {{ scope.row.isActive | statusFilter }}
          </el-tag> -->
          <el-switch
            :disabled="scope.row.roleId === 2"
            v-model="scope.row.isActive"
            @change="
              handleStatus(scope.$index, scope.row.username, {
                username: scope.row.username,
                updDate: new Date(),
                isActive: scope.row.isActive,
              })
            "
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- //# Pagination -->
    <div class="d-flex justify-content-end pr-0">
      <base-pagination
        class="mb-0"
        :page-count="pageCount"
        v-model="pagination.default"
        @input="changePage"
      />
    </div>
  </div>
</template>
<script>
import { debounce } from "debounce";
import moment from "moment";
export default {
  name: "admin-table",
  data() {
    return {
      loading: true,
      pagination: {
        default: 1,
      },
      pageCount: 1,
      isActive: true,
    };
  },
  computed: {
    accountList() {
      this.setPageCount();
      return this.$store.state.admin.accountList;
    },
  },
  components: {},
  methods: {
    //# handleActive
    handleStatus(value, username, params) {
      this.$store.commit("admin/setParams", params);
      this.$store.commit("admin/setUsername", username);
      this.$store.commit("admin/setPosition", value);
      this.$store
        .dispatch("admin/updateStatus")
        .then(() => {
          this.loading = false;
          this.getAccount();
        })
        .catch((err) => {
          this.loading = false;
          this.message =
            (err.response && err.response.data) || err.message || err.toString();
        });
    },
    //# Change Page
    changePage(index) {
      console.log("changePage trigger!");
      this.$store.commit("admin/setPageIndex", index);
      this.loading = true;
      this.getAccount();
    },
    //# Get Account List
    getAccount() {
      this.$store
        .dispatch("admin/getAccountList")
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.message =
            (err.response && err.response.data) || err.message || err.toString();
        });
    },
    //# set pageCount
    setPageCount() {
      let pageSize = this.$store.state.admin.PageSize;
      this.pageCount = Math.ceil(this.$store.state.admin.counter / pageSize);
    },
    //# search
    getSearch: debounce(function () {
      console.log("getSearch trigger!");
    }, 1000),
  },
  //# Get Account List at the beginning
  created() {
    this.getAccount();
  },
  filters: {
    dateFormat(value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY, HH:mm:ss");
      }
    },
    statusFilter(value) {
      if (value) {
        return "Active";
      } else {
        return "Disable";
      }
    },
    roleFilter(value) {
      if (value === 1) {
        return "Brand";
      } else {
        return "Admin";
      }
    },
  },
};
</script>
<style></style>
