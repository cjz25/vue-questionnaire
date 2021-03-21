<template>
  <div class="container" style="max-width: 54rem;">
    <div v-if="id">
      <div v-if="allChangesSaved">All changes saved</div>
      <div v-else>Saving...</div>
    </div>
    <div class="card" @click="select(-1)">
      <div class="d-flex">
        <div class="cursor-color" :style="currentSelectedIndex === -1 ? { 'background-color': '#4285f4' } : null">
        </div>
        <div class="card-body">
          <div class="card-title row">
            <el-input
              :class="currentSelectedIndex === -1 ? '' : 'read-input'"
              type="textarea"
              placeholder="Form title"
              v-model="title"
              @input="debounceSaveQuestionnaire">
            </el-input>
          </div>
          <div class="card-text row">
            <el-input
              :class="currentSelectedIndex === -1 ? '' : 'read-input'"
              type="textarea"
              placeholder="Form description"
              v-model="description"
              @input="debounceSaveQuestionnaire">
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLoading && questions && questions.length">
      <draggable
        v-model="questions"
        v-bind="dragOptions"
        handle=".handle"
        item-key="id"
        @update="onUpdate"
      >
        <template #item="{ element, index }">
          <div class="my-3">
            <questionnaire-question
              :data="element"
              :isFocus="currentSelectedIndex === index"
              @click="select(index)"
              @edit-question="(...args) => debounceSaveQuestion(index, ...args)"
              @delete-question="deleteQuestion(index)"/>
          </div>
        </template>
      </draggable>
    </div>
    <nav class="navbar fixed-bottom navbar-light mx-auto" style="background-color: #ffffff;">
      <el-tooltip effect="dark" content="Add question" placement="right">
        <el-button
          icon="el-icon-circle-plus-outline"
          circle
          @click="addQuestion(questions.length)">
        </el-button>
      </el-tooltip>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import QuestionnaireQuestion from '@/components/question/Question.vue'
import { Question } from '../models/question.model'
import { QuestionType } from '@/enums/question-type.enum'
import { questionApiService } from '@/services/question-api.service'

import useQuestionnaireFetch from '@/composables/useQuestionnaireFetch'
import useQuestionnaireModify from '@/composables/useQuestionnaireModify'
import useQuestionModify from '@/composables/useQuestionModify'
import useQuestionDelete from '@/composables/useQuestionDelete'

import { ElNotification } from 'element-plus'

import _ from 'lodash'
import { tap, mergeMap, filter, switchMap } from 'rxjs/operators'

import draggable from 'vuedraggable'

