export class Answer {
  title = '';
  score = 0;

  public static fromObject(obj: any): Answer {
    return Object.assign(new Answer(), obj);
  }
}

export const defaultAnswers = [
  Answer.fromObject({
    score: 0,
    title: 'Мимо',
  }),
  Answer.fromObject({
    score: 1,
    title: 'Слышал',
  }),
  Answer.fromObject({
    score: 2,
    title: 'Знаю',
  }),
  Answer.fromObject({
    score: 4,
    title: 'Использовал',
  }),
];
