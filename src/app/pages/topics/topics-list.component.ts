import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopicsStore } from '../../stores';
import { Topic, Topics } from '../../models';

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss']
})
export class TopicsListComponent implements OnInit, OnDestroy {
  private readonly _topicsSubscription: Subscription;
  private _topics: Topics = new Topics();
  loaded: Boolean = false;
  loading: Boolean = true;

  constructor(private topicsStore: TopicsStore,
              private router: Router) {

    // обработчик на загрузку топиков
    this._topicsSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { this.onLoadTopicsError(error); }
      );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._topicsSubscription.unsubscribe();
  }

  // @example this.topics
  get topics(): Topic[] {
    return this._topics.topics;
  }

  // @examle: this.myTopics
  get ownTopics(): Topic[] {
    return this._topics.ownTopics;
  }

  // есть ли выбранные топики
  // @examle: this.hasSelectedTopic
  get hasSelectedTopic(): Boolean {
    return this._topics.selectedTopics.length > 0;
  }

  // выполняет переход на первый топик, который надо заполнить
  gotoFirstIncomplete(): void {
    const topic = this._topics.firstIncomplete;
    if (topic) {
      this.router.navigateByUrl('/topic/' + topic.key);
    }
  }

  // выполняет переход на страницу создания нового топика
  createMyTopic(): void {
    // const topic = this.topicsStore.createTopic();
    // this.router.navigateByUrl('/edit/' + topic.key);
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicsListComponent:onLoadTopicsSuccess');
    this._topics = topics;
    this.loaded = this.topics.length > 0;
    this.loading = false;
  }

  onLoadTopicsError(error: any): void {
    console.log('TopicsListComponent:onLoadTopicsError');
    console.log(error);
  }
}
