import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnswersStore, TopicsStore, UserStore } from '../../stores';
import { QuestionnaireLocalStorageService } from '../../services';
import { Topics, Topic, TopicAnswers, TopicsAnswers, User } from '../../models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-topic-test',
  templateUrl: './topic-test.component.html',
  styleUrls: ['./topic-test.component.scss']
})
export class TopicTestComponent implements OnInit, OnDestroy {
  private readonly _topicsSubscription: Subscription;
  private _topics: Topics = new Topics();

  private readonly _answersSubscription: Subscription;
  private _answers: TopicsAnswers;

  private readonly _userSubscription: Subscription;
  private _user: User;

  topic: Topic;
  nextTopic: Topic; // следующий выбранный топик
  prevTopic: Topic; // предыдущий выбранный топик
  loaded: Boolean = false;

  constructor(private userStore: UserStore,
              private topicsStore: TopicsStore,
              private answersStore: AnswersStore,
              private localStorage: QuestionnaireLocalStorageService,
              private router: Router,
              private route: ActivatedRoute) {

    // обработчик на загрузку ответов
    this._answersSubscription = answersStore.awaitAnswers()
      .subscribe(
        answers => { this.onLoadAnswersSuccess(answers); },
        (error) => { /* console.log(error); */ }
      );

    // обработчик на загрузку топиков
    this._topicsSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { /* error.log(error); */ }
      );

    // обработчик на смену URL - показать другой топик
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log(event.url);
      this.selectTopic();
    });

    // обработчик на загрузку пользователя
    this._userSubscription = userStore.awaitUser()
      .subscribe(
        user => this._user = user,
        (error) => { console.log(error); }
      );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._topicsSubscription.unsubscribe();
    this._answersSubscription.unsubscribe();
    this._userSubscription.unsubscribe();
  }

  get topicAnswers(): TopicAnswers {
    if (this.topic) {
      return this._answers.getTopicAnswers(this.topic);
    }
    return null;
  }

  get isOwnTopic(): Boolean {
    if (this.topic && this._user) {
      return this.topic.owner && (this.topic.owner.id === this._user.id);
    }
    return false;
  }

  onLoadAnswersSuccess(answers: TopicsAnswers): void {
    console.log('TopicTestComponent:onLoadAnswersSuccess');
    this._answers = answers;
    this.selectTopic();
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicTestComponent:onLoadTopicsSuccess');
    this._topics = topics;
    this.selectTopic();
  }

  selectTopic(): void {
    const key = this.route.snapshot.paramMap.get('key');
    console.log('TopicTestComponent:selectTopic', key);
    const topic = this.answersStore.topics.find(t => t.key === key);
    if (topic) {
      this.loaded = true;
      this.topic = topic;
      this.prevTopic = this.findPrevTopic(key);
      this.nextTopic = this.findNextTopic(key);
      this.setSelected();
    } else {
      this.loaded = false;
      this.topic = null;
      this.prevTopic = null;
      this.nextTopic = null;
    }
  }

  // предыдущий выбранный топик
  private findPrevTopic(key: string): Topic {
    let prev = null;
    let temp = null;
    this.answersStore.selectedTopics.forEach((topic) => {
      if (topic.key === key) {
        prev = temp;
      }
      temp = topic;
    });
    return prev;
  }

  // следующий выбранный топик
  private findNextTopic(key: string): Topic {
    let next = null;
    let temp = null;
    this.answersStore.selectedTopics.forEach((topic) => {
      if (temp && temp.key === key) {
        next = topic;
      }
      temp = topic;
    });
    return next;
  }

  get share_url(): string {
    return environment.app_host + '/topic/' + this.topic.key;
  }

  setSelected(): void {
    if (this.topic) {
      const anwsers = this._answers.getTopicAnswers(this.topic);
      if (!anwsers.selected) {
        anwsers.selected = true;
        this.saveAnswers(anwsers);
      }
    }
  }

  saveAnswers(answers: TopicAnswers): void {
    // TODO HTTP
    this.localStorage.saveTopicAnswers(answers);
  }
}
