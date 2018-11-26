import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

  // selector: '[appHeader]', // tslint:disable-line
  // template: '<ng-content></ng-content>',
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
}
