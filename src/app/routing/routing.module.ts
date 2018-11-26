import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../pages/home/home.component';
import { IntroComponent } from '../pages/intro/intro.component';
import { P404Component } from '../pages/404/p404.component';
import { TopicsListComponent } from '../pages/topics/topics-list.component';
import { TopicTestComponent } from '../pages/topic-test/topic-test.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'topics', component: TopicsListComponent },
  { path: 'topic/:key', component: TopicTestComponent },
  { path: 'dashboard', component: DashboardComponent },

  { path: '**',  component: P404Component }
];

@NgModule({
  declarations: [
    HomeComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: false })
  ]
})
export class RoutingModule { }

