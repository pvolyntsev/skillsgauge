import { Component, OnDestroy, OnInit } from '@angular/core';
import { TopicsStore } from '../../store/topics.store';
import { Topic } from '../../models/topic.model';
import { Subscription } from 'rxjs';
import { Topics } from '../../models/topics.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private topicSearchSubscription: Subscription;
  topicSearch: Topics = new Topics();
  loaded: Boolean = false;
  loading: Boolean = true;
  percentageAnim = {};

  constructor(private topicsStore: TopicsStore) {
    // обработчик на загрузку топиков
    this.topicSearchSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { this.onLoadTopicsError(error); }
      );
  }

  ngOnInit() {
    this.setupPercentageAnim();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.topicSearchSubscription.unsubscribe();
  }

  // @example this.topics
  get topics(): Topic[] {
    return this.topicSearch.topics;
  }

  get selectedTopics(): Topic[] {
    return this.topicSearch.selectedTopics;
  }

  get score(): number {
    return this.topicSearch.score;
  }

  get maximumScore(): number {
    return this.topicSearch.maximumScore;
  }

  get percentage(): number {
    return this.topicSearch.percentage;
  }

  setupPercentageAnim(): void {
    this.setupPercentageAnim['TOTAL'] = 0;

    this.selectedTopics.forEach((topic, index) => {
      this.percentageAnim[topic.key] = 0;
      setTimeout(() => {
        this.percentageAnim[topic.key] = topic.percentage;
      }, (index + 1) * 200);
    });

    setTimeout(() => { this.percentageAnim['TOTAL'] = this.percentage; }, (this.selectedTopics.length + 3) * 200);
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicsListComponent:onLoadTopicsSuccess');
    this.topicSearch = topics;
    this.loaded = this.topics.length > 0;
    this.loading = false;
    this.setupPercentageAnim();
  }

  onLoadTopicsError(error: any): void {
    console.log('TopicsListComponent:onLoadTopicsError');
    console.log(error);
  }
}
