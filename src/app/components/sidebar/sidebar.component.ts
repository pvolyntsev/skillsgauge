import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnswersStore, TopicsStore, UserStore } from '../../stores';
import { Topics, Topic, User, TopicsAnswers } from '../../models';

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

  private readonly _userSubscription: Subscription;
  user: User;

  private readonly _answersSubscription: Subscription;
  private _answers: TopicsAnswers;

  visible: Boolean = true;
  share_url: string;

  constructor(@Inject(DOCUMENT) private document: Document,
              private router: Router,
              private renderer: Renderer2,
              private topicsStore: TopicsStore,
              private answersStore: AnswersStore,
              private userStore: UserStore) {
    // обработчик на загрузку ответов
    this._answersSubscription = answersStore.awaitAnswers()
      .subscribe(
        answers => { this._answers = answers; },
        (error) => { /* console.log(error); */ }
      );

    // обработчик на загрузку пользователя
    this._userSubscription = userStore.awaitUser()
      .subscribe(
        user => this.user = user,
      (error) => { /* console.log(error); */ }
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
    this._answersSubscription.unsubscribe();
    this._userSubscription.unsubscribe();
  }

  get selectedTopics(): Topic[] {
    return this.answersStore.selectedTopics;
  }

  get score(): number {
    return this.answersStore.score;
  }

  get maximumScore(): number {
    return this.answersStore.maximumScore;
  }

  get percentage(): number {
    return this.answersStore.percentage;
  }

  // выполняет переход на первый топик, который надо заполнить
  gotoFirstIncomplete(): void {
    const topic = this.answersStore.firstIncomplete;
    if (topic) {
      this.router.navigateByUrl('/topic/' + topic.key);
    }
  }
}
