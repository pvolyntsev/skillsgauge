import { Topic } from './topic.model';
import { TopicAnswers } from './topic-answers.model';
import deleteProperty = Reflect.deleteProperty;

export class TopicsAnswers {
  private _topicAnswersPlain = [];
  private _topicAnswers: TopicsAnswers[] = [];

  // добавить ответы на топик в сыром виде
  pushPlainAnswers(answers: any): void {
    if (answers.hasOwnProperty('key')) { // TODO более тщательная проверка
      this._topicAnswersPlain[answers.key] = answers;
      deleteProperty(this._topicAnswers, answers.key);
    }
  }

  // сохранить ответы на топик
  addTopicAnswers(answers: TopicAnswers): void {
    this._topicAnswers[answers.key] = answers;
  }

  // получить ответы на топик
  getTopicAnswers(topic: Topic): TopicAnswers {
    if (!this._topicAnswers.hasOwnProperty(topic.key)) {
      if (this._topicAnswersPlain.hasOwnProperty(topic.key)) {
        this._topicAnswers[topic.key] =
          TopicAnswers.fromObject(topic, this._topicAnswersPlain[topic.key]);
      } else {
        this._topicAnswers[topic.key] = new TopicAnswers(topic);
      }
    }
    return this._topicAnswers[topic.key] || null;
  }

  // ключи всех топиков, упоминаемых в ответах
  get allTopicsKeys(): string[] {
    return Object.keys({ ...this._topicAnswers, ...this._topicAnswersPlain });
  }
}
