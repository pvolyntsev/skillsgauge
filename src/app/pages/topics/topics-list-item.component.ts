import { Component, Input, OnInit } from '@angular/core';
import { Topic } from '../../models/topic.model';

@Component({
  selector: '[appTopicsListItem]', // tslint:disable-line
  templateUrl: './topics-list-item.component.html',
  styleUrls: ['./topics-list-item.component.scss']
})
export class TopicsListItemComponent {
  @Input()
  topic: Topic;
}
