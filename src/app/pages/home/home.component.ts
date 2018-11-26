import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopicsStore } from '../../store/topics.store';
import { Topics } from '../../models/topics.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  private topicSearchSubscription: Subscription;
  topicSearch: Topics = new Topics();

  loader_bar1_width = 0;
  loader_bar2_width = 0;
  loader_bar3_width = 0;
  loader_bar1_fill = 'rgb(0,0,0,0)'; // -> #e39836
  loader_bar2_fill = 'rgb(0,0,0,0)'; // -> #aa3853
  loader_bar3_fill = 'rgb(0,0,0,0)'; // -> #488456

  constructor(private topicsStore: TopicsStore,
              private router: Router) {
    // обработчик на загрузку топиков
    this.topicSearchSubscription = topicsStore.awaitTopics()
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { this.onLoadTopicsError(error); }
      );

    setTimeout(() => {
      this.loader_bar1_width = 25;
      this.loader_bar1_fill = 'rgba(127,127,127,0.4)';
    }, 350);

    setTimeout(() => {
      this.loader_bar2_width = 60;
      this.loader_bar2_fill = 'rgba(127,127,127,0.4)';
    }, 600);

    setTimeout(() => {
      this.loader_bar3_width = 45;
      this.loader_bar3_fill = 'rgba(127,127,127,0.4)';
    }, 850);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.topicSearchSubscription.unsubscribe();
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('HomeComponent:onLoadTopicsSuccess');
    this.topicSearch = topics;

    setTimeout(() => {
      setTimeout(() => {
        this.loader_bar1_width = 100;
        this.loader_bar1_fill = '#e39836';
      }, 450);

      setTimeout(() => {
        this.loader_bar2_width = 100;
        this.loader_bar2_fill = '#aa3853';
      }, 800);

      setTimeout(() => {
        this.loader_bar3_width = 100;
        this.loader_bar3_fill = '#488456';
      }, 1250);

      setTimeout(() => {
        if (this.topicSearch.selectedTopics.length === 0) {
          this.router.navigateByUrl('/intro');
        } else if (this.topicSearch.score === 0) {
          this.router.navigateByUrl('/topics');
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      }, 2000);

    }, 900);
  }

  onLoadTopicsError(error: any): void {
    console.log('HomeComponent:onLoadTopicsError');
    console.log(error);
  }
}
