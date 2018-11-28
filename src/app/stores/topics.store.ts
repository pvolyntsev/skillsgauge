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
  get topics(): Topics {
    return this._topics.getValue();
  }

  get loaded(): Boolean {
    return this.topicsLoaded
      && this.ownTopicsLoaded
      && this.recommendedTopicsLoaded;
  }

  get loading(): Boolean {
    return this.topicsLoading
      || this.ownTopicsLoading
      || this.recommendedTopicsLoading;
  }

  awaitTopics(topicsKeys?: string[]): Observable<Topics> {
    if (topicsKeys !== undefined && !this.loaded && !this.loading) {
      this.loadTopics(topicsKeys);
      this.loadOwnTopics(topicsKeys);
    }
    return this._topics.asObservable();
  }

  awaitRecommendedTopics(): Observable<Topics> {
    if (!this.loaded && !this.loading) {
      this.loadRecommendedTopics();
    }
    return this._topics.asObservable();
  }

  loadTopics(topicsKeys: string[]) {
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

    // Можно бы ввести Mutex но NodeJS однопоточный
    const _topics = this.topics;
    _topics.topics = topics.topics;
    this._topics.next(_topics);
    this.topicsLoaded = true;
    this.topicsLoading = false;
  }

  private onLoadTopicsError(error: any): void {
    console.log('TopicsStore:onLoadTopicsError', error);

    this._topics.error(error);
    this.topicsLoaded = false;
    this.topicsLoading = false;
  }

  loadOwnTopics(topicsKeys: string[]) {
    console.log('TopicsStore:loadOwnTopics', topicsKeys);

    this.ownTopicsLoaded = false;
    this.ownTopicsLoading = true;
    this.questionnaire.ownTopics(topicsKeys)
      .subscribe(
        this.onLoadOwnTopicsSuccess.bind(this),
        this.onLoadOwnTopicsError.bind(this)
      );
  }

  private onLoadOwnTopicsSuccess(topics: Topics): void {
    console.log('TopicsStore:onLoadOwnTopicsSuccess');

    // Можно бы ввести Mutex но NodeJS однопоточный
    const _topics = this.topics;
    _topics.ownTopics = topics.topics;
    this._topics.next(_topics);
    this.ownTopicsLoaded = true;
    this.ownTopicsLoading = false;
  }

  private onLoadOwnTopicsError(error: any): void {
    console.log('TopicsStore:onLoadTopicsError', error);

    this._topics.error(error);
    this.ownTopicsLoaded = false;
    this.ownTopicsLoading = false;
  }

  loadRecommendedTopics() {
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

    // Можно бы ввести Mutex но NodeJS однопоточный
    const _topics = this.topics;
    _topics.recommendedTopics = topics.topics;
    this._topics.next(_topics);
    this.recommendedTopicsLoaded = true;
    this.recommendedTopicsLoading = false;
  }

  private onLoadRecommendedTopicsError(error: any): void {
    console.log('TopicsStore:onLoadRecommendedTopicsError', error);

    this._topics.error(error);
    this.recommendedTopicsLoaded = false;
    this.recommendedTopicsLoading = false;
  }

  createTopic(owner: User): Topic {
    const topic = Topic.fromObject({
      key: pseudoRandom(8),
      owner,
      choices: defaultChoices,
    });

    // TODO HTTP
    this.localStorage.saveOwnTopic(topic);

    const _topics = this.topics;
    _topics.ownTopics.push(topic);
    this._topics.next(_topics);

    return topic;
  }
}
