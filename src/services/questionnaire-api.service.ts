import { from } from 'rxjs';

import { Questionnaire } from '@/models/questionnaire.model'
import http from '@/config/api';

const questionnaireAPI = '/questionnaires/';

class QuestionnaireApiService {
  getQuestionnaireList(pageSize: number, page: number) {
    return from(http.get(questionnaireAPI + `list?pageSize=${pageSize}&page=${page}`));
  }

  getQuestionnaire(id: string) {
    return from(http.get(questionnaireAPI + id));
  }

  createQuestionnaire(questionnaire: Questionnaire) {
    return from(http.post(questionnaireAPI, questionnaire));
  }

  updateQuestionnaire(questionnaireId: string, questionnaire: Questionnaire) {
    return from(http.put(questionnaireAPI + questionnaireId + '/', questionnaire));
  }

  deleteQuestionnaire(id: string) {
    return from(http.delete(questionnaireAPI + id));
  }
}

export const questionnaireApiService = new QuestionnaireApiService();
