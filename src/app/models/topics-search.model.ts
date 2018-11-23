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

export class TopicsSearch {
  topics: Topic[] = [];

  public assign(obj: any): TopicsSearch {
    this.topics = obj.topics.map(topic => topicMapper(topic));
    return this;
  }
}
