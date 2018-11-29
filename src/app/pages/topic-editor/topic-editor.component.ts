import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Topic, Topics, TopicTerm } from '../../models';
import { TopicsStore } from '../../stores';
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
  private _topics: Topics;
  private _topic: Topic;
  loaded = false;
  topicForm: FormGroup;

  constructor(private fb: FormBuilder,
              private questionnaire: QuestionnaireService,
              private localStorage: QuestionnaireLocalStorageService,
              private topicsStore: TopicsStore,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();

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
  }

  get topic(): Topic {
    return this._topic;
  }

  get termsArray(): FormArray {
    return this.topicForm.get('terms') as FormArray;
  }

  private initForm(): void {
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
    this.termsArray.reset();
  }

  // get termResources(term: ): FormArray {
  //   return this.topicForm.get('terms') as FormArray;
  // }

  // reset(): void {
  // }

  // autoSave(): void {
  // }

  onSubmit(): void {
    if (!this._topic || !this.topicForm.valid) {
      return;
    }

    const values = this.topicForm.value;
    const { title, titleShort, description, tags, type, terms } = values;

    Object.assign(this._topic, { title, titleShort, description, tags, type });
    this._topic.terms = (terms || []).map(t => TopicTerm.fromObject(this._topic, t));

    this.localStorage.saveTopic(this._topic);
  }

  onLoadTopicsSuccess(topics: Topics): void {
    console.log('TopicEditorComponent:onLoadTopicsSuccess');
    this._topics = topics;
    this.selectTopic();
    this.setupForm();
  }

  selectTopic(): void {
    const key = this.route.snapshot.paramMap.get('key');
    console.log('TopicTestComponent:selectTopic', key);
    const topic = this._topics.allTopics.find(t => t.key === key);
    if (topic) {
      this.loaded = true;
      this._topic = topic;
    } else {
      this.loaded = false;
      this._topic = null;
    }
  }

  setupForm(): void {
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

      // const termsFormGroups = []; // team.employees.map(employee => this.formBuilder.group(employee));
      // const termsFormArray = this.fb.array(termsFormGroups);
      // this.topicForm.setControl('terms', termsFormArray);

      this.clearTerms();
      (this._topic.terms || []).map(term => {
        this.termsArray.push(this.createTerm(term));
      });

      // this.termsArray.push(this.createTerm());
      // this.termsArray.push(this.createTerm());
      // this.termsArray.push(this.createTerm());
    }
  }
}
