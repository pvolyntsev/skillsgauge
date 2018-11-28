import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopicsStore, UserStore, AnswersStore } from '../../stores';
import {Topic, TopicAnswers, Topics, TopicsAnswers, User} from '../../models';

@Component({
  selector: 'app-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss']
})
export class TopicsListComponent implements OnDestroy {
  private readonly _topicsSubscription: Subscription;
  private _topics: Topics;

  private readonly _userSubscription: Subscription;
  user: User;

  private readonly _answersSubscription: Subscription;
  private _answers: TopicsAnswers;

  constructor(private topicsStore: TopicsStore,
              private router: Router,
              private userStore: UserStore,
              private answersStore: AnswersStore) {

    // обработчик на загрузку топиков
    this._topicsSubscription = topicsStore.awaitRecommendedTopics()
      .subscribe(
        (topics) => { this._topics = topics; },
        (error) => { /* console.log(error); */ }
      );

    // обработчик на загрузку пользователя
    this._userSubscription = userStore.awaitUser()
      .subscribe(
        user => this.user = user,
        (error) => { /* console.log(error); */ }
      );

    // обработчик на загрузку ответов
    this._answersSubscription = answersStore.awaitAnswers()
      .subscribe(
        answers => this._answers = answers,
        (error) => { /* console.log(error); */ }
      );
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._topicsSubscription.unsubscribe();
    this._userSubscription.unsubscribe();
    this._answersSubscription.unsubscribe();
  }

  // @example this.loaded
  get loaded(): boolean {
    return (this.user !== undefined)
      && (this._topics !== undefined)
      && (this._answers !== undefined);
  }

  // @example this.topics
  get topics(): Topic[] {
    return this._topics !== undefined ? this._topics.topics : [];
  }

  // @example: this.ownTopics
  get ownTopics(): Topic[] {
    return this._topics !== undefined ? this._topics.ownTopics : [];
  }

  // @example: this.recommendedTopics
  get recommendedTopics(): Topic[] {
    return this._topics !== undefined
      ? this._topics.recommendedTopics
        .filter(topic => {
          const sameTopic = this.topics.find(t => t.key === topic.key);
          const sameOwnTopic = this.ownTopics.find(t => t.key === topic.key);
          return !sameTopic && !sameOwnTopic;
        })
      : [];
  }

  topicAnswers(topic: Topic): TopicAnswers {
    return this._answers.getTopicAnswers(topic);
  }

  // есть ли выбранные топики
  // @example: this.hasSelectedTopic
  get hasSelectedTopic(): Boolean {
    return this.answersStore.selectedTopics.length > 0;
  }

  // выполняет переход на первый топик, который надо заполнить
  gotoFirstIncomplete(): void {
    const topic = this.answersStore.firstIncomplete;
    if (topic) {
      this.router.navigateByUrl('/topic/' + topic.key);
    }
  }

  // создаёт новый топик и переходит на страницу редактирования
  createOwnTopic(): void {
    const topic = this.topicsStore.createTopic(this.user);
    this.router.navigateByUrl('/topic/' + this.user.login + '/' + topic.key + '/edit');
  }
}
