import { Component, Input } from '@angular/core';
import { Topic, TopicAnswers } from '../../models';
import { QuestionnaireLocalStorageService } from '../../services';
import { TopicsStore } from '../../stores';

@Component({
  selector: '[appTopicsListItem]', // tslint:disable-line
  templateUrl: './topics-list-item.component.html',
  styleUrls: ['./topics-list-item.component.scss']
})
export class TopicsListItemComponent {
  @Input()
  topic: Topic;

  @Input()
  answers: TopicAnswers;

  @Input()
  editable: Boolean;

  constructor(private localStorage: QuestionnaireLocalStorageService,
              private topicsStore: TopicsStore) {
  }

  get selected(): boolean {
    return this.answers ? this.answers.selected : false;
  }

  get source(): Topic {
    if (this.topic.sourceKey) {
      return this.topicsStore.allTopics.find(t => t.key === this.topic.sourceKey);
    }
  }

  set selected(selected: boolean) {
    if (this.answers && this.answers.selected !== selected) {
      this.answers.selected = selected;
      this.saveAnswers(this.answers);
    }
  }

  saveAnswers(answers: TopicAnswers): void {
    // TODO HTTP
    this.localStorage.saveTopicAnswers(answers);
  }
}
