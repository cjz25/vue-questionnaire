<template>
  <div class="container">
    <div class="row">
      <div class="pl-3">
        <h4>{{ msg }}</h4>
      </div>
      <div class="ml-auto">
        <el-button
          type="primary"
          size="medium"
          @click="$router.push({ name: 'QuestionnaireAdd' })">
          Add
        </el-button>
      </div>
    </div>
    <questionnaire-list-table
      class="my-3"
      :tableData="questionnaires"
      :total="total"
      @edit-questionnaire="editQuestionnaire"
      @delete-questionnaire="openDeleteQuestionnaireDialog"
      @change-current-page="handleCurrentChange"
      @change-page-size="handleSizeChange"/>
    <el-dialog
      title="Delete Questionnaire"
      v-model="dialogVisible"
      width="45%">
      <span>This record will be deleted and cannot undo. Are you sure to continue?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="deleteQuestionnaire">Delete</el-button>
          <el-button @click="dialogVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import { questionnaireApiService } from '@/services/questionnaire-api.service'
import QuestionnaireListTable from '@/components/question/QuestionnaireListTable.vue'
import useQuestionnaireList from '@/composables/useQuestionnaireList'

import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'Home',
  components: {
    QuestionnaireListTable
  },
  setup() {
    const msg = ref('My Questionnaires');
    const currentPage = ref(1);
    const pageSize = ref(5);

    const { questionnaires, total } = useQuestionnaireList(pageSize, currentPage);

    const handleCurrentChange = (newCurrentPage: number) => {
      currentPage.value = newCurrentPage;
    };

    const handleSizeChange = (newePageSize: number) => {
      pageSize.value = newePageSize;
    };

    const router = useRouter();

    const editQuestionnaire = (id: number) => {
      router.push({ path: `/${id}/edit` });
    };

    return {
      msg, questionnaires, editQuestionnaire, total, currentPage, pageSize, handleCurrentChange, handleSizeChange
    };
  },
  data() {
    return {
      dialogVisible: false,
      idToBeDeleted: 0
    };
  },
  methods: {
    openDeleteQuestionnaireDialog(id: number) {
      this.idToBeDeleted = id;
      this.dialogVisible = true;
    },
    deleteQuestionnaire() {
      this.dialogVisible = false;
      questionnaireApiService.deleteQuestionnaire(this.idToBeDeleted.toString())
        .pipe(
          switchMap(response => {
            if (response.status === 204) {
              ElNotification({
                message: 'Record deleted',
                position: 'bottom-left'
              });
              return questionnaireApiService.getQuestionnaireList(this.pageSize, this.currentPage);
            } else {
              return throwError(response.statusText);
            }
          })
        ).subscribe({
          next: response => {
            this.questionnaires = response.data.results;
            this.total = response.data.count;
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
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container:deep(.el-dialog__body) {
  word-break: keep-all;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
