import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GtagModule } from 'angular-gtag';

// modules
import { RoutingModule } from './routing/routing.module';
import { ShareButtonsModule } from '@ngx-share/buttons';

// components
import { AppComponent } from './app.component';

// layouts
import { CleanLayoutComponent } from './layouts/clean/clean-layout.component';
import { MainLayoutModule } from './layouts/main';

// pages
import { P404Component } from './pages/404/p404.component';
import { IntroComponent } from './pages/intro/intro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TopicsListModule } from './pages/topics-list';
import { TopicTestModule} from './pages/topic-test';
import { TopicEditorModule } from './pages/topic-editor';
import { StoriesComponent } from './pages/stories/stories.component';

// сервисы
import { QuestionnaireService, QuestionnaireLocalStorageService } from './services';
import { TopicsStore, UserStore, AnswersStore } from './stores';

@NgModule({
  declarations: [
    AppComponent,
    CleanLayoutComponent,
    P404Component,
    IntroComponent,
    DashboardComponent,
    StoriesComponent,
  ],
  imports: [
    RoutingModule,
    GtagModule.forRoot({ trackingId: 'UA-72238845-1', trackPageviews: true, debug: true }),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ShareButtonsModule.forRoot(),
    MainLayoutModule,
    TopicsListModule,
    TopicTestModule,
    TopicEditorModule,
  ],
  providers: [
    QuestionnaireLocalStorageService,
    QuestionnaireService,
    TopicsStore,
    UserStore,
    AnswersStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
