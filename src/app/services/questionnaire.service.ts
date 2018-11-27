import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Topics } from '../models';

@Injectable()
export class QuestionnaireService {

  private endpoint = '/assets';

  constructor(private http: HttpClient) {}

  topics(): Observable<Topics> {
    const options = {};
    let params = new HttpParams();
    Object.keys(options).forEach((p, i) => {
      params = params.set(p, options[p]);
    });
    return this.http.get<Topics>(`${this.endpoint}/questionnaire/questionnaire.json`, {params})
      .pipe(
        map(this.decodeAnswer)
      );
  }

  decodeAnswer(obj: any): Topics {
    return Topics.fromObject(obj);
  }
}
