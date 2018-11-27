import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopicsStore } from '../../store/topics.store';
import { Topic, Topics } from '../../models';

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss']
})
export class TopicsListComponent implements OnInit, OnDestroy {
  private topicSearchSubscription: Subscription;
  topicSearch: Topics = new Topics();
  loaded: Boolean = false;
  loading: Boolean = true;

  constructor(private topicsStore: TopicsStore,
              private router: Router) {

    // обработчик на загрузку топиков
    this.topicSearchSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { this.onLoadTopicsError(error); }
      );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.topicSearchSubscription.unsubscribe();
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

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicsListComponent:onLoadTopicsSuccess');
    this.topicSearch = topics;
    this.loaded = this.topics.length > 0;
    this.loading = false;
  }

  onLoadTopicsError(error: any): void {
    console.log('TopicsListComponent:onLoadTopicsError');
    console.log(error);
  }
}
