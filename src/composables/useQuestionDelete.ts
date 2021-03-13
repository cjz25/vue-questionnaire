import { questionApiService } from '@/services/question-api.service'

import { throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

export default function useQuestionDelete(questionnaireId: string, questionId: string) {
  const deleteQuestion = () =>
    questionApiService.deleteQuestion(questionnaireId, questionId).pipe(
      map(response => {
        if (response && response.status === 204) {
          return response.data;
        } else {
          return throwError(response.statusText);
        }
      }),
      catchError(err => { throw err.message; })
    );

  return { deleteQuestion };
}
