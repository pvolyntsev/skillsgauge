import { Topic } from './topic.model';

export class Topics {
  topics: Topic[] = [];
  ownTopics: Topic[] = [];

  public static fromObject(obj: any): Topics {
    const instance = new Topics();
    const topics = (obj.topics || []).map(topic => Topic.fromObject(topic));
    const ownTopics = (obj.ownTopics || []).map(topic => Topic.fromObject(topic));
    return Object.assign(instance, {
      ...obj,
      topics,
      ownTopics,
    });
  }
}
