import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from '../pages/about/about.component';
import { P404Component } from '../pages/404/p404.component';
import { TopicsListComponent } from '../pages/topics/topics-list.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'topics', component: TopicsListComponent },

  // { path: '/404', name: 'NotFound', component: NotFoundComponent },
  // { path: '/*path', redirectTo: ['NotFound'] }
  { path: '**',  component: P404Component }
];

@NgModule({
  declarations: [
    AboutComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: false })
  ]
})
export class RoutingModule { }

