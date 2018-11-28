import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AnswersStore, UserStore } from '../../../stores';
import { Topic, User, TopicsAnswers } from '../../../models';

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

  share_url: string;

  constructor(@Inject(DOCUMENT) private document: Document,
              private router: Router,
              private renderer: Renderer2,
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
