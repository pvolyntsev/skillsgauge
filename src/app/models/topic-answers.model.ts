import { Choice } from './choice.model';
import { TopicTerm } from './topic-term.model';
import { Topic } from './topic.model';
import * as moment from 'moment';
import deleteProperty = Reflect.deleteProperty;

export class TopicAnswers {
  private readonly _topic: Topic;
  private _score = 0;
  private _maximumScore = 0;
  private _selected = false;
  private _frozen = true;

  key: string;
  date: string;
  version: string;
  answers = {};

  constructor(topic: Topic) {
    this._topic = topic;
    this.date = moment().format('YYYYMMDD');
    this.key = this._topic.key;
  }

  public static fromObject(topic: Topic, obj: any): TopicAnswers {
    const today = moment().format('YYYYMMDD');
    const { key, date, version, selected, score, maximumScore } = obj;
    deleteProperty(obj, 'score');
    deleteProperty(obj, 'maximumScore');

    const answers = Object.keys((obj.answers || {}))
      .reduce((carry, termKey) => {
        carry[termKey] = topic.choices.find(c => c.key === obj.answers[termKey].key);
        return carry;
      }, {});

    const instance = Object.assign(new TopicAnswers(topic), { key, date, version, selected, answers });

    // зафиксировать исторические значения
    if (Number(instance.date) < Number(today)) {
      instance.freeze(score, maximumScore);
    }

    return instance;
  }

  public freeze(score, maximumScore): void {
    this._score = score;
    this._maximumScore = maximumScore;
    this._frozen = true;
  }

  private unfreeze(): void {
    this._frozen = false;
    this._score = null;
    this._maximumScore = null;
    this.date = moment().format('YYYYMMDD');
  }

  get selected(): boolean {
    return this._selected === true;
  }

  set selected(selected) {
    if (this._selected !== selected) {
      this._selected = selected;
      this.unfreeze();
    }
  }

  getAnswerByTerm(term: TopicTerm, defaultAnswer?: Choice): Choice {
    return this.answers.hasOwnProperty(term.key) ? this.answers[term.key] : defaultAnswer;
  }

  setAnswerByTerm(answer: Choice, term: TopicTerm): void {
    const _answer = this.answers.hasOwnProperty(term.key) ? this.answers[term.key] : null;
    if (_answer === null || _answer.key !== answer.key) {
      this.answers[term.key] = answer;
      this.unfreeze();
    }
  }

  toObject(): object {
    const { key, date, score, maximumScore, selected } = this;
    const answers = Object.keys(this.answers).reduce((carry, termKey) => {
      carry[termKey] = { score: this.answers[termKey].score, key: this.answers[termKey].key };
      return carry;
    }, {});
    return {
      key, date, maximumScore, score, selected, answers,
    };
  }

  // количество баллов по топику
  // @example: this.score
  public get score(): number {
    if (this._frozen) {
      return this._score;
    }
    return this._topic.terms.reduce((sum, term) => {
      const answer = this.getAnswerByTerm(term);
      return sum + (answer ? answer.score : 0);
    }, 0);
  }

  // максимальное количество баллов по топику
  // @example: this.maximumScore
  public get maximumScore(): number {
    if (this._frozen) {
      return this._maximumScore;
    }

    // варианты количества баллов за ответы
    const scores = this._topic.choices.reduce((carry, choice) => { carry.push(choice.score); return carry; }, []);

    // максимальное количество баллов за ответ
    const maxScore = Math.max.apply(null, scores);

    return this._topic.terms.length * maxScore;
  }

  // процент достижения по топику
  // @example: this.percentage
  public get percentage(): number {
    const { maximumScore, score } = this;
    if (maximumScore > 0) {
      return Math.round(score / maximumScore * 100);
    }
    return 0;
  }
}
