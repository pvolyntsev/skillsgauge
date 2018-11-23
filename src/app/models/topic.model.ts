import { Term } from './term.model';
import { AnswerVariant } from './answer-variant.model';

const topicKeyClearer = new RegExp('[^a-zA-Z0-9]', 'g');

export class Topic {
  key = ''; // "oop_common",
  type = ''; // "common_knowledge",
  title = ''; // Объектно-ориентированное программирование",
  titleShort = ''; // "ООП",
  version: string;
  terms: Term[] = [];
  answers: AnswerVariant[] = [];
  selected: Boolean = false;

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
}
