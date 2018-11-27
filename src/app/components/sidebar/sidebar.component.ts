import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TopicsStore, UserStore } from '../../stores';
import { Topics, Topic, User } from '../../models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input()
  fixed: Boolean = true;

  @Input()
  opened: Boolean = false;

  private topicSearchSubscription: Subscription;
  topicSearch: Topics = new Topics();

  private userSubscription: Subscription;
  user: User;

  visible: Boolean = true;
  share_url: string;

  constructor(@Inject(DOCUMENT) private document: Document,
              private router: Router,
              private renderer: Renderer2,
              private topicsStore: TopicsStore,
              private userStore: UserStore) {
    // обработчик на загрузку топиков
    this.topicSearchSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { this.onLoadTopicsError(error); }
      );

    // обработчик на загрузку пользователя
    this.userSubscription = userStore.awaitUser()
      .subscribe(
        user => this.user = user,
      (error) => { console.log(error); }
    );

    // обработчик на смену URL
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log(event.url);
      this.visible = event.url === '/dashboard';
      this.share_url = 'http://skillsgauge.uptlo.com' + event.url;
    });
  }

  ngOnInit() {
    if (this.fixed) {
      this.renderer.addClass(this.document.body, 'sidebar-fixed');
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.topicSearchSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
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

  // выполняет переход на первый топик, который надо заполнить
  gotoFirstIncomplete(): void {
    const topic = this.topicSearch.firstIncomplete;
    if (topic) {
      this.router.navigateByUrl('/topic/' + topic.key);
    }
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('SidebarComponent:onLoadTopicsSuccess');
    this.topicSearch = topics;
  }

  onLoadTopicsError(error: any): void {
    console.log('SidebarComponent:onLoadTopicsError');
    console.log(error);
  }
}
