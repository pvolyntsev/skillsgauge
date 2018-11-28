import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TopicTestTermComponent } from './topic-test-term.component';
import { TopicTestNavigationComponent } from './topic-test-navigation.component';
import { TopicTestComponent } from './topic-test.component';

import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  declarations: [
    TopicTestTermComponent,
    TopicTestNavigationComponent,
    TopicTestComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ShareButtonsModule,
  ],
  exports: [
    TopicTestTermComponent,
    TopicTestNavigationComponent,
    TopicTestComponent,
  ]
})
export class TopicTestModule { }
