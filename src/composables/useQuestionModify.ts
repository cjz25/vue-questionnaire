import { questionApiService } from '@/services/question-api.service'
import { Question } from '@/models/question.model';

import { throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

export default function useQuestionModify(questionnaireId: string, question: Question) {
  const upsertQuestion = () => {
    if (!question.id) {
      return questionApiService.createQuestion(questionnaireId, question).pipe(
        map(response => {
          if (response && response.status === 201) {
            return response.data;
          } else {
            return throwError(response.statusText);
          }
        }),
        catchError(err => { throw err.message; })
      );
    } else {
      return questionApiService.updateQuestion(questionnaireId, question).pipe(
        map(response => {
          if (response && response.status === 200) {
            return response.data;
          } else {
            return throwError(response.statusText);
          }
        }),
        catchError(err => { throw err.message; })
      );
    }
  }

  return { upsertQuestion };
}
