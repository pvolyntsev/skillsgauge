import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User} from '../models';
import { UUID } from '../uuid';

@Injectable()
export class UserStore {
  private _user = new BehaviorSubject(new User());
  private loaded = false;
  private loading = false;

  constructor() { }

  static createTempUser(): User {
    const guid = UUID.v4();
    return User.fromObject({
      id: guid,
      login: guid,
    });
  }

  // current value
  get user(): User {
    return this._user.getValue();
  }

  awaitUser(): Observable<User> {
    if (!this.loaded && !this.loading) {
      this.loadUser();
    }
    return this._user.asObservable();
  }

  loadUser(): void {
    const value = localStorage.getItem('usr');
    if (value) {
      const obj = JSON.parse(value);
      const user = User.fromObject(obj);
      this._user.next(user);
    } else {
      const user = UserStore.createTempUser();
      this.saveUser(user);
    }
  }

  public saveUser(user): void {
    localStorage.setItem('usr', JSON.stringify(user));
    this._user.next(user);
  }
}
