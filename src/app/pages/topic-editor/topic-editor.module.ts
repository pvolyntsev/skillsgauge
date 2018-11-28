import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TopicEditorComponent } from './topic-editor.component';

@NgModule({
  declarations: [
    TopicEditorComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    TopicEditorComponent,
  ]
})
export class TopicEditorModule { }
