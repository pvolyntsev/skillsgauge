import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Topic } from '../../models/topic.model';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { TopicsSearch } from '../../models/topics-search.model';

@Component({
  selector: '[appTopicsListItem]', // tslint:disable-line
  templateUrl: './topics-list-item.component.html',
  styleUrls: ['./topics-list-item.component.scss']
})
export class TopicsListItemComponent implements OnInit {
  @Input()
  topic: Topic;

  constructor() { }

  ngOnInit() {
  }

  //
  // get score(): number {
  //   return 0;
  // }
  //
  // get maxScore(): number {
  //   return 0;
  // }
}


@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss']
})
export class TopicsListComponent implements OnInit {
  topics: Topic[] = [];
  loaded: Boolean = false;
  loading: Boolean = false;

  constructor(private questionnaire: QuestionnaireService,
              private router: Router) { }

  ngOnInit() {
    this.loadTopics();
  }

  // выбранные топики
  get selectedTopics(): Topic[] {
    return this.topics.filter(t => t.selected === true);
  }

  // есть ли выбранные топики
  get hasSelectedTopic(): Boolean {
    return this.selectedTopics.length > 0;
  }

  gotoFirstIncomplete(): void {
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

  onLoadTopicsSuccess(topics: TopicsSearch): void {
    this.topics = topics.topics;
    this.loaded = this.topics.length > 0;
    this.loading = false;
  }

  onLoadTopicsError(error: any): void {
  }
}
