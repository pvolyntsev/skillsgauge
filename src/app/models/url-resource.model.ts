export class URLResource {
  url: URL;
  title: string;

  public static fromObject(obj: any): URLResource {
    return Object.assign(new URLResource(), obj);
  }
}
