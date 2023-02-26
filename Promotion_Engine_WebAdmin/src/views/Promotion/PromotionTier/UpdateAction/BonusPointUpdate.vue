<template>
  <div>
    <el-row>
      <div class="">
        <div class="bg-transparent">
          <el-col :span="24"><h2 class="custom-label-action">Bonus point</h2></el-col>
          <!-- START Product Type -->
          <el-row type="flex" :gutter="10" justify="space-between">
            <el-col :span="12">
              <el-form-item
                :prop="'bonusPoint.bonusPoint'"
                label="Points"
                :required="true"
              >
                <el-input-number
                  type="number"
                  :min="0"
                  :max="999999999"
                  v-model="bonusPoint.bonusPoint"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    var validateValue = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("Please input larger than 0"));
      } else callback();
    };
    return {
      rules: {
        requiredField: {
          required: true,
          message: "This field is required",
          trigger: ["blur", "change"],
        },
        valueRule: [
          {
            required: true,
            message: "This field is required",
            trigger: ["blur", "change"],
          },
          {
            validator: validateValue,
          },
        ],
      },
    };
  },
  props: {
    actionForm: Object,
  },
  computed: {
    bonusPoint() {
      return this.actionForm.bonusPoint;
    },
  },

  name: "bonus-point-update",
  methods: {},
};
</script>

<style></style>
