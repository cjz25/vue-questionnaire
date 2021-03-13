<template>
  <div>
    <div v-for="(choice, index) in questionChoices" v-bind:key="index">
      <div class="d-flex align-items-center">
        <input type="radio" disabled>
        <div class="col-11">
          <el-input
            placeholder="Please input"
            v-model="choice.item"
            v-bind:ref="`choice${index}`"
            @input="$emit('editChoice', questionChoices)">
          </el-input>
        </div>
        <div class="ml-auto">
          <el-button
            v-if="isFocus && questionChoices.length > 1"
            icon="el-icon-close"
            circle
            v-on:click="removeOption(index)">
          </el-button>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <el-button type="text" v-on:click="addOption()">Add new option</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { Choice } from '@/models/choice.model'

import _ from 'lodash'

export default defineComponent({
  name: 'MultipleChoice',
  props: {
    choices: {
      type: Array as PropType<Choice[]>,
      required: false
    },
    isFocus: {
      type: Boolean,
      required: false
    }
  },
  setup(props) {
    const defaultChoice: Choice = {
      id: 0,
      item: 'Option 1'
    };
    const questionChoices = props.choices ? ref(_.cloneDeep(props.choices)) : ref([defaultChoice]);
    watch(() => props.choices, (newVal, oldVal) => {
      if (newVal) {
        questionChoices.value = newVal;
      }
    });
    return { questionChoices };
  },
  methods: {
    addOption() {
      if (this.questionChoices) {
        const newLength = this.questionChoices.push({
          item: `Option ${this.questionChoices.length + 1}`
        });
        this.$emit('editChoice', [...this.questionChoices]);
        this.$nextTick(() => {
          (this.$refs[`choice${newLength - 1}`] as HTMLInputElement).focus();
        });
      }
    },
    removeOption(index: number) {
      if (this.questionChoices) {
        this.questionChoices.splice(index, 1);
        this.$emit('editChoice', [...this.questionChoices]);
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input::v-deep(.el-input__inner) {
  border: 1px solid #FFF;
  border-radius: 0;
  padding: 0;
}
.el-input::v-deep(.el-input__inner:hover) {
  border-bottom: 1px solid #999;
}
.el-input::v-deep(.el-input__inner:focus) {
  border-bottom: 1px solid #409eff;
}
.el-button {
  border: 0;
}
input[type=radio]:hover + div :deep(.el-input__inner) {
  border-bottom: 1px solid #999;
}
</style>
