export class User {
  id: string;
  login: string;
  name: string;
  about: string;
  home_url: string;
  avatar_url: string;
  roles: string[] = [];

  public static fromObject(obj: any): User {
    const { id, login, name, about, home_url, avatar_url, roles } = obj;
    return Object.assign(new User(), { id, login, name, about, home_url, avatar_url, roles });
  }

  get isGuest(): Boolean {
    return this.roles.length === 0;
  }
}

