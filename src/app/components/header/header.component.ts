import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from '../../models';
import { UserStore } from '../../stores';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  user: User;

  public visible = false;

  constructor(private router: Router,
              private userStore: UserStore) {

    // обработчик на смену URL
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('HeaderComponent:constructor', event.url);
      this.visible = event.url === '/dashboard';
    });

    // обработчик на загрузку пользователя
    this.userSubscription = userStore.awaitUser()
      .subscribe(
        user => this.user = user,
        (error) => { console.log(error); }
      );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.userSubscription.unsubscribe();
  }
}
