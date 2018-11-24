import { Component, Input } from '@angular/core';
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

  get answers(): AnswerVariant[] {
    return this.term.topic.answers;
  }
}
