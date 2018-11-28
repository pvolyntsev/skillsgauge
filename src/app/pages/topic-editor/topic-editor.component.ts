import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Topic } from '../../models';

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.component.html',
  styleUrls: ['./topic-editor.component.scss']
})
export class TopicEditorComponent implements OnInit, OnDestroy {

  topic: Topic = new Topic();

  topicForm = this.fb.group({
    key: ['', Validators.required],
    title: ['', Validators.required],
    titleShort: ['', Validators.required],
    // key = ''; // "oop_common",
    // type = ''; // "common_knowledge",
    // title = ''; // Объектно-ориентированное программирование",
    // titleShort = ''; // "ООП",
    terms: this.fb.array([
      this.fb.control('')
    ]),
    // answers: this.fb.array([
    //   this.fb.control('')
    // ]),
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.setupForm();
  }

  ngOnDestroy() {
  }

  get terms(): FormArray {
    return this.topicForm.get('terms') as FormArray;
  }

  createTerm(): FormGroup {
    return this.fb.group({
      key: '',
      title: '',
    });
  }

  addTerm(): void {
    this.terms.push(this.createTerm());
  }

  // get termResources(term: ): FormArray {
  //   return this.topicForm.get('terms') as FormArray;
  // }

  // autoSave(): void {
  // }

  setupForm(): void {
    this.topicForm.patchValue({
      name: 'test',
      terms: [
        {
          name: 'alpha',
          title: 'alpha',
        }
      ]
    });
  }

  onSubmit(): void {
    console.warn(this.topicForm.value);
  }

  // reset(): void {
  // }
}
