import { URLResource } from './url-resource.model';
import { AnswerVariant } from './answer-variant.model';
import { Topic } from './topic.model';

export class TopicTerm {
  key = '';
  title = '';
  description: string;
  hint: string;
  links: URLResource[];
  answer: AnswerVariant = new AnswerVariant();
  private _topic: Topic;

  constructor(topic) {
    this._topic = topic;
  }

  public get score(): number {
    return this.answer.score;
  }
}
