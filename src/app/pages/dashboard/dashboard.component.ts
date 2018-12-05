import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnswersStore, TopicsStore, UserStore } from '../../stores';
import { Topics, Topic, TopicsAnswers, User } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly _answersSubscription: Subscription;
  private _answers: TopicsAnswers;

  private readonly _topicsSubscription: Subscription;
  private _topics: Topics;

  private readonly _userSubscription: Subscription;
  user: User;

  loaded: Boolean = false;
  loading: Boolean = true;
  percentageAnim = {};

  constructor(private topicsStore: TopicsStore,
              private router: Router,
              private userStore: UserStore,
              private answersStore: AnswersStore) {
    // обработчик на загрузку ответов
    this._answersSubscription = answersStore.awaitAnswers()
      .subscribe(
        answers => {
            this._answers = answers;
            this.setupPercentageAnim();
          },
      );

    // обработчик на загрузку топиков
    this._topicsSubscription = topicsStore.awaitRecommendedTopics()
      .subscribe(
        (topics) => { this._topics = topics; }
      );

    // обработчик на загрузку пользователя
    this._userSubscription = userStore.awaitUser()
      .subscribe(
        user => this.user = user
      );
  }

  ngOnInit() {
    this.setupPercentageAnim();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._answersSubscription.unsubscribe();
    this._topicsSubscription.unsubscribe();
    this._userSubscription.unsubscribe();
  }

  get selectedTopics(): Topic[] {
    return this.answersStore.selectedTopics;
  }

  // @example: this.ownTopics
  get ownTopics(): Topic[] {
    return this._topics !== undefined ? this._topics.ownTopics : [];
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

  topicPercentage(topic: Topic): number {
    const answers = this._answers.getTopicAnswers(topic);
    return answers ? answers.percentage : 0;
  }

  setupPercentageAnim(): void {
    this.setupPercentageAnim['TOTAL'] = 0;

    this.selectedTopics.forEach((topic, index) => {
      this.percentageAnim[topic.key] = 0;
      setTimeout(() => {
        const answers = this._answers.getTopicAnswers(topic);
        this.percentageAnim[topic.key] = answers ? answers.percentage : 0;
      }, (index + 1) * 200);
    });

    setTimeout(() => { this.percentageAnim['TOTAL'] = this.percentage; }, (this.selectedTopics.length + 3) * 200);
  }

  // создаёт новый топик и переходит на страницу редактирования
  createOwnTopic(): void {
    const topic = this.topicsStore.createTopic(this.user);
    this.router.navigateByUrl('/topic/' + topic.key + '/edit');
  }
}
