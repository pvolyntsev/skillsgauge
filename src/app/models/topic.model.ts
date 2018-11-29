import { TopicTerm } from './topic-term.model';
import { Choice } from './choice.model';
import { User } from './user.model';

const topicKeyClearer = new RegExp('[^a-zA-Z0-9]', 'g');

export class Topic {
  key = ''; // "oop_common",
  type = ''; // "common_knowledge",
  title = ''; // Объектно-ориентированное программирование",
  titleShort = ''; // "ООП",
  version: string;
  terms: TopicTerm[] = [];
  choices: Choice[] = [];
  owner: User;

  public static fromObject(obj: any): Topic {
    const { key, type, title, titleShort, version } = obj;
    const instance = new Topic();
    const choices = (obj.choices || []).map(choice => Choice.fromObject(choice));
    const terms = (obj.terms || []).map(term => TopicTerm.fromObject(instance, term));
    const owner = User.fromObject(obj.owner || {});
    return Object.assign(instance, { key, type, title, titleShort, version, terms, choices, owner });
  }

  toObject(): object {
    const { key, type, title, titleShort, version, terms, choices  } = this;
    const owner = {
      id: this.owner ? this.owner.id : null,
    };
    return {
      key, type, title, titleShort, version, terms, choices, owner,
    };
  }

  public get htmlId(): string {
    return [
      'topic',
      (this.type || '').replace(topicKeyClearer, '_'),
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

  // значение по-умолчанию для терминов без голоса
  public get defaultChoice(): Choice {
    return this.choices[0];
  }
}
