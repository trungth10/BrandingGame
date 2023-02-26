<template>
  <div>
    <el-col :span="24" class="draggable-zone-style">
      <draggable
        :list="conditionItem"
        :group="{
          name: 'conditionItem',
          put: ['groupItem', 'orderCondItem', 'prodCondItem'],
        }"
        class="draggable-zone-style"
        @start="dragging = true"
        @end="dragging = false"
      >
        <el-col :span="24">
          <nested-draggable
            id="condition-drop-zone"
            :tasks="conditionItem"
            :optionParams="optionParam"
          />
        </el-col>
      </draggable>
    </el-col>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import nestedDraggable from "../../../../components/nested";

export default {
  name: "drop-section",
  props: {
    conditionItemParam: Array,
    actionItemParam: Array,
    actionType: String,
  },

  components: {
    draggable,
    nestedDraggable,
  },
  created() {},
  data() {
    return {
      optionParam: ["groupItem", "orderCondItem", "prodCondItem", "g1"],
      drawer: false,
    };
  },
  computed: {
    products() {
      return this.$store.state.condition.products;
    },
    conditionItem() {
      return this.conditionItemParam;
    },
    actionItem() {
      return this.actionItemParam;
    },
  },
  methods: {},
};
</script>
<style scoped>
.drop-zone {
  background-color: white;
  margin-bottom: 10px;
  padding: 10px;
  color: black;
  font-family: Arial, Helvetica, sans-serif;
  min-height: 30vh;
}
.el-input-number__increase {
  display: none;
  width: 0px;
}
.el-input-number__decrease {
  display: none;
  width: 0px;
}
.el-input-number .el-input__inner {
  padding: 0px;
  padding-left: 1rem;
  text-align: left;
}
.el-divider--vertical {
  width: 0.15vw;
  height: 1.9vw;
  margin-left: 5px;
  margin-bottom: 10px;
  margin-top: 5px;
}
.drag-input-number {
  width: 3.5vw;
  text-align: right;
  margin: 0.5vw;
}
.custom-content-break {
  word-break: break-word;
}
.draggable-zone-style {
  background-color: white;
  min-height: 40vh;
  padding: 10px;
}
.then-zone {
  background-color: white;
  min-height: 20vh;
  position: inherit;
}
</style>
