import { URLResource } from './url-resource.model';

export class Term {
  key = '';
  title = '';
  description: string;
  hint: string;
  links: URLResource[];
  selected: Boolean = false;
}
