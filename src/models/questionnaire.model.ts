import { IQuestion } from './question.model';

export interface IQuestionnaire {
  id?: number;
  title: string;
  description?: string;
  questions?: IQuestion[];
  updated_dtm?: string; // ISO 8601 time string
}

export class Questionnaire implements IQuestionnaire {
  id?: number;
  title = 'Form title';
  description?: string = '';
  questions?: IQuestion[];
  updated_dtm?: string; // ISO 8601 time string
}
