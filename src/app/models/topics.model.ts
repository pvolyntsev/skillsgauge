import { Topic } from './topic.model';

export class Topics {
  topics: Topic[] = [];
  ownTopics: Topic[] = [];
  recommendedTopics: Topic[] = [];

  public static fromObject(obj: any): Topics {
    const instance = new Topics();
    const topics = (obj.topics || []).map(topic => Topic.fromObject(topic));
    const ownTopics = (obj.ownTopics || []).map(topic => Topic.fromObject(topic));
    const recommendedTopics = (obj.recommended || []).map(topic => Topic.fromObject(topic));
    return Object.assign(instance, {
      ...obj,
      topics,
      ownTopics,
      recommendedTopics,
    });
  }
}
