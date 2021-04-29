<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ 'background-color': '#f1f2f3' }">
        <el-table-column
          prop="title"
          label="Title">
        </el-table-column>
        <el-table-column
          prop="description"
          label="Description">
        </el-table-column>
        <el-table-column
          prop="updated_dtm"
          label="Update date"
          :formatter="toLocaleDateString">
        </el-table-column>
        <el-table-column
          align="right"
          width="100px">
          <template #default="scope">
            <el-button
              size="small"
              circle
              @click="$emit('editQuestionnaire', scope.row.id)">
              <font-awesome-icon :icon="['fas', 'pen']"/>
            </el-button>
            <el-button
              size="small"
              circle
              @click="$emit('deleteQuestionnaire', scope.row.id)">
              <font-awesome-icon :icon="['fas', 'trash']"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mb-3 row justify-content-center">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        @size-change="$emit('changePageSize', pageSize)"
        @current-change="$emit('changeCurrentPage', currentPage)"
        v-model:currentPage="currentPage"
        :page-sizes="[1, 5, 10]"
        v-model:page-size="pageSize"
        :total="total"
        :hide-on-single-page="true">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { Questionnaire } from '@/models/questionnaire.model'

export default defineComponent({
  name: 'QuestionnaireListTable',
  props: {
    tableData: {
      type: Object as PropType<Questionnaire[]>,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  setup() {
    const currentPage = ref(1);
    const pageSize = ref(5);

    return {
      currentPage, pageSize
    };
  },
  methods: {
    toLocaleDateString(row: any, column: any) {
      const date = row[column.property];
      if (date === undefined) {
        return '';
      } else {
        return new Date(date).toLocaleDateString();
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-button {
  border: 0;
}
</style>
