export class URLResource {
  url: URL;
  title: string;

  public static fromObject(obj: any): URLResource {
    const { url, title } = obj;
    return Object.assign(new URLResource(), { url, title });
  }
}
