import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Topics } from '../models';
import { QuestionnaireLocalStorageService, QuestionnaireService } from '../services';

// https://www.lucidchart.com/techblog/2016/11/08/angular-2-and-observables-data-sharing-in-a-multi-view-application/

@Injectable()
export class TopicsStore {
  private _topics = new BehaviorSubject(new Topics());
  private topicsLoaded = false;
  private topicsLoading = false;
  private ownTopicsLoaded = false;
  private ownTopicsLoading = false;

  constructor(private questionnaire: QuestionnaireService) { }

  // current value
  get topics(): Topics {
    return this._topics.getValue();
  }

  get loaded(): Boolean {
    return this.topicsLoaded && this.ownTopicsLoaded;
  }

  get loading(): Boolean {
    return this.topicsLoading || this.ownTopicsLoading;
  }

  awaitTopics(topicsKeys?: string[]): Observable<Topics> {
    if (!this.loaded && !this.loading) {
      this.loadTopics(topicsKeys);
    }
    return this._topics.asObservable();
  }

  loadTopics(topicsKeys?: string[]) {
    console.log('TopicsStore:loadTopics', topicsKeys);

    this.topicsLoaded = false;
    this.topicsLoading = true;
    this.ownTopicsLoaded = false;
    this.ownTopicsLoading = true;

    this.questionnaire.topics(topicsKeys)
      .subscribe(
        this.onLoadTopicsSuccess.bind(this),
        this.onLoadTopicsError.bind(this)
      );

    this.questionnaire.ownTopics(topicsKeys)
      .subscribe(
        this.onLoadOwnTopicsSuccess.bind(this),
        this.onLoadOwnTopicsError.bind(this)
      );
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicsStore:onLoadTopicsSuccess');

    // Можно бы ввести Mutex но NodeJS однопоточный
    const _topics = this.topics;
    _topics.topics = topics.topics;
    this._topics.next(_topics);
    this.topicsLoaded = true;
    this.topicsLoading = false;
  }

  onLoadTopicsError(error: any): void {
    console.log('TopicsStore:onLoadTopicsError');
    console.log(error);

    this._topics.error(error);
    this.topicsLoaded = false;
    this.topicsLoading = false;
  }

  onLoadOwnTopicsSuccess(topics: Topics): void {
    console.log('TopicsStore:onLoadOwnTopicsSuccess');

    // Можно бы ввести Mutex но NodeJS однопоточный
    const _topics = this.topics;
    _topics.ownTopics = topics.ownTopics;
    this._topics.next(_topics);
    this.ownTopicsLoaded = true;
    this.ownTopicsLoading = false;
  }

  onLoadOwnTopicsError(error: any): void {
    console.log('TopicsStore:onLoadTopicsError');
    console.log(error);

    this._topics.error(error);
    this.ownTopicsLoaded = false;
    this.ownTopicsLoading = false;
  }
}
