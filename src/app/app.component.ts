import { Component, OnInit } from '@angular/core';
import { CollectionUtil } from './service/collection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'publicMethod';
  str
  constructor() {

  }
  ngOnInit() {
     this.str = CollectionUtil.flat([[['asd','ssq'],['asd','ssq']],[['asd','ssq'],['asd','ssq']],[['asd','ssq'],['asd','ssq']],[['asd','ssq'],['asd','ssq']]],2)
     console.log(this.str)
  }
  
}
