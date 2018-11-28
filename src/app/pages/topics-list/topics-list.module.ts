import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TopicsListComponent } from './topics-list.component';
import { TopicsListItemComponent } from './topics-list-item.component';

import { ShareButtonsModule } from '@ngx-share/buttons';

@NgModule({
  declarations: [
    TopicsListComponent,
    TopicsListItemComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ShareButtonsModule,
  ],
  exports: [
    TopicsListComponent,
    TopicsListItemComponent,
  ]
})
export class TopicsListModule { }
