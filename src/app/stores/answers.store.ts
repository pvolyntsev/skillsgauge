import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Topic, Topics, TopicsAnswers } from '../models';
import { QuestionnaireLocalStorageService, QuestionnaireService } from '../services';
import { TopicsStore } from './topics.store';

@Injectable()
export class AnswersStore {
  private _topics: Topics = new Topics();
  private _answers = new BehaviorSubject(new TopicsAnswers());
  private answersLoaded = false;
  private answersLoading = false;

  constructor(private questionnaire: QuestionnaireService,
              private localStorage: QuestionnaireLocalStorageService,
              private topicsStore: TopicsStore) {
  }

  // current value
  get answers(): TopicsAnswers {
    return this._answers.getValue();
  }

  get loaded(): Boolean {
    return this.answersLoaded;
  }

  get loading(): Boolean {
    return this.answersLoading;
  }

  awaitAnswers(): Observable<TopicsAnswers> {
    if (!this.loaded && !this.loading) {
      this.loadAnswers();
    }
    return this._answers.asObservable();
  }

  loadAnswers() {
    console.log('TopicsStore:loadTopics');
    this.answersLoaded = false;
    this.answersLoading = false;

    // сначала загрузить всё что есть в LocalStorage
    this.onLocalStorageAnswers(this.localStorage.findLastTopicsAnswers());

    // затем то, что есть на сервере
    this.questionnaire.answers()
      .subscribe(
        this.onLoadAnswersSuccess.bind(this),
        this.onLoadAnswersError.bind(this)
      );
  }

  // завершение загрузки ответов из LocalStorage
  onLocalStorageAnswers(answers: object[]): void {
    console.log('AnswersStore:onLocalStorageAnswers');

    const _answers = this.answers;
    answers.map(obj => _answers.pushPlainAnswers(obj));
    this._answers.next(_answers);

    // загрузить топики с сервера
    this.loadTopics();
  }

  // завершение загрузки ответов с сервера
  onLoadAnswersSuccess(answers: object[]): void {
    console.log('AnswersStore:onLoadAnswersSuccess');

    const _answers = this.answers;
    answers.map(obj => _answers.pushPlainAnswers(obj));
    this._answers.next(_answers);
    this.answersLoaded = true;
    this.answersLoading = false;

    // загрузить топики с сервера
    this.loadTopics();
  }

  onLoadAnswersError(error: any): void {
    console.log('AnswersStore:onLoadAnswersError');
    console.log(error);

    this._answers.error(error);
    this.answersLoaded = false;
    this.answersLoading = false;
  }

  // загрузить топики с сервера
  loadTopics(): void {
    const topicsKeys = this.answers.allTopicsKeys;
    this.topicsStore.awaitTopics(topicsKeys)
      .subscribe(
        (topics) => { this._topics = topics; },
        (error) => { /* console.log(error); */ }
      );
  }

  // все топики
  public get topics(): Topic[] {
    const topics = [
      ...this._topics.topics,
      ...this._topics.ownTopics,
      ...this._topics.recommendedTopics,
    ];
    return topics.reduce((carry, topic) => {
      if (!carry.find(t => t.key === topic.key)) {
        carry.push(topic);
      }
      return carry;
    }, []);
  }

  // выбранные топики
  // @example: this.selectedTopics
  public get selectedTopics(): Topic[] {
    return this.topics.filter(topic => {
      const answers = this.answers.getTopicAnswers(topic);
      return answers && answers.selected;
    });
  }

  // количество баллов по выбранным топикам
  // @example: this.score
  public get score(): number {
    return this.selectedTopics.reduce((sum, topic) => {
      const answers = this.answers.getTopicAnswers(topic);
      return sum + (answers ? answers.score : 0);
    }, 0);
  }

  // максимальное количество баллов по выбранным топикам
  // @example: this.maximumScore
  public get maximumScore(): number {
    return this.selectedTopics.reduce((sum, topic) => {
      const answers = this.answers.getTopicAnswers(topic);
      return sum + (answers ? answers.maximumScore : 0);
    }, 0);
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

  // первый не полностью заполненный топик
  public get firstIncomplete(): Topic {
    // 1. если есть совсем незаполненный топик
    let incompleteTopic = this.selectedTopics.find(topic => {
      const answers = this.answers.getTopicAnswers(topic);
      return answers && answers.selected && answers.score === 0;
    });

    // 2. есть есть неполностью заполненный топик
    if (!incompleteTopic) {
      incompleteTopic = this.selectedTopics.find(topic => {
        const answers = this.answers.getTopicAnswers(topic);
        return answers && answers.score < answers.maximumScore;
      });
    }

    // 3. если есть какой-нибудь топик
    if (!incompleteTopic) {
      incompleteTopic = this.selectedTopics.length > 0 ? this.selectedTopics[0] : null;
    }

    return incompleteTopic;
  }
}
