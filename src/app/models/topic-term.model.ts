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

  // example: this.score
  public get score(): number {
    return this.answer.score;
  }

  public get topic(): Topic {
    return this._topic;
  }

  // example: this.htmlId
  public get htmlId(): string {
    return [
      this._topic.htmlId,
      this.key,
    ].join('__');
  }
}
