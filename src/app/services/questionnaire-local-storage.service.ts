import { Injectable } from '@angular/core';
import { TopicAnswers } from '../models';

@Injectable()
export class QuestionnaireLocalStorageService {

  // загрузить последние версии всех ответов
  findLastTopicsAnswers(): object[] {
    const allTopicsAnswers = this.findAllTopicsAnswers();

    const lastTopicsAnswers = Object.keys(allTopicsAnswers)
      .reduce((carry, topicKey) => {
        // сортировка версий по возрастанию даты версии
        const versions = allTopicsAnswers[topicKey].sort((v1, v2) => {
          const d1 = Number(v1.date);
          const d2 = Number(v2.date);
          return d1 > d2 ? 1 : d1 < d2 ? -1 : 0;
        });

        carry.push(versions[versions.length - 1]);
        return carry;
      }, []);

    return lastTopicsAnswers;
  }

  // загрузить все версии всех ответов
  findAllTopicsAnswers(): object {
    const nowDt = new Date();
    const itemKeys = Object.keys(localStorage);

    // найти все ключи, относящиеся к ответам на топики
    return itemKeys.reduce((carry, itemKey) => {
      const [ topicKey, type, date ] = itemKey.split(':');
      if (type !== 'v') {
        return carry;
      }

      const item = localStorage.getItem(itemKey);
      const [obj, expiration] = JSON.parse(item);
      const expirationDt = new Date(expiration);
      if (expiration === null || expirationDt > nowDt) {
        if (!carry.hasOwnProperty(topicKey)) {
          carry[topicKey] = [];
        }
        carry[topicKey].push(obj);
      }
      return carry;
    }, {});
  }

  saveTopicAnswers(answer: TopicAnswers): void {
    const answerObj = answer.toObject();
    const { key, date } = answer;
    const expiration = null; // TODO 2 месяца на хранение new Date(now.getTime() + 2 * 30 * 24 * 60 * 60 * 1000 * ttl).getTime();
    const itemKey = [key, 'v', date].join(':');
    localStorage.setItem(itemKey, JSON.stringify([answerObj, expiration]));
  }
}
