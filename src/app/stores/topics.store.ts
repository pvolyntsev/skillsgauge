import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { defaultChoices, Topic, Topics, User } from '../models';
import { QuestionnaireLocalStorageService, QuestionnaireService } from '../services';
import { pseudoRandom } from '../pseudo-random';

// https://www.lucidchart.com/techblog/2016/11/08/angular-2-and-observables-data-sharing-in-a-multi-view-application/

@Injectable()
export class TopicsStore {
  private _topics = new BehaviorSubject(new Topics());
  private topicsLoaded = false;
  private topicsLoading = false;
  private ownTopicsLoaded = false;
  private ownTopicsLoading = false;
  private recommendedTopicsLoaded = false;
  private recommendedTopicsLoading = false;

  constructor(private questionnaire: QuestionnaireService,
              private localStorage: QuestionnaireLocalStorageService) { }

  // current value
  public get topics(): Topics {
    return this._topics.getValue();
  }

  public get allTopics(): Topic[] {
    return this.topics.allTopics;
  }

  public get loaded(): Boolean {
    return this.topicsLoaded
      && this.ownTopicsLoaded
      && this.recommendedTopicsLoaded;
  }

  public get loading(): Boolean {
    return this.topicsLoading
      || this.ownTopicsLoading
      || this.recommendedTopicsLoading;
  }

  public awaitTopics(topicsKeys?: string[]): Observable<Topics> {
    if (topicsKeys !== undefined && !this.loaded && !this.loading) {
      this.loadTopics(topicsKeys);
      this.loadOwnTopics(topicsKeys);
    }
    return this._topics.asObservable();
  }

  public awaitRecommendedTopics(): Observable<Topics> {
    if (!this.loaded && !this.loading) {
      this.loadRecommendedTopics();
    }
    return this._topics.asObservable();
  }

  private loadTopics(topicsKeys: string[]) {
    console.log('TopicsStore:loadTopics', topicsKeys);

    this.topicsLoaded = false;
    this.topicsLoading = true;
    this.questionnaire.topics(topicsKeys)
      .subscribe(
        this.onLoadTopicsSuccess.bind(this),
        this.onLoadTopicsError.bind(this)
      );
  }

  private onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicsStore:onLoadTopicsSuccess');

    this._topics.next(
      this.topics
        .pushOrReplaceTopics('topics', topics.topics
        )
    );
    this.topicsLoaded = true;
    this.topicsLoading = false;
  }

  private onLoadTopicsError(error: any): void {
    console.log('TopicsStore:onLoadTopicsError', error);

    this._topics.error(error);
    this.topicsLoaded = false;
    this.topicsLoading = false;
  }

  private loadOwnTopics(topicsKeys: string[]) {
    console.log('TopicsStore:loadOwnTopics', topicsKeys);

    this.ownTopicsLoaded = false;
    this.ownTopicsLoading = true;

    // сначала загрузить всё что есть в LocalStorage
    this.onLocalStorageTopics(this.localStorage.findAllTopics());

    // затем то, что есть на сервере
    this.questionnaire.ownTopics(topicsKeys)
      .subscribe(
        this.onLoadOwnTopicsSuccess.bind(this),
        this.onLoadOwnTopicsError.bind(this)
      );
  }

  // завершение загрузки ответов из LocalStorage
  private onLocalStorageTopics(topics: Topic[]): void {
    console.log('TopicsStore:onLocalStorageTopics');
    this._topics.next(
      this.topics
        .pushOrReplaceTopics('ownTopics', topics
        )
    );
  }

  private onLoadOwnTopicsSuccess(topics: Topics): void {
    console.log('TopicsStore:onLoadOwnTopicsSuccess');

    this._topics.next(
      this.topics
        .pushOrReplaceTopics('ownTopics', topics.topics
        )
    );
    this.ownTopicsLoaded = true;
    this.ownTopicsLoading = false;
  }

  private onLoadOwnTopicsError(error: any): void {
    console.log('TopicsStore:onLoadTopicsError', error);

    this._topics.error(error);
    this.ownTopicsLoaded = false;
    this.ownTopicsLoading = false;
  }

  private loadRecommendedTopics() {
    console.log('TopicsStore:loadRecommendedTopics');

    this.recommendedTopicsLoaded = false;
    this.recommendedTopicsLoading = true;
    this.questionnaire.recommendedTopics()
      .subscribe(
        this.onLoadRecommendedTopicsSuccess.bind(this),
        this.onLoadRecommendedTopicsError.bind(this)
      );
  }

  private onLoadRecommendedTopicsSuccess(topics: Topics): void {
    console.log('TopicsStore:onLoadRecommendedTopicsSuccess');

    this._topics.next(
      this.topics
        .pushOrReplaceTopics('recommendedTopics', topics.topics
        )
    );
    this.recommendedTopicsLoaded = true;
    this.recommendedTopicsLoading = false;
  }

  private onLoadRecommendedTopicsError(error: any): void {
    console.log('TopicsStore:onLoadRecommendedTopicsError', error);

    this._topics.error(error);
    this.recommendedTopicsLoaded = false;
    this.recommendedTopicsLoading = false;
  }

  // создать новый топик
  public createTopic(owner: User): Topic {
    const topic = Topic.fromObject({
      key: pseudoRandom(8),
      owner,
      choices: defaultChoices,
    });

    // сохранить
    // TODO HTTP
    this.localStorage.saveTopic(topic);

    // добавить в список
    this._topics.next(
      this.topics
        .pushOrReplaceTopics('ownTopics', [ topic ]
      )
    );

    return topic;
  }

  // создать копию топика из исходного топика
  public copyTopic(owner: User, sourceTopic: Topic): Topic {
    const topic = Topic.fromObject({
      ...sourceTopic.toObject(),
      sourceKey: sourceTopic.key,
      key: pseudoRandom(8),
      owner,
    });

    // TODO HTTP
    this.localStorage.saveTopic(topic);

    // TODO скопировать ответы на оригинальный топик

    // добавить в список
    this._topics.next(
      this.topics
        .pushOrReplaceTopics('ownTopics', [ topic ]
        )
    );

    return topic;
  }
}
