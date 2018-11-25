import { Component, Input } from '@angular/core';
import { QuestionnaireLocalStorageService } from '../../services';
import { Topic } from '../../models/topic.model';

@Component({
  selector: '[appTopicsListItem]', // tslint:disable-line
  templateUrl: './topics-list-item.component.html',
  styleUrls: ['./topics-list-item.component.scss']
})
export class TopicsListItemComponent {
  @Input()
  topic: Topic;

  constructor(private localStorage: QuestionnaireLocalStorageService) { }

  setSelected(topic, value): void {
    if (topic && topic.selected !== value) {
      topic.selected = value;
      this.saveTopic(topic);
    }
  }

  saveTopic(topic: Topic): void {
    this.localStorage.saveTopic(topic);
  }
}
