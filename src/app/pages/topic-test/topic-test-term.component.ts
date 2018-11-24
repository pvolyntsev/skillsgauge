import { Component, Input } from '@angular/core';
import { QuestionnaireLocalStorageService } from '../../services/questionnaire-local-storage.service';
import { TopicTerm } from '../../models/topic-term.model';
import { AnswerVariant } from '../../models/answer-variant.model';

@Component({
  selector: '[appTopicTestTerm]', // tslint:disable-line
  templateUrl: './topic-test-term.component.html',
  styleUrls: ['./topic-test-term.component.scss']
})
export class TopicTestTermComponent {
  @Input()
  term: TopicTerm;

  constructor(private localStorage: QuestionnaireLocalStorageService) { }

  get answers(): AnswerVariant[] {
    return this.term.topic.answers;
  }

  setAnswer(answer: AnswerVariant): void {
    if (this.term.answer !== answer) {
      this.term.answer = answer;
      this.saveTopic();
    }
  }

  saveTopic(): void {
    this.localStorage.saveTopic(this.term.topic);
  }
}
