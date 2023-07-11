<template>
  <div class="card p-3">
    <div class="mt-2 table-responsive">
      <el-table
        ref="filterTable"
        v-loading="loading"
        class="condition-table"
        :data="conditionList.data"
        style="width: 100%; color: #525f7f"
        :header-cell-style="{
          color: '#696969',
          'font-weight': '600',
          'font-size': '1rem !important',
          'background-color': '#f4f4f4',
          'padding-bottom': '1vh',
          'padding-top': '1.2vh',
        }"
        :cell-style="{
          'padding-top': '1.3vh',
          'padding-bottom': '1.3vh',
          'padding-left': '0px',
          'padding-right': '0px',
          'font-size': '1.05rem !important',
          height: '5.5vh',
        }"
      >
        <!-- //# No. -->
        <el-table-column
          type="index"
          align="left"
          :index="indexMethod"
          label="NO"
          :min-width="40"
        />

        <!-- //# Condition Name -->
        <el-table-column
          prop="ruleName"
          label="NAME"
          column-key="date"
          align="left"
          :min-width="250"
        >
          <template slot-scope="scope">
            <router-link
              class="text-body"
              style="word-break: break-word"
              :to="{
                name: 'Condition Detail',
                params: { id: scope.row.conditionRuleId },
              }"
            >
              {{ scope.row.ruleName }}
            </router-link>
          </template>
        </el-table-column>

        <!-- //# Description -->
        <el-table-column label="DESCRIPTION">
          <template slot-scope="scope">
            <span class="mb-0" style="word-break: break-word">
              {{ scope.row.description }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="insDate" label="Updated date" class="pt-0 pb-0">
          <template slot-scope="scope"
            ><i class="el-icon-time mr-1"></i>
            {{ scope.row.updDate | dateFormat }}</template
          >
        </el-table-column>
        <el-table-column width="70" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete-solid"
              type="text text-dark"
              style="border: 0px; outline: none"
              @click="deleteRule(scope.row.conditionRuleId)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- //# Pagination -->
    <div
      class="d-flex justify-content-end align-items-center mr-2 mb-2 mt-2"
      :class="type === 'dark' ? 'bg-transparent' : ''"
    >
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
import moment from "moment";
import { debounce } from "debounce";
export default {
  name: "condition-table",
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
    conditionList() {
      this.setPageCount();
      return this.$store.state.condition.conditionList;
    },
  },
  watch: {
    search() {
      if (this.search !== "") {
        this.$store.commit("voucher/setSearchContent", this.search);
        this.loading = true;
        this.getSearch();
      } else {
        this.getConditionList();
      }
    },
  },
  methods: {
    deleteRule(id) {
      this.$confirm("This will permanently delete the file. Continue?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$store.commit("condition/setDeleteId", id);
        this.$store
          .dispatch("condition/deleteRule")
          .then((result) => {
            this.loading = false;
            if (result.status == 200) {
              this.$notify({
                title: "Success",
                message: "Delete successful",
                type: "success",
              });
              this.getConditionList();
            } else {
              this.$notify({
                icon: "el-icon-warning",
                title: "Error",
                message: "Delete error, please try again",
                type: "danger",
              });
            }
          })
          .catch(() => {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Delete error, please try again",
              type: "danger",
            });
            this.loading = false;
          });
      });
    },
    changePage(index) {
      this.$store.commit("condition/setPageIndex", index);
      this.loading = true;
      this.getConditionList();
    },
    setPageCount() {
      let pageSize = this.$store.state.condition.PageSize;
      this.pageCount = Math.ceil(this.$store.state.condition.counter / pageSize);
    },
    indexMethod(index) {
      let PageSize = this.$store.state.condition.PageSize;
      let PageIndex = this.$store.state.condition.PageIndex;
      index += 1;
      if (PageIndex > 1) {
        return (index += (PageIndex - 1) * PageSize);
      } else return index;
    },
    //# Search by Condition Name
    getSearch: debounce(function () {
      this.$store
        .dispatch("voucher/searchVoucher")
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
    //# Get conditionList
    getConditionList() {
      this.loading = true;
      this.$store
        .dispatch("condition/getConditionList")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-warning",
              title: "Error",
              message: "Error when getting conditions, please try again",
              type: "danger",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-warning",
            title: "Error",
            message: "Error when getting conditions, please try again",
            type: "danger",
          });
        });
    },
  },
  created: function () {
    //# Get Condition List
    this.getConditionList();
  },
  filters: {
    type: function (type) {
      switch (type) {
        case "1":
          return "Discount";
        case "2":
          return "Promotion";
        case "3":
          return "Gift";
        case "4":
          return "Bonus Point";
      }
    },
    dateFormat(value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY, HH:mm");
      }
    },
  },
};
</script>
<style>
.el-dropdown-menu .el-button {
  border: 0px;
}
#condition-table .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #87d5ff33 !important;
}
#condition-table .el-checkbox:last-of-type {
  margin-bottom: 0;
}
#condition-table .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2dce89;
  border-color: #2dce89;
}
#condition-table .el-checkbox__inner {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background-color: #ffffff;
  z-index: 1;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
/* #action-table .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2dce8933;
} */
#condition-table .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#condition-table .condition-table {
  min-height: 63vh;
}
/* #action-table .el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 0.25rem;
  padding-right: 2.5rem;
  text-align: left;
} */
.has-success:after {
  content: "";
  background-color: transparent;
}
.has-danger:after {
  content: "";
  background-color: transparent;
}
.has-danger .form-control:focus {
  border-color: #fb6340;
}
</style>
