import { from } from 'rxjs';

import { Question } from '@/models/question.model';
import http from '@/config/api';

const questionnaireAPI = '/questionnaires/';
const questionAPI = '/questions/';

class QuestionnApiService {
  createQuestion(questionnaireId: string, question: Question) {
    return from(http.post(questionnaireAPI + questionnaireId + questionAPI, question));
  }

  updateQuestion(questionnaireId: string, question: Question) {
    return from(http.put(questionnaireAPI + questionnaireId + questionAPI + question.id + '/', question));
  }

  deleteQuestion(questionnaireId: string, questionId: string) {
    return from(http.delete(questionnaireAPI + questionnaireId + questionAPI + questionId + '/'));
  }

  adjustQuestionSequence(questionnaireId: string, questionId: string, newSeq: number) {
    const payload = { new_seq: newSeq };
    return from(http.put(questionnaireAPI + questionnaireId + questionAPI + questionId + '/sequence/', payload));
  }
}

export const questionApiService = new QuestionnApiService();
