<template>
  <div class="card shadow pl-3 pr-3" id="promotion-table">
    <div class="card-header border-0 pt-3 pb-2 pr-2 mr-1">
      <div class="row align-items-center">
        <div class="col-12 pl-1 pr-1">
          <div class="float-right">
            <el-input
              style="width: 30vw"
              size="medium"
              placeholder="Search by name"
              v-model="search"
              prefix-icon="fa fa-search "
            >
            </el-input>
            <el-select
              @change="filterPromotion"
              size="medium"
              style="width: 10vw; padding: 0px"
              v-model="selectedStatus"
              class="text-dark ml-3"
              slot="append"
              placeholder="Select"
            >
              <el-option label="ALL" :value="0"></el-option>
              <el-option
                label="DRAFT"
                :value="$ENV.PROMOTION_STATUS.DRAFT"
              ></el-option>
              <el-option
                label="PUBLISH"
                :value="$ENV.PROMOTION_STATUS.PUBLISH"
              ></el-option>
              <el-option
                label="UNPUBLISH"
                :value="$ENV.PROMOTION_STATUS.UNPUBLISH"
              ></el-option>
              <el-option
                label="EXPIRED"
                :value="$ENV.PROMOTION_STATUS.EXPIRED"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <!-- 'font-size': '1rem', -->
    <div class="table-responsive">
      <el-table
        ref="filterTable"
        v-loading="loading"
        class="promotion-table"
        :data="promotionList"
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
          label="NO"
          type="index"
          align="left"
          :index="indexMethod"
          :min-width="40"
        />

        <!-- //# Promotion Name -->
        <el-table-column
          prop="promotionName"
          label="NAME"
          sortable
          column-key="date"
          align="left"
          :min-width="250"
        >
          <template slot-scope="scope">
            <!-- ; color: #343a40 -->
            <router-link
              style="word-break: break-word"
              class="text-body"
              :to="{
                name: 'Promotion detail',
                params: { id: scope.row.promotionId },
              }"
            >
              {{ scope.row.promotionName }}
            </router-link>
          </template>
        </el-table-column>

        <!-- //# Promotion Type -->
        <el-table-column label="TYPE" align="left" :min-width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.hasVoucher">
              <el-tag type="success" effect="dark">
                <span
                  style="word-break: break-word"
                  class="mb-0 promo-type text-uppercase"
                >
                  {{ scope.row.hasVoucher | voucherFilter }}
                </span>
              </el-tag>
            </div>

            <div v-if="scope.row.isAuto">
              <el-tag type="warning" effect="dark">
                <span
                  style="word-break: break-word"
                  class="mb-0 promo-type text-uppercase"
                >
                  {{ scope.row.isAuto | autoFilter }}
                </span>
              </el-tag>
            </div>
            <div v-if="!scope.row.hasVoucher && !scope.row.isAuto">
              <el-tag type="primary" effect="dark">
                <span
                  style="word-break: break-word"
                  class="mb-0 promo-type text-uppercase"
                >
                  {{ scope.row.hasVoucher | voucherFilter }}
                </span>
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <!-- //# Action -->
        <el-table-column label="ACTION" align="left" :min-width="130">
          <template slot-scope="scope">
            <div v-if="scope.row.actionType > $ENV.ACTION_TYPE.EMPTY">
              <span style="word-break: break-word" class="mb-0">
                {{ scope.row.actionType | actionTypeFilter }}
              </span>
            </div>
            <div v-if="scope.row.postActionType > $ENV.POST_ACTION_TYPE.EMPTY">
              <span style="word-break: break-word" class="mb-0">
                {{ scope.row.postActionType | postActionTypeFilter }}
              </span>
            </div>
          </template>
        </el-table-column>

        <!-- //# Start Date -->
        <el-table-column
          prop="startDate"
          label="START"
          align="left"
          :min-width="110"
          class="text-body"
          sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-time mr-1"></i>
            {{ scope.row.startDate | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="STATUS"
          :min-width="80"
          align="left"
        >
          <template slot-scope="scope">
            <span
              v-show="scope.row.status == $ENV.PROMOTION_STATUS.DRAFT"
              style="
                font-size: 0.95rem;
                font-weight: 600;
                word-break: break-word;
              "
            >
              <i
                class="fa fa-circle align-middle mb-0"
                style="font-size: 0.35rem"
              />
              {{ scope.row.status | status }}
            </span>

            <span
              v-show="scope.row.status == $ENV.PROMOTION_STATUS.PUBLISH"
              class="text-success"
              style="
                font-size: 0.95rem;
                font-weight: 600;
                word-break: break-word;
              "
            >
              <i
                class="fa fa-circle align-middle mb-0"
                style="font-size: 0.35rem"
              />
              {{ scope.row.status | status }}
            </span>

            <span
              v-show="scope.row.status == $ENV.PROMOTION_STATUS.UNPUBLISH"
              class="text-primary"
              style="
                font-size: 0.95rem;
                font-weight: 600;
                word-break: break-word;
              "
            >
              <i
                class="fa fa-circle align-middle mb-0"
                style="font-size: 0.35rem"
              />
              {{ scope.row.status | status }}
            </span>

            <span
              v-show="scope.row.status == $ENV.PROMOTION_STATUS.EXPIRED"
              class="text-danger"
              style="
                font-size: 0.95rem;
                font-weight: 600;
                word-break: break-word;
              "
            >
              <i
                class="fa fa-circle align-middle mb-0"
                style="font-size: 0.35rem"
              />
              {{ scope.row.status | status }}
            </span>
          </template>
        </el-table-column>

        <!-- //# Actions -->
        <el-table-column align="center" :min-width="70" class="pt-0 pb-0">
          <!-- type="text text-dark" -->
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete-solid"
              style="outline: none; border: 0px"
              class="p-0 m-0 action-button bg-transparent"
              @click="deletePromotion(scope.row)"
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
      ></base-pagination>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { debounce } from "debounce";
export default {
  name: "promotion-table",
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
      selectedStatus: 0,
    };
  },
  computed: {
    promotionList() {
      this.setPageCount();
      // console.log(this.$store.state.dashboard.promotionList);
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
    deletePromotion(promo) {
      this.$confirm("Do you want to delete Promotion ?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.loading = true;
        let id = promo.promotionId;
        this.$store.commit("promotion/setDeleteId", id);
        this.$store
          .dispatch("promotion/DeletePromotion")
          .then((response) => {
            if (response.status == 200) {
              this.$notify({
                title: "Success",
                message: "Delete successfully",
                type: "success",
              });
              this.changePage(1);
            } else {
              this.loading = false;
              this.$message({
                message: "Something went wrong, please try again.",
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message({
              message: err.message + ", please try again.",
              type: "error",
            });
          });
      });
    },
    changePage(index) {
      if (this.search != "") {
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
      this.pageCount = Math.ceil(
        this.$store.state.dashboard.counter / pageSize
      );
    },
    filterPromotion() {
      this.loading = true;
      this.$store.commit("dashboard/setSearchStatus", this.selectedStatus);
      this.$store
        .dispatch("dashboard/searchPromotion")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-circle-check",
              title: "Error",
              message: "Search promotion error, please try again",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-circle-check",
            title: "Error",
            message: "Search promotion error, please try again",
            type: "warning",
          });
        });
    },
    getSearch: debounce(function () {
      this.loading = true;
      this.$store.commit("dashboard/setSearchStatus", this.selectedStatus);
      this.$store
        .dispatch("dashboard/searchPromotion")
        .then((result) => {
          this.loading = false;
          if (result.status != 200) {
            this.$notify({
              icon: "el-icon-circle-check",
              title: "Error",
              message: "Search promotion error, please try again",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$notify({
            icon: "el-icon-circle-check",
            title: "Error",
            message: "Search promotion error, please try again",
            type: "warning",
          });
        });
    }, 1000),
    getPromotionList() {
      //Count
      this.$store.dispatch("dashboard/countPromotion").catch((error) => {
        this.loading = false;
        this.$message.error(error);
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
    //Get Promotions
    this.getPromotionList();
  },
  filters: {
    autoFilter(value) {
      switch (value) {
        case true: {
          return "Automatic";
        }
      }
    },
    voucherFilter(value) {
      switch (value) {
        case true: {
          return "Using voucher";
        }
        case false: {
          return "Using promotion code";
        }
      }
    },
    actionTypeFilter(value) {
      switch (value) {
        case 1: {
          return "Discount amount of order";
        }
        case 2: {
          return "Discount percent of order";
        }
        case 3: {
          return "Discount shipping fee of order";
        }
        case 4: {
          return "Discount amount of item";
        }
        case 5: {
          return "Discount percent of item";
        }
        case 6: {
          return "Discount unit of item";
        }
        case 7: {
          return "Fixed price of item";
        }
        case 8: {
          return "Ladder price of item";
        }
        case 9: {
          return "Bundle price of item";
        }
      }
    },

    postActionTypeFilter(value) {
      switch (value) {
        case 1: {
          return "Gift products";
        }
        case 2: {
          return "Gift vouchers";
        }
        case 3: {
          return "Gift points";
        }
        case 4: {
          return "Gift game code";
        }
      }
    },
    status: function (status) {
      switch (status) {
        case 1:
          return "draft";
        case 2:
          return "published";
        case 3:
          return "unpublished";
        case 4:
          return "expired";
      }
    },
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
        return moment(value).format("DD/MM/YYYY");
      }
    },
    voucherName(value) {
      if (value.length > 15) {
        return value.substring(0, 14) + "...";
      }
      return value;
    },
  },
};
</script>
<style>
.el-dropdown-menu .el-button {
  border: 0px;
}
#promotion-table .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #87d5ff33 !important;
}
/* #promotion-table .el-table__body tr.hover-row > td,
.el-table__body tr.hover-row.current-row > td,
.el-table__body tr.hover-row.el-table__row--striped > td,
.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
.el-table .selected-row > td {
  background: #2fde6640;
} */
#promotion-table .el-table::before,
.el-table__fixed::before,
.el-table__fixed-right::before {
  height: 0;
}
#promotion-table .promotion-table {
  min-height: 63vh;
}
#promotion-table .promo-type {
  word-break: break-word;
  font-size: 0.8rem;
  font-weight: 600;
}
#promotion-table .action-button:hover {
  color: #ff4254;
}
#promotion-table .el-table th > .cell {
  display: inline-block !important;
}
#promotion-table .el-table .sort-caret.ascending {
  top: -3px !important;
}
#promotion-table .el-table .sort-caret.descending {
  top: 10px !important;
}
#promotion-table .el-table .caret-wrapper {
  height: 20px !important;
}
</style>
