import { Questionnaire } from '@/models/questionnaire.model';
import { questionnaireApiService } from '@/services/questionnaire-api.service';
import { onMounted, ref, watch } from 'vue';

export default function useQuestionnaireList(pageSize: any, currentPage: any) {
  const questionnaires = ref<Questionnaire[]>([]);
  const total = ref(0);

  const getQuestionnaireList = () => {
    questionnaireApiService.getQuestionnaireList(pageSize.value, currentPage.value)
      .subscribe(response => {
        if (response && response.data) {
          questionnaires.value = response.data.results;
          total.value = response.data.count;
        }
      });
  };

  onMounted(getQuestionnaireList);
  watch(pageSize, getQuestionnaireList);
  watch(currentPage, getQuestionnaireList);

  return {
    questionnaires,
    total,
    getQuestionnaireList
  };
}
