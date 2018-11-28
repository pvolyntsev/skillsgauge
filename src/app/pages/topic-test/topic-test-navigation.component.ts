import { Component, Input } from '@angular/core';
import { Topic, TopicAnswers } from '../../models';

@Component({
  selector: '[appTopicTestNavigation]', // tslint:disable-line
  templateUrl: './topic-test-navigation.component.html',
  styleUrls: ['./topic-test-navigation.component.scss']
})
export class TopicTestNavigationComponent {
  @Input()
  topic: Topic;

  @Input()
  answers: TopicAnswers;
}
