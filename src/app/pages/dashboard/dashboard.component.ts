import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnswersStore } from '../../stores';
import { Topics, Topic, TopicsAnswers } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly _answersSubscription: Subscription;
  private _answers: TopicsAnswers;

  loaded: Boolean = false;
  loading: Boolean = true;
  percentageAnim = {};

  constructor(private answersStore: AnswersStore) {
    // обработчик на загрузку ответов
    this._answersSubscription = answersStore.awaitAnswers()
      .subscribe(
        answers => {
            this._answers = answers;
            this.setupPercentageAnim();
          },
        (error) => { /* console.log(error); */ }
      );
  }

  ngOnInit() {
    this.setupPercentageAnim();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._answersSubscription.unsubscribe();
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
}
