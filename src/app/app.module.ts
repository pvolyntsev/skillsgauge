import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// modules
import { RoutingModule } from './routing/routing.module';

// components
import { AppComponent } from './app.component';

// pages
import { P404Component } from './pages/404/p404.component';

@NgModule({
  declarations: [
    AppComponent,
    P404Component,
  ],
  imports: [
    RoutingModule,
    BrowserModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
