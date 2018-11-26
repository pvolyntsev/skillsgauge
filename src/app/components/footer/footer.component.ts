import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: '<ng-content></ng-content>',
  styleUrls: ['./footer.component.scss'],

  // selector: '[appFooter]', // tslint:disable-line
  // templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
}
