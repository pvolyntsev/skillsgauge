import { Component, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import { User } from '../../../models';
import { UserStore } from '../../../stores';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  private readonly _userSubscription: Subscription;
  user: User;

  constructor(private userStore: UserStore) {
    // обработчик на загрузку пользователя
    this._userSubscription = userStore.awaitUser()
      .subscribe(
        user => this.user = user,
        (error) => { console.log(error); }
      );
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._userSubscription.unsubscribe();
  }
}
