import { URLResource } from './url-resource.model';
import { Choice } from './choice.model';
import { Topic } from './topic.model';

export class TopicTerm {
  private readonly _topic: Topic;

  key = '';
  title = '';
  description: string;
  hint: string;
  links: URLResource[];

  constructor(topic) {
    this._topic = topic;
  }

  public static fromObject(topic: Topic, obj: any): TopicTerm {
    const { key, title, description, hint } = obj;
    const instance = new TopicTerm(topic);
    const links = (obj.links || []).map(link => URLResource.fromObject(link));
    return Object.assign(instance, { key, title, description, hint, links });
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
