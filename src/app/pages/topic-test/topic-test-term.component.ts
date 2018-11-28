import { Component, Input } from '@angular/core';
import { QuestionnaireLocalStorageService } from '../../services';
import { TopicTerm, Choice, TopicAnswers } from '../../models';

@Component({
  selector: '[appTopicTestTerm]', // tslint:disable-line
  templateUrl: './topic-test-term.component.html',
  styleUrls: ['./topic-test-term.component.scss']
})
export class TopicTestTermComponent {
  @Input()
  term: TopicTerm;

  @Input()
  answers: TopicAnswers;

  constructor(private localStorage: QuestionnaireLocalStorageService) { }

  get choices(): Choice[] {
    return this.term.topic.choices;
  }

  get defaultChoice(): Choice {
    return this.term.topic.defaultChoice;
  }

  get answerKey(): string {
    return this.answers.getAnswerByTerm(this.term, this.defaultChoice).key;
  }

  setAnswer(answer: Choice): void {
    if (this.answerKey !== answer.key) {
      this.answers.setAnswerByTerm(answer, this.term);
      this.saveAnswers();
    }
  }

  saveAnswers(): void {
    // TODO HTTP ?
    this.localStorage.saveTopicAnswers(this.answers);
  }
}
