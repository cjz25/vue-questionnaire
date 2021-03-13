import { questionnaireApiService } from '@/services/questionnaire-api.service'
import { IQuestion, Question } from '@/models/question.model';

import { ref, onMounted } from 'vue';

import { throwError, Subject, Subscription } from 'rxjs'
import { catchError, map, takeUntil } from 'rxjs/operators'

import { ElNotification } from 'element-plus'
import { Questionnaire } from '@/models/questionnaire.model';

export default function useQuestionnaireFetch(id: string) {
  const questionnaire = new Questionnaire();
  const title = ref(questionnaire.title);
  const description = ref(questionnaire.description);
  const questions: {[index: string]: any} = ref<Array<IQuestion>>([new Question()]);
  const isLoading = ref(!!id);
  const questionnaireUnsubscribe$ = new Subject();

  const getQuestionnaire = () => {
    if (id) {
      questionnaireApiService.getQuestionnaire(id).pipe(
        takeUntil(questionnaireUnsubscribe$),
        map(response => {
          if (response && response.status === 200) {
            return response.data;
          } else {
            return throwError(response.statusText);
          }
        }),
        catchError(err => { throw err.message; })
      ).subscribe({
        next: data => {
          title.value = data.title;
          description.value = data.description;
          questions.value = data.questions;
          isLoading.value = false;
        },
        error: error => {
          ElNotification({
            type: 'error',
            message: error,
            position: 'bottom-left'
          });
        }
      });
    }
  }

  onMounted(getQuestionnaire);

  return {
    title,
    description,
    questions,
    isLoading,
    getQuestionnaire,
    questionnaireUnsubscribe$
  };
}
