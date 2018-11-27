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

  // выбранные топики
  // @example: this.selectedTopics
  public get selectedTopics(): Topic[] {
    return [
      ...(this.topics.filter(t => t.selected === true)),
      ...this.ownTopics,
    ];
  }

  // количество баллов по выбранным топикам
  // @example: this.score
  public get score(): number {
    return this.selectedTopics.reduce((sum, topic) => sum + topic.score, 0);
  }

  // максимальное количество баллов по выбранным топикам
  // @example: this.maximumScore
  public get maximumScore(): number {
    return this.selectedTopics.reduce((sum, topic) => sum + topic.maximumScore, 0);
  }

  // процент достижения по всем топикам
  // @example: this.percentage
  public get percentage(): number {
    const { maximumScore, score } = this;
    if (maximumScore > 0) {
      return Math.round(score / maximumScore * 100);
    }
    return 0;
  }

  public get firstIncomplete(): Topic {
    // 1. если есть совсем незаполненный топик
    let incompleteTopic = this.selectedTopics.find(topic => topic.selected && topic.score === 0);

    // 2. есть есть неполностью заполненный топик
    if (!incompleteTopic) {
      incompleteTopic = this.selectedTopics.find(topic => topic.score < topic.maximumScore);
    }

    // 3. если есть какой-нибудь топик
    if (!incompleteTopic) {
      incompleteTopic = this.selectedTopics.length > 0 ? this.selectedTopics[0] : null;
    }

    return incompleteTopic;
  }

  // предыдущий выбранный топик
  public prevTopic(key: string): Topic {
    let prev = null;
    let temp = null;
    this.selectedTopics.forEach((topic) => {
      if (topic.selected) {
        if (topic.key === key) {
          prev = temp;
        }
        temp = topic;
      }
    });
    return prev;
  }

  // следующий выбранный топик
  public nextTopic(key: string): Topic {
    let next = null;
    let temp = null;
    this.selectedTopics.forEach((topic) => {
      if (topic.selected) {
        if (temp && temp.key === key) {
          next = topic;
        }
        temp = topic;
      }
    });
    return next;
  }
}
