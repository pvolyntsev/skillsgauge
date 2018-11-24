import { Component, Input } from '@angular/core';
import { Topic } from '../../models/topic.model';

@Component({
  selector: '[appTopicTestNavigation]', // tslint:disable-line
  templateUrl: './topic-test-navigation.component.html',
  styleUrls: ['./topic-test-navigation.component.scss']
})
export class TopicTestNavigationComponent {
  @Input()
  topic: Topic;
}
