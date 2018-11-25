import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Topics } from '../models/topics.model';
import { QuestionnaireLocalStorageService, QuestionnaireService } from '../services';

// https://www.lucidchart.com/techblog/2016/11/08/angular-2-and-observables-data-sharing-in-a-multi-view-application/

@Injectable()
export class TopicsStore {
  private _topics = new BehaviorSubject(new Topics());
  private loaded = false;
  private loading = false;

  constructor(private questionnaire: QuestionnaireService,
              private localStorage: QuestionnaireLocalStorageService) { }

  // current value
  get topics(): Topics {
    return this._topics.getValue();
  }

  awaitTopics(): Observable<Topics> {
    if (!this.loaded && !this.loading) {
      this.loadTopics();
    }
    return this._topics.asObservable();
  }

  loadTopics() {
    console.log('TopicsStore:loadTopics');
    this.loaded = true;
    this.loading = true;
    this.questionnaire.topics()
      .subscribe(
        this.onLoadTopicsSuccess.bind(this),
        this.onLoadTopicsError.bind(this)
      );
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicsStore:onLoadTopicsSuccess');

    topics.topics = topics.topics.map(t => this.localStorage.loadTopic(t));
    this._topics.next(topics);
    this.loaded = true;
    this.loading = false;
  }

  onLoadTopicsError(error: any): void {
    console.log('TopicsStore:onLoadTopicsError');
    console.log(error);

    this._topics.error(error);
    this.loaded = false;
    this.loading = false;
  }
}
