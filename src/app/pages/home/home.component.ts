import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnswersStore } from '../../stores';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  private readonly _answersSubscription: Subscription;

  loader_bar1_width = 0;
  loader_bar2_width = 0;
  loader_bar3_width = 0;
  loader_bar1_fill = 'rgb(0,0,0,0)'; // -> #e39836
  loader_bar2_fill = 'rgb(0,0,0,0)'; // -> #aa3853
  loader_bar3_fill = 'rgb(0,0,0,0)'; // -> #488456

  constructor(private answersStore: AnswersStore,
              private router: Router) {
    // обработчик на загрузку топиков
    this._answersSubscription = answersStore.awaitAnswers()
      .subscribe(
        (answers) => { this.onLoadSuccess(); },
        (error) => { /* console.log(error); */ }
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
    this._answersSubscription.unsubscribe();
  }

  onLoadSuccess(): void {
    console.log('HomeComponent:onLoadTopicsSuccess');

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
        if (this.answersStore.selectedTopics.length === 0) {
          this.router.navigateByUrl('/intro');
        } else if (this.answersStore.score === 0) {
          this.router.navigateByUrl('/topics');
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      }, 2000);

    }, 900);
  }
}
