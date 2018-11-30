import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Topics } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class QuestionnaireService {

  constructor(private http: HttpClient) {}

  private static decodeTopics(obj: any): Topics {
    return Topics.fromObject(obj);
  }

  private get api_url(): string {
    return environment.app_host + '/assets';
  }

  topics(topicsKeys?: string[]): Observable<Topics> {
    const options = {
      keys: (topicsKeys || []).join(','),
    };
    let params = new HttpParams();
    Object.keys(options).forEach((p, i) => {
      params = params.set(p, options[p]);
    });
    return this.http.get<Topics>(`${this.api_url}/questionnaire/topics.json`, {params})
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
    return this.http.get<Topics>(`${this.api_url}/questionnaire/own-topics.json`, {params})
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
    return this.http.get<Topics>(`${this.api_url}/questionnaire/recommended-topics.json`, {params})
      .pipe(
        map(QuestionnaireService.decodeTopics)
      );
  }

  answers(): Observable<Topics> {
    return this.http.get<Topics>(`${this.api_url}/questionnaire/answers.json`);
  }

  saveOwnTopic(/*topic: Topic*/): void {
  }

  saveAnswers(/*answers: Answers*/): void {
  }
}
