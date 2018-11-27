import { Component, Input } from '@angular/core';
import { QuestionnaireLocalStorageService } from '../../services';
import { TopicTerm, Answer } from '../../models';

@Component({
  selector: '[appTopicTestTerm]', // tslint:disable-line
  templateUrl: './topic-test-term.component.html',
  styleUrls: ['./topic-test-term.component.scss']
})
export class TopicTestTermComponent {
  @Input()
  term: TopicTerm;

  constructor(private localStorage: QuestionnaireLocalStorageService) { }

  get answers(): Answer[] {
    return this.term.topic.answers;
  }

  setAnswer(answer: Answer): void {
    if (this.term.answer !== answer) {
      this.term.answer = answer;
      this.saveTopic();
    }
  }

  saveTopic(): void {
    this.localStorage.saveTopic(this.term.topic);
  }
}
