import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// modules
import { RoutingModule } from './routing/routing.module';

// components
import { AppComponent } from './app.component';

// pages
import { P404Component } from './pages/404/p404.component';
import { TopicsListComponent, TopicsListItemComponent } from './pages/topics/topics-list.component';
import { TopicTestComponent, TopicTestTermComponent } from './pages/topic-test/topic-test.component';

// сервисы
import { QuestionnaireService } from './services/questionnaire.service';

@NgModule({
  declarations: [
    AppComponent,
    P404Component,
    TopicsListComponent,
    TopicsListItemComponent,
    TopicTestComponent,
    TopicTestTermComponent,
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    HttpClientModule,
    // ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    QuestionnaireService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
