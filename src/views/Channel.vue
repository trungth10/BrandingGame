<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>
    <div class="container-fluid mt--9" id="channel">
      <div class="row mb-3">
        <div class="col">
          <div class="card shadow">
            <div class="card-header bg-transparent">
              <el-collapse @change="expanded" class="pb-0">
                <el-collapse-item name="1" class="justify-content-center pb-0">
                  <span class="collapse-title" slot="title">
                    <el-button
                      v-if="!expand"
                      icon="el-icon-plus"
                      type="success"
                      size="medium"
                      >Create channel
                    </el-button>
                    <el-button
                      v-if="expand"
                      icon="el-icon-close"
                      type="danger"
                      size="small"
                      >Cancel
                    </el-button>
                  </span>
                  <div class="col-12">
                    <el-form
                      :model="createForm"
                      ref="createForm"
                      class="row justify-content-center"
                      :rules="addRules"
                    >
                      <!-- //# Add form - Input code -->
                      <el-form-item
                        class="col-3 align-self-center"
                        prop="channelCode"
                      >
                        <p class="mb-0">
                          <small> Channel Code</small>
                        </p>
                        <el-input
                          type="text"
                          v-model="createForm.channelCode"
                          placeholder="Input code"
                          size="small"
                          spellcheck="false"
                          maxlength="20"
                          show-word-limit
                          @keydown.native.space.prevent
                        >
                        </el-input>
                      </el-form-item>
                      <!-- //# Add form - Input store name -->
                      <el-form-item
                        class="col-3 align-self-center"
                        prop="channelName"
                      >
                        <p class="mb-0">
                          <small> Channel Name</small>
                        </p>
                        <el-input
                          type="text"
                          v-model="createForm.channelName"
                          placeholder="Input name here"
                          size="small"
                          spellcheck="false"
                          maxlength="50"
                          show-word-limit
                        >
                        </el-input>
                      </el-form-item>

                      <!-- //# Add form - Input store name -->
                      <el-form-item
                        class="col-3 align-self-center"
                        prop="channelType"
                      >
                        <p class="mb-0">
                          <small> Channel type</small>
                        </p>
                        <el-select
                          v-model="createForm.channelType"
                          placeholder="Select type"
                          size="small"
                        >
                          <el-option
                            v-for="item in channelType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>

                      <!-- //# Add form - Input group -->
                      <el-form-item
                        class="col-2 align-self-center"
                        prop="group"
                      >
                        <p class="mb-0 pr-3">
                          <small> Group</small>
                        </p>
                        <el-input-number
                          v-model="createForm.group"
                          placeholder="Input group here"
                          size="small"
                          spellcheck="false"
                          :min="0"
                          :max="10"
                          style="width: 100%"
                          controls-position="right"
                        >
                        </el-input-number>
                      </el-form-item>
                      <!-- //# Add form - Add button -->
                      <el-form-item class="col-1 align-self-center pt-4 mt-1">
                        <el-button
                          v-if="expand"
                          size="mini"
                          icon="el-icon-plus"
                          class="custom-add"
                          type="success"
                          @click="submitForm('createForm')"
                          >Add
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <channel-table title="Channel list" ref="table"></channel-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import channelTable from "./Channel/ChannelTable";
export default {
  data() {
    return {
      expand: false,
      isDuplicate: false,
      channelType: [
        {
          value: 1,
          label: "In-Store",
        },
        {
          value: 2,
          label: "Online",
        },
        {
          value: 3,
          label: "Other App",
        },
      ],
      createForm: {
        channelName: "",
        channelCode: "",
        channelType: "",
        group: 0,
      },
      addRules: {
        channelCode: [{ validator: this.validateAddCode, trigger: "change" }],
        channelName: [{ validator: this.validateAddName, trigger: "change" }],
        group: [
          { required: true, message: "Group is required!", trigger: "change" },
        ],
        channelType: {
          required: true,
          message: "Please choose type!",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  created() {},
  components: {
    channelTable,
  },
  methods: {
    validateAddName(rule, value, callback) {
      if (!value) {
        console.log("validateAddName: ở đây đc gọi khi !value");
        callback(new Error("Name is required!"));
      } else {
        console.log("validateAddName :>> ", value);
        if (!value.trim()) {
          console.log("validateAddName: ở đây đc gọi khi !value.trim()");
          callback(new Error("Name is required!"));
        }
        console.log("validateAddName: ở đây đc gọi sau khi nhập value đúng");
        callback();
      }
    },
    validateAddCode(rule, value, callback) {
      if (!value) {
        console.log("validateAddCode: ở đây đc gọi khi !value");
        return callback(new Error("Code is required!"));
      } else {
        console.log("validateAddCode :>> ", value);
        this.$store.commit("channel/setChannelCode", value);
        return this.$store.dispatch("channel/checkDuplicate").then((result) => {
          if (result.data) {
            console.log(
              "validateAddCode: ở đây đc gọi khi có Duplicate: " + value
            );
            return callback(new Error("Duplicated code!"));
          } else {
            for (let i = 0; i < value.length; i++) {
              if (value.charCodeAt(i) > 127) {
                return callback(new Error("Accept no Unicode!"));
              }
            }
          }
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addChannel();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    expanded() {
      console.log("expanded đc gọi");
      this.expand = !this.expand;
      if (!this.expand) {
        console.log("!expand đc gọi");
        this.$refs.createForm.resetFields("channelCode");
        this.createForm.group = 0;
      }
    },
    addChannel() {
      this.$refs.table.loading = true;
      console.log(this.$store.state.channel.brandId);
      this.$store.commit("channel/setChannelCode", this.createForm.channelCode);
      this.$store.commit(
        "channel/setChannelName",
        this.createForm.channelName.replace(/\s+/g, " ").trim()
      );
      this.$store.commit("channel/setGroup", this.createForm.group);
      this.$store.commit("channel/setChannelType", this.createForm.channelType);
      this.$store
        .dispatch("channel/addChannel")
        .then(
          () => {
            this.$refs.createForm.resetFields();
            this.$refs.table.loading = false;
          },
          (error) => {
            console.log(error);
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
  },
};
</script>
<style>
.card-header {
  border-bottom: 0px;
}
.el-collapse-item__content {
  padding-bottom: 0px;
}
.el-collapse-item__header {
  flex: 1 0 auto;
  order: -1;
  border: 0px;
}
.el-collapse-item__header {
  flex: 1 0 auto;
  order: -1;
  border: 0px;
}
.el-collapse-item__wrap {
  border: 0px;
}
.el-collapse {
  border: 0px;
}
.el-collapse-item__arrow {
  display: none;
}
/* .el-input-number__increase {
  display: none;
  width: 0px;
}
.el-input-number__decrease {
  display: none;
  width: 0px;
} */
.el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  padding-right: 2.5rem;
  text-align: left;
}
</style>
