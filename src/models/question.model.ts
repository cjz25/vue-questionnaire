import { QuestionType } from '@/enums/question-type.enum';
import { Choice } from './choice.model';

export interface IQuestion {
  id?: number;
  seq: number;
  title: string;
  description?: string;
  required: boolean;
  question_type: string;
  visible: boolean;
  choices: Choice[];
}

export class Question implements IQuestion {
  id?: number;
  seq = 0;
  title = 'Question';
  description?: string = '';
  required = false;
  question_type: string = QuestionType.multipleChoice;
  visible = true;
  choices: Choice[] = [];
}
