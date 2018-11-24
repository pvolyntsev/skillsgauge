import { URLResource } from './url-resource.model';
import { AnswerVariant } from './answer-variant.model';

export class Term {
  key = '';
  title = '';
  description: string;
  hint: string;
  links: URLResource[];
  answer: AnswerVariant = new AnswerVariant();

  public get score(): number {
    return this.answer.score;
  }
}