export default defineComponent({
  name: 'QuestionnaireEdit',
  components: {
    QuestionnaireQuestion,
    draggable
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const id = ref(props.id);
    const allChangesSaved = ref(true);
    const currentSelectedIndex = ref(-1);
    const { title, description, questions, isLoading, questionnaireUnsubscribe$ } = useQuestionnaireFetch(id.value);

    const router = useRouter();

    const routeToEditQuestionnaire = (id: number) => {
      router.replace({ path: `/${id}/edit` });
    };

    const upsertQuestionnaire = () => {
      const questionnaire = {
        id: parseInt(id.value),
        title: title.value ? title.value : 'Form title', // defalut form
        description: description.value
      };
      allChangesSaved.value = false;
      const { upsertQuestionnaire } = useQuestionnaireModify(questionnaire);
      return upsertQuestionnaire().pipe(
        tap(data => {
          id.value = data.id;
          title.value = data.title;
          description.value = data.description;
          allChangesSaved.value = true;
          const routeToEditMode = !questionnaire.id;
          if (routeToEditMode) {
            routeToEditQuestionnaire(data.id);
          }
        })
      );
    };

    const saveQuestionnaire = () => {
      if (!id.value) {
        upsertQuestionnaire().pipe(
          tap(() => { allChangesSaved.value = false; }),
          switchMap(() => {
            const { upsertQuestion } = useQuestionModify(id.value, questions.value[0]);
            return upsertQuestion();
          })
        ).subscribe({
          next: data => {
            questions.value[0] = data;
            allChangesSaved.value = true;
          },
          error: error => {
            ElNotification({
              type: 'error',
              message: error,
              position: 'bottom-left'
            });
          }
        });
      } else {
        upsertQuestionnaire().subscribe();
      }
    };

    const debounceSaveQuestionnaire = _.debounce(saveQuestionnaire, 500);

    const saveQuestion = (index: number, fieldName: string, value: any) => {
      allChangesSaved.value = false;
      questions.value[index][fieldName] = value;
      questions.value[index].seq = index;

      if (QuestionType.multipleChoice !== questions.value[index].question_type &&
          QuestionType.checkbox !== questions.value[index].question_type) {
        delete questions.value[index].choices;
      }

      upsertQuestionnaire().pipe(
        tap(() => { allChangesSaved.value = false; }),
        mergeMap(() => {
          const { upsertQuestion } = useQuestionModify(id.value, questions.value[index]);
          return upsertQuestion();
        })
      ).subscribe({
        next: data => {
          questions.value[index] = data;
          allChangesSaved.value = true;
        },
        error: error => {
          ElNotification({
            type: 'error',
            message: error,
            position: 'bottom-left'
          });
        }
      });
    };
    const debounceSaveQuestion = _.debounce(saveQuestion, 500);

    return {
      allChangesSaved,
      currentSelectedIndex,
      isLoading,
      title,
      description,
      questions,
      debounceSaveQuestionnaire,
      debounceSaveQuestion,
      questionnaireUnsubscribe$,
      upsertQuestionnaire
    };
  },
  unmounted() {
    this.debounceSaveQuestionnaire.cancel();
    this.debounceSaveQuestion.cancel();
    this.questionnaireUnsubscribe$.next();
    this.questionnaireUnsubscribe$.complete();
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost'
      };
    }
  },
  methods: {
    select(index: number) {
      this.currentSelectedIndex = index;
    },
    addQuestion(index: number) {
      this.upsertQuestionnaire().pipe(
        tap(() => { this.allChangesSaved = false; }),
        mergeMap(() => {
          const question = new Question();
          question.seq = index;
          const { upsertQuestion } = useQuestionModify(this.id, question);
          return upsertQuestion();
        })
      ).subscribe({
        next: data => {
          this.questions.push(data);
          this.currentSelectedIndex = index;
          this.allChangesSaved = true;
        },
        error: error => {
          ElNotification({
            type: 'error',
            message: error,
            position: 'bottom-left'
          });
        }
      });
    },
    deleteQuestion(index: number) {
      this.upsertQuestionnaire().pipe(
        filter(() => this.questions[index].id),
        tap(() => { this.allChangesSaved = false; }),
        mergeMap(() => {
          const { deleteQuestion } = useQuestionDelete(this.id, this.questions[index].id);
          return deleteQuestion();
        })
      ).subscribe({
        next: () => {
          this.questions.splice(index, 1);

          if (index > 0) {
            this.currentSelectedIndex = index - 1;
          } else if (this.questions.length) {
            this.currentSelectedIndex = 0;
          } else {
            this.currentSelectedIndex = -1;
          }

          ElNotification({
            message: 'Question deleted',
            position: 'bottom-left'
          });
          this.allChangesSaved = true;
        },
        error: error => {
          ElNotification({
            type: 'error',
            message: error,
            position: 'bottom-left'
          });
        }
      });
    },
    onUpdate(event: any) {
      const newIndex = event.newIndex;
      this.allChangesSaved = false;
      questionApiService.adjustQuestionSequence(this.id, this.questions[newIndex].id, newIndex)
        .subscribe({
          next: response => {
            this.currentSelectedIndex = event.newIndex;
            this.allChangesSaved = true;
          },
          error: error => {
            ElNotification({
              type: 'error',
              message: error.message,
              position: 'bottom-left'
            });
          }
        });
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-button {
  font-size: 1.25rem;
  border: 0;
}
.navbar {
  max-width: 60rem;
  width: 90%;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  border-radius: 6px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #ebebeb;
}

.cursor-color {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  width: 6px;
}

.read-input::v-deep(.el-textarea__inner) {
  border: 1px solid #FFF;
  border-radius: 0;
  /* padding: 0; */
}
.el-textarea::v-deep(.el-textarea__inner) {
  resize: none;
}

.card-body {
  padding-left: 24px;
  padding-right: 24px;
}
.card-title::v-deep(.el-textarea__inner) {
  height: 48px;
  font-size: 32px;
}
.card-text::v-deep(.el-textarea__inner) {
  height: 21px;
  font-size: 14px;
}
.ghost {
  opacity: 0;
}
</style>
