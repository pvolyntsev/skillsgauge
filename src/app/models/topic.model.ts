import { TopicTerm } from './topic-term.model';
import { Answer } from './answer.model';
import { User } from './user.model';

const topicKeyClearer = new RegExp('[^a-zA-Z0-9]', 'g');

export class Topic {
  key = ''; // "oop_common",
  type = ''; // "common_knowledge",
  title = ''; // Объектно-ориентированное программирование",
  titleShort = ''; // "ООП",
  version: string;
  terms: TopicTerm[] = [];
  answers: Answer[] = [];
  selected: Boolean = false;
  owner: User;

  public static fromObject(obj: any): Topic {
    const instance = new Topic();
    const answers = obj.answers.map(answer => Answer.fromObject(answer));
    const terms = obj.terms.map(term => TopicTerm.fromObject(instance, term));
    const user = User.fromObject(obj.user);
    return Object.assign(instance, {
      ...obj,
      terms,
      answers,
    });
  }

  public get htmlId(): string {
    return [
      'topic',
      this.type.replace(topicKeyClearer, '_'),
      this.key.replace(topicKeyClearer, '_'),
    ].join('_');
  }

  // список первых N терминов через разделитель
  public termsFirstN(N: number, glue: string): string {
    const terms = this.terms.reduce((carry, term, i) => {
      if (i < N) {
        carry.push(term.title);
      }
      return carry;
    }, []);
    if (this.terms.length > N) {
      terms.push('');
    }
    return terms.join(glue);
  }

  // список N терминов через разделитель, следующих за self.termsFirstN(N)
  public termsAfterN(N: number, glue: string): string {
    const terms = this.terms.reduce((carry, term, i) => {
      if (i >= N) {
        carry.push(term.title);
      }
      return carry;
    }, []);
    return terms.join(glue);
  }

  // количество баллов по топику
  // @example: this.score
  public get score(): number {
    return this.terms.reduce((sum, term) => sum + term.score, 0);
  }

  // максимальное количество баллов по топику
  // @example: this.maximumScore
  public get maximumScore(): number {

    // варианты количества баллов за ответы
    const scores = this.answers.reduce((carry, answer) => { carry.push(answer.score); return carry; }, []);

    // максимальное количество баллов за ответ
    const maxScore = Math.max.apply(null, scores);

    return this.terms.length * maxScore;
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
