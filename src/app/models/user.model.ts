export class User {
  id: string;
  login: string;
  name: string;
  roles: string[] = [];

  public static fromObject(obj: any): User {
    return Object.assign(new User(), obj);
  }

  get isGuest(): Boolean {
    return this.roles.length === 0;
  }
}

