<template>
  <el-form
    class="custom-condition-form"
    :id="refParam"
    :ref="refParam"
    :rules="rules"
    :model="condition"
  >
    <el-row type="flex" justify="space-between">
      <el-col :span="18">
        <label class="condition-sub-label">Membership Condition</label>
      </el-col>

      <el-col class="text-right" :span="8">
        <el-button
          icon="el-icon-top"
          @click="reorderCondition(true)"
          plain
          size="mini"
          round
        >
        </el-button>
        <el-button
          icon="el-icon-bottom"
          @click="reorderCondition(false)"
          plain
          size="mini"
          round
        >
        </el-button>
        <el-button
          type="info"
          plain
          icon="el-icon-close"
          size="mini"
          circle=""
          @click="deleteCondition"
        ></el-button>
      </el-col>
    </el-row>
    <el-row>
      <!-- <el-col :span="24">
        <el-checkbox v-model="condition.forNewMember">For new member</el-checkbox>
      </el-col> -->
      <!-- Membership level -->
      <el-col :span="12">
        <el-form-item prop="membershipLevel" label="Membership level">
          <el-input type="text" v-model="condition.membershipLevel" maxlength="50" show-word-limit>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: "order-condition",
  props: {
    conditionParam: Object,
    gIndexParam: Number,
    indexParam: Number,
    refParam: String,
  },
  data() {
    return {
      formValid: true,
      rules: {
        membershipLevel: [
          {
            required: true,
            message: "Please enter level",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    condition() {
      return this.conditionParam;
    },
  },
  methods: {
    deleteCondition() {
      this.$emit("delete-condition", this.condition, this.gIndexParam, this.indexParam);
    },
    reorderCondition(isUp) {
      this.$emit("reorder-condition", this.indexParam, this.gIndexParam, isUp);
    },
    checkValidForm() {
      this.$refs[this.refParam].validate((valid) => {
        this.formValid = valid;
      });
    },
  },
};
</script>
<style></style>
