import { Injectable } from '@angular/core';
import moment from 'moment';
import { Topic } from '../models/topic.model';

@Injectable()
export class QuestionnaireLocalStorageService {

  saveTopic(topic: Topic): void {
    const today = moment().format('YYYYMMDD');
    const key = [topic.key, today].join(':');
    const expiration = null; // TODO 2 месяца на хранение new Date(now.getTime() + 2 * 30 * 24 * 60 * 60 * 1000 * ttl).getTime();
    const value = {
      date: today,
      selected: topic.selected,
      version: topic.version,
      answers: topic.answers,
      terms: topic.terms.reduce((carry, term) => {
        carry[term.key] = term.answer.score;
        return carry;
      }, {}),
    };

    localStorage.setItem(key, JSON.stringify([value, expiration]));
  }

  loadTopic(topic: Topic): Topic {
    const topics = this.loadTopicVersions(topic);
    if (topics.length > 0) {
      return topics[0];
    }
    return topic;
  }

  loadTopicVersions(topic: Topic): Topic[] {
    const keys = Object.keys(localStorage);
    const topicKey = topic.key + ':';
    const nowDt = new Date();
    const versions = keys.reduce((carry, key) => {
      if (key.indexOf(topicKey) === 0) {
        const item = localStorage.getItem(key);
        const [value, expiration] = JSON.parse(item);
        const expirationDt = new Date(expiration);
        if (expiration === null || expirationDt > nowDt) {
          carry.push(value);
        }
      }
      return carry;
    }, []);

    const topics = versions.map((version) => {
      const { selected, terms } = version;
      const tempTopic = Object.assign(new Topic(), { ...topic, selected }); // TODO answerVersion: version.version
      const answersIdx = tempTopic.answers.reduce((carry, answer) => { carry[answer.score] = answer; return carry; }, {});

      tempTopic.terms.forEach((term) => {
        const answerScore = terms.hasOwnProperty(term.key) ? version.terms[term.key] : null;
        if (answerScore !== null) {
          term.answer = answersIdx[answerScore];
        }
      });

      return tempTopic;
    });

    return topics;
  }
}
