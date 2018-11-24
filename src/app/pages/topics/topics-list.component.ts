import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { Topic } from '../../models/topic.model';
import { Topics } from '../../models/topics.model';

@Component({
  selector: '[appTopicsListItem]', // tslint:disable-line
  templateUrl: './topics-list-item.component.html',
  styleUrls: ['./topics-list-item.component.scss']
})
export class TopicsListItemComponent {
  @Input()
  topic: Topic;
}


@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss']
})
export class TopicsListComponent implements OnInit {
  topicSearch: Topics = new Topics();
  loaded: Boolean = false;
  loading: Boolean = false;

  constructor(private questionnaire: QuestionnaireService,
              private router: Router) { }

  ngOnInit() {
    this.loadTopics();
  }

  // @example this.topics
  get topics(): Topic[] {
    return this.topicSearch.topics;
  }

  // есть ли выбранные топики
  // @examle: this.hasSelectedTopic
  get hasSelectedTopic(): Boolean {
    return this.topicSearch.selectedTopics.length > 0;
  }

  // выполняет переход на первый топик, который надо заполнить
  gotoFirstIncomplete(): void {
    const topic = this.topicSearch.firstIncomplete;
    if (topic) {
      this.router.navigateByUrl('/topic/' + topic.key);
    }
  }

  // загрузить топики
  loadTopics(): void {
    this.loaded = false;
    this.loading = true;

    this.questionnaire.topics()
      .subscribe(
        this.onLoadTopicsSuccess.bind(this),
        this.onLoadTopicsError.bind(this)
      );
  }

  onLoadTopicsSuccess(topics: Topics): void {
    this.topicSearch = topics;
    this.loaded = this.topics.length > 0;
    this.loading = false;
  }

  onLoadTopicsError(error: any): void {
  }
}
