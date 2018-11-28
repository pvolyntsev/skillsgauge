import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

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
import { TopicsListComponent, TopicsListItemComponent } from './pages/topics';
import { TopicTestComponent, TopicTestTermComponent, TopicTestNavigationComponent } from './pages/topic-test';

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
    TopicsListComponent,
    TopicsListItemComponent,
    TopicTestComponent,
    TopicTestTermComponent,
    TopicTestNavigationComponent,
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    HttpClientModule,
    // ReactiveFormsModule,
    FormsModule,
    ShareButtonsModule.forRoot(),
    MainLayoutModule,
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
