import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Topic, Topics, TopicTerm, User } from '../../models';
import { TopicsStore, UserStore} from '../../stores';
import { QuestionnaireLocalStorageService, QuestionnaireService } from '../../services';
import { pseudoRandom } from '../../pseudo-random';

// https://stackoverflow.com/questions/37168571/angular-2-multiple-validators
// https://www.concretepage.com/angular-2/angular-2-4-formbuilder-example#array

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.component.html',
  styleUrls: ['./topic-editor.component.scss']
})
export class TopicEditorComponent implements OnInit, OnDestroy {
  private _topicsSubscription: Subscription;
  private _topicsLoaded = false;
  private _topic: Topic;

  private readonly _userSubscription: Subscription;
  private _user: User;
  private _userLoaded = false;

  topicForm: FormGroup;

  constructor(private fb: FormBuilder,
              private questionnaire: QuestionnaireService,
              private localStorage: QuestionnaireLocalStorageService,
              private userStore: UserStore,
              private topicsStore: TopicsStore,
              private router: Router,
              private route: ActivatedRoute) {

    // обработчик на загрузку пользователя
    this._userSubscription = userStore.awaitUser()
      .subscribe(
        user => { this.onLoadUserSuccess(user); },
        (error) => { console.log(error); }
      );
  }

  ngOnInit() {
    this.createForm();

    const key = this.route.snapshot.paramMap.get('key');
    // обработчик на загрузку топиков
    this._topicsSubscription = this.topicsStore.awaitTopics([key])
      .subscribe(
        (topics) => { this.onLoadTopicsSuccess(topics); },
        (error) => { /* error.log(error); */ }
      );
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this._topicsSubscription.unsubscribe();
    this._userSubscription.unsubscribe();
  }

  get topic(): Topic {
    return this._topic;
  }

  get loaded(): boolean {
    return this._topicsLoaded && this._userLoaded;
  }

  get termsArray(): FormArray {
    return this.topicForm.get('terms') as FormArray;
  }

  get isOwnTopic(): Boolean {
    if (this._topic && this._user) {
      return this._topic.owner && (this._topic.owner.id === this._user.id);
    }
    return false;
  }

  private createForm(): void {
    this.topicForm = this.fb.group({
      // key: ['', Validators.required],
      // type: ['', Validators.required],
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ],
      ],
      titleShort: ['', Validators.maxLength(40)],
      description: ['', Validators.maxLength(500)],
      tags: ['', Validators.maxLength(100)],
      terms: this.fb.array([]),
    });
  }

  private createTerm(topicTerm?: TopicTerm): FormGroup {
    const key = topicTerm ? topicTerm.key : pseudoRandom(4);
    const title = topicTerm ? topicTerm.title : '';
    return this.fb.group({
      key: [key, Validators.required],
      title: [
        title,
        [
          Validators.required,
          Validators.maxLength(120),
        ]
      ],
    });
  }

  addTerm(): void {
    this.termsArray.push(this.createTerm());
  }

  addTermBefore(idx: number): void {
    this.termsArray.insert(idx, this.createTerm());
  }

  removeTerm(idx: number): void {
    this.termsArray.removeAt(idx);
  }

  clearTerms(): void {
    const termsFormArray = this.fb.array([]);
    this.topicForm.setControl('terms', termsFormArray);
  }

  // get termResources(term: ): FormArray {
  //   return this.topicForm.get('terms') as FormArray;
  // }

  // reset(): void {
  // }

  // autoSave(): void {
  // }

  onSubmit(): void {
    if (!this.loaded || !this.topicForm.valid) {
      return;
    }

    const values = this.topicForm.value;
    const { title, titleShort, description, tags, type, terms } = values;

    const isOwnTopic = this.isOwnTopic;
    if (!isOwnTopic) {
      this._topic = this.topicsStore.copyTopic(this._user, this._topic);
    }

    Object.assign(this._topic, {title, titleShort, description, tags, type});
    this._topic.terms = (terms || []).map(t => TopicTerm.fromObject(this._topic, t));

    this.localStorage.saveTopic(this._topic);


    if (!isOwnTopic) {
      this.router.navigateByUrl('/topic/' + this._topic.key + '/edit');
    }
}

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicEditorComponent:onLoadTopicsSuccess');
    const key = this.route.snapshot.paramMap.get('key');
    this._topic = topics.allTopics.find(t => t.key === key);
    this._topicsLoaded = !!this._topic;
    this.setupForm();
  }

  private onLoadUserSuccess(user: User): void {
    console.log('TopicEditorComponent:onLoadTopicsSuccess');
    this._user = user;
    this._userLoaded = !!this._user;
  }

  private setupForm(): void {
    if (this._topic) {

      const { key, type, title, titleShort, description } = this._topic;
      const tags = (this._topic.tags || []).join(', ');

      this.topicForm.patchValue({
        key,
        type,
        title,
        titleShort,
        description,
        tags,
      });

      this.clearTerms();
      (this._topic.terms || []).map(term => {
        this.termsArray.push(this.createTerm(term));
      });
    }
  }
}
