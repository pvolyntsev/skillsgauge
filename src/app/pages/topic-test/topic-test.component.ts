import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopicsStore } from '../../stores';
import { QuestionnaireLocalStorageService } from '../../services';
import { Topics, Topic } from '../../models';

@Component({
  selector: 'app-topic-test',
  templateUrl: './topic-test.component.html',
  styleUrls: ['./topic-test.component.scss']
})
export class TopicTestComponent implements OnInit, OnDestroy {
  private topicSearchSubscription: Subscription;
  topicSearch: Topics = new Topics();
  topic: Topic;
  nextTopic: Topic; // следующий выбранный топик
  prevTopic: Topic; // предыдущий выбранный топик
  loaded: Boolean = false;
  loading: Boolean = false;

  constructor(private topicsStore: TopicsStore,
              private localStorage: QuestionnaireLocalStorageService,
              private router: Router,
              private route: ActivatedRoute) {

    // обработчик на загрузку топиков
    this.topicSearchSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { this.onLoadTopicsError(error); }
      );

    // обработчик на смену URL - показать другой топик
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log(event.url);
      this.selectTopic();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.topicSearchSubscription.unsubscribe();
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicTestComponent:onLoadTopicsSuccess');
    this.topicSearch = topics;
    this.loading = false;
    this.selectTopic();
  }

  selectTopic(): void {
    const key = this.route.snapshot.paramMap.get('key');
    console.log('TopicTestComponent:selectTopic', key);
    const topic = this.topicSearch.topics.find(t => t.key === key);
    if (topic) {
      this.loaded = true;
      this.topic = topic;
      this.prevTopic = this.topicSearch.prevTopic(key);
      this.nextTopic = this.topicSearch.nextTopic(key);
      this.setSelected(true);
    } else {
      this.loaded = false;
      this.topic = null;
      this.prevTopic = null;
      this.nextTopic = null;
    }
  }

  get share_url(): string {
    return 'http://skillsgauge.uptlo.com/topic/' + this.topic.key;
  }

  onLoadTopicsError(error: any): void {
    console.log('TopicTestComponent:onLoadTopicsError');
    console.log(error);
  }

  setSelected(value): void {
    if (this.topic && this.topic.selected !== value) {
      this.topic.selected = value;
      this.saveTopic();
    }
  }

  saveTopic(): void {
    if (this.topic) {
      this.localStorage.saveTopic(this.topic);
    }
  }
}
