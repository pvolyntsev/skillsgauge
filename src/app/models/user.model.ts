export class User {
  id: string;
  login: string;
  name: string;
  roles: string[] = [];

  public static fromObject(obj: any): User {
    const { id, login, name, roles } = obj;
    return Object.assign(new User(), { id, login, name, roles });
  }

  get isGuest(): Boolean {
    return this.roles.length === 0;
  }
}

