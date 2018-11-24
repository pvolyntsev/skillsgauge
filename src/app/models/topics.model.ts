import { Topic } from './topic.model';
import { Term } from './term.model';
import { AnswerVariant } from './answer-variant.model';

function topicMapper(topic): Topic {
  return Object.assign(new Topic(), {
    ...topic,
    terms: topic.terms.map(term => termMapper(term)),
    answers: topic.answers.map(answer => answerMapper(answer)),
  });
}

function termMapper(term): Term {
  return Object.assign(new Term(), term);
}

function answerMapper(answer): AnswerVariant {
  return Object.assign(new AnswerVariant(), answer);
}

export class Topics {
  topics: Topic[] = [];

  public assign(obj: any): Topics {
    this.topics = obj.topics.map(topic => topicMapper(topic));
    return this;
  }

  // выбранные топики
  // @example: this.selectedTopics
  public get selectedTopics(): Topic[] {
    return this.topics.filter(t => t.selected === true);
  }

  // количество баллов по выбранным топикам
  // @example: this.score
  public score(): number {
    return this.topics.reduce((sum, topic) => sum + topic.score, 0);
  }

  // максимальное количество баллов по выбранным топикам
  // @example: this.maximumScore
  public maximumScore(): number {
    return this.topics.reduce((sum, topic) => sum + topic.maximumScore, 0);
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
}
