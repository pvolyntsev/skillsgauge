import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Topics } from '../models';

@Injectable()
export class QuestionnaireService {

  private endpoint = '/assets';

  constructor(private http: HttpClient) {}

  private static decodeTopics(obj: any): Topics {
    return Topics.fromObject(obj);
  }

  topics(topicsKeys?: string[]): Observable<Topics> {
    const options = {
      keys: (topicsKeys || []).join(','),
    };
    let params = new HttpParams();
    Object.keys(options).forEach((p, i) => {
      params = params.set(p, options[p]);
    });
    return this.http.get<Topics>(`${this.endpoint}/questionnaire/topics.json`, {params})
      .pipe(
        map(QuestionnaireService.decodeTopics)
      );
  }

  ownTopics(topicsKeys?: string[]): Observable<Topics> {
    const options = {
      keys: (topicsKeys || []).join(','),
    };
    let params = new HttpParams();
    Object.keys(options).forEach((p, i) => {
      params = params.set(p, options[p]);
    });
    return this.http.get<Topics>(`${this.endpoint}/questionnaire/own-topics.json`, {params})
      .pipe(
        map(QuestionnaireService.decodeTopics)
      );
  }

  recommendedTopics(topicsKeys?: string[]): Observable<Topics> {
    const options = {
      keys: (topicsKeys || []).join(','),
    };
    let params = new HttpParams();
    Object.keys(options).forEach((p, i) => {
      params = params.set(p, options[p]);
    });
    return this.http.get<Topics>(`${this.endpoint}/questionnaire/recommended-topics.json`, {params})
      .pipe(
        map(QuestionnaireService.decodeTopics)
      );
  }

  answers(): Observable<Topics> {
    return this.http.get<Topics>(`${this.endpoint}/questionnaire/answers.json`);
  }

  saveOwnTopic(/*topic: Topic*/): void {
  }

  saveAnswers(/*answers: Answers*/): void {
  }
}
