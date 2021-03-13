import { questionnaireApiService } from '@/services/questionnaire-api.service'
import { Questionnaire } from '@/models/questionnaire.model';

import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { ElNotification } from 'element-plus'

export default function useQuestionnaireModify(questionnaire: Questionnaire) {
  const errorHandler = (error: any) => {
    ElNotification({
      type: 'error',
      message: error.message,
      position: 'bottom-left'
    });
    return Observable.throw(error.message || 'server error');
  };

  const upsertQuestionnaire = () => {
    if (!questionnaire.id) {
      return questionnaireApiService.createQuestionnaire(questionnaire).pipe(
        map(response => {
          if (response && response.status === 201) {
            return response.data;
          } else {
            return throwError(response.statusText);
          }
        }),
        catchError(errorHandler)
      )
    } else {
      return questionnaireApiService.updateQuestionnaire(questionnaire.id.toString(), questionnaire).pipe(
        map(response => {
          if (response && response.status === 200) {
            return response.data;
          } else {
            return throwError(response.statusText);
          }
        }),
        catchError(errorHandler)
      );
    }
  };

  return { upsertQuestionnaire };
}
