<template>
  <div class="card mx-auto">
    <div class="d-flex">
      <div class="cursor-color" :style="isFocus ? { 'background-color': '#4285f4' } : null">
      </div>
      <div class="card-body">
        <div class="card-title row">
          <div class="col-md-8 col-sm-12">
            <el-input
              :class="isFocus ? '' : 'read-input'"
              placeholder="Question title"
              v-model="title"
              @input="$emit('editQuestion', 'title', title)"
            ></el-input>
          </div>
          <div class="col-md-4 col-sm-6">
            <div class="d-flex">
              <div class="ml-auto">
                <el-select
                  v-if="isFocus"
                  v-model="selectedQuestionType"
                  @change="$emit('editQuestion', 'question_type', $event.value)">
                  <template v-slot:prefix>
                    <span class="ml-1">
                      <font-awesome-icon
                        v-if="selectedQuestionType.value == multipleChoice"
                        :icon="['far', 'dot-circle']"/>
                      <font-awesome-icon
                        v-else-if="selectedQuestionType.value == checkbox"
                        :icon="['fas', 'check-square']"/>
                      <font-awesome-icon
                        v-else
                        :icon="['fas','grip-lines']"/>
                    </span>
                    <!-- not work -->
                    <!-- <font-awesome-icon :icon="[selectedQuestionType.iconType, selectedQuestionType.icon]"/> -->
                  </template>
                  <el-option
                    v-for="option in questionTypeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option">
                    <font-awesome-icon :icon="[option.iconType, option.icon]"/>
                    <span style="padding-left: 12px;">{{ option.label }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="card-text row">
          <div class="col-12">
            <el-input
              type="textarea"
              :class="isFocus ? '' : 'read-input'"
              placeholder="Question description"
              v-model="description"
              @input="$emit('editQuestion', 'description', description)">
            </el-input>
          </div>
        </div>
        <component
          :is="selectedComponentName"
          v-bind:choices="choices"
          v-bind:isFocus="isFocus"
          @edit-choice="$emit('editQuestion', 'choices', $event)">
        </component>
        <template v-if="isFocus">
          <hr>
          <div class="float-right">
            <el-button
              icon="el-icon-delete"
              circle
              @click="$emit('deleteQuestion')">
            </el-button>
            <el-divider direction="vertical"></el-divider>
            Required
            <el-switch
              class="mx-2"
              v-model="required"
              @change="$emit('editQuestion', 'required', required)">
            </el-switch>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType, toRefs, watch, computed } from 'vue'
import Checkbox from '@/components/question/Checkbox.vue'
import MultipleChoice from '@/components/question/MultipleChoice.vue'
import ShortAnswer from '@/components/question/ShortAnswer.vue'
import { IQuestion } from '@/models/question.model'
import { QuestionType } from '@/enums/question-type.enum'

export default defineComponent({
  name: 'Question',
  components: {
    Checkbox,
    MultipleChoice,
    ShortAnswer
  },
  props: {
    data: {
      type: Object as PropType<IQuestion>,
      required: true
    },
    isFocus: {
      type: Boolean,
      required: false
    }
  },
  setup(props) {
    const questionTypeOptions = reactive(
      [{
        component: MultipleChoice.name,
        value: QuestionType.multipleChoice,
        label: 'Multiple choice',
        icon: 'dot-circle',
        iconType: 'far'
      },
      {
        component: Checkbox.name,
        value: QuestionType.checkbox,
        label: 'Checkboxes',
        icon: 'check-square',
        iconType: 'fas'
      },
      {
        component: ShortAnswer.name,
        value: QuestionType.shortAnswer,
        label: 'Short answer',
        icon: 'grip-lines',
        iconType: 'fas'
      }]);

    const { id, seq, title, description, required, visible, question_type, choices } = toRefs(props.data);
    const selectedQuestionType = ref(questionTypeOptions[0]);
    const selectedComponentName = ref(questionTypeOptions[0].component);

    if (props.data.id) {
      const option = questionTypeOptions.find(x => x.value === question_type.value);
      if (option) {
        selectedQuestionType.value = option;
      }
    }

    watch(() => props.data.question_type, (newVal) => {
      const option = questionTypeOptions.find(x => x.value === newVal);
      if (option) {
        selectedQuestionType.value = option;
        selectedComponentName.value = option.component;
      }
    });

    watch(() => props.data.choices, (newVal) => {
      choices.value = newVal;
    });

    const multipleChoice = computed(() => {
      return QuestionType.multipleChoice;
    });

    const checkbox = computed(() => {
      return QuestionType.checkbox;
    });

    const shortAnswer = computed(() => {
      return QuestionType.shortAnswer;
    });

    return {
      id, seq, title, description, required, visible, question_type, choices, questionTypeOptions, selectedQuestionType, multipleChoice, checkbox, shortAnswer, selectedComponentName
    };
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.question {
  max-width: 770px;
}
.cursor-color {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  width: 6px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-select-dropdown__item {
  padding-left: 12px;
}
.el-button {
  border: 0;
}
.card-title::v-deep(.el-input__inner) {
  font-size: 16px;
}
.card-text::v-deep(.el-textarea__inner) {
  font-size: 12px;
}
.read-input::v-deep(.el-input__inner) {
  border: 1px solid #FFF;
  border-radius: 0;
  padding: 0;
}
.read-input::v-deep(.el-textarea__inner) {
  border: 1px solid #FFF;
  border-radius: 0;
  padding: 0;
}
.el-textarea::v-deep(.el-textarea__inner) {
  resize: none;
}
</style>
