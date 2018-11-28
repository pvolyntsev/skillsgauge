export class Choice {
  key = '';
  title = '';
  score = 0;

  public static fromObject(obj: any): Choice {
    const { key, title, score } = obj;
    return Object.assign(new Choice(), { key, title, score });
  }
}

export const defaultChoices = [
  Choice.fromObject({
    key: 0,
    score: 0,
    title: 'Мимо',
  }),
  Choice.fromObject({
    key: 1,
    score: 1,
    title: 'Слышал',
  }),
  Choice.fromObject({
    key: 2,
    score: 2,
    title: 'Знаю',
  }),
  Choice.fromObject({
    key: 4,
    score: 4,
    title: 'Использовал',
  }),
];
