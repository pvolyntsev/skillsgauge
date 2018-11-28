import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  public visible = false;

  constructor(private router: Router) {
    // обработчик на смену URL
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('FooterComponent:constructor', event.url);
      this.visible = event.url === '/dashboard';
    });

  }

  ngOnInit() {

  }
}
