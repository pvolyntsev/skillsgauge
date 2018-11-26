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
import { HomeComponent } from './pages/home/home.component';
import { IntroComponent } from './pages/intro/intro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TopicsListComponent, TopicsListItemComponent } from './pages/topics';
import { TopicTestComponent, TopicTestTermComponent, TopicTestNavigationComponent } from './pages/topic-test';

// сервисы
import { QuestionnaireService, QuestionnaireLocalStorageService } from './services';
import { TopicsStore } from './store/topics.store';

@NgModule({
  declarations: [
    AppComponent,
    P404Component,
    // HomeComponent,
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
  ],
  providers: [
    QuestionnaireLocalStorageService,
    QuestionnaireService,
    TopicsStore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
