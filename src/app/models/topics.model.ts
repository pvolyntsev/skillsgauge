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
      topics,
      ownTopics,
      recommendedTopics,
    });
  }

  // все топики
  public get allTopics(): Topic[] {
    const topics = [
      ...this.topics,
      ...this.ownTopics,
      ...this.recommendedTopics,
    ];
    return topics.reduce((carry, topic) => {
      if (!carry.find(t => t.key === topic.key)) {
        carry.push(topic);
      }
      return carry;
    }, []);
  }

  // добавить несколько топиков c заменой
  public pushOrReplaceTopics(property: string, topics: Topic[]): Topics {
    if (!this.hasOwnProperty(property)) {
      return this;
    }

    const target = this[property];
    topics.map(topic => {
      const sameTopicIndex = this[property].findIndex(t => t.key === topic.key)
      if (sameTopicIndex >= 0) {
        target[sameTopicIndex] = topic;
      } else {
        target.push(topic);
      }
    });

    return this;
  }

  // удалить топик
  public removeTopic(topicKey: string): Topics {
    // this.topics = this.topics.filter(t => t.key !== topicKey);
    this.ownTopics = this.ownTopics.filter(t => t.key !== topicKey);
    return this;
  }
}
