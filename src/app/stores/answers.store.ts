import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Topic, TopicAnswers, Topics, TopicsAnswers } from '../models';
import { QuestionnaireLocalStorageService, QuestionnaireService } from '../services';
import { TopicsStore } from './topics.store';

@Injectable()
export class AnswersStore implements OnDestroy {
  private _topics: Topics = new Topics();
  private readonly _topicsSubscription: Subscription;

  private _answers = new BehaviorSubject(new TopicsAnswers());
  private answersLoaded = false;
  private answersLoading = false;

  constructor(private questionnaire: QuestionnaireService,
              private localStorage: QuestionnaireLocalStorageService,
              private topicsStore: TopicsStore) {
    // обработчик на загрузку топиков
    this._topicsSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicSuccess(topics); },
        (error) => { /* console.log(error); */ }
      );
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._topicsSubscription.unsubscribe();
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

    this.questionnaire.answers()
      .subscribe(
        this.onLoadAnswersSuccess.bind(this),
        this.onLoadAnswersError.bind(this)
      );
  }

  onLoadAnswersSuccess(answers: TopicAnswers[]): void {
    console.log('AnswersStore:onLoadAnswersSuccess');

    /*
    // Можно бы ввести Mutex но NodeJS однопоточный
    const _answers = new TopicsAnswers();
    _answers.
    _topics.topics = topics.topics;
    this._answers.next(_topics);
    */
    this.answersLoaded = true;
    this.answersLoading = false;
  }

  onLoadAnswersError(error: any): void {
    console.log('AnswersStore:onLoadAnswersError');
    console.log(error);

    this._answers.error(error);
    this.answersLoaded = false;
    this.answersLoading = false;
  }

  onLoadTopicSuccess(topics: Topics): void {
    this._topics = topics;
  }

  // выбранные топики
  // @example: this.selectedTopics
  public get selectedTopics(): Topic[] {
    // return [
    //   ...(this.topics.filter(t => t.selected === true)),
    //   ...this.ownTopics,
    // ];
    return [];
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
