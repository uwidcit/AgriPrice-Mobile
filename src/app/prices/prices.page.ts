import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const moment = require('moment');

@Component({
  selector: 'app-prices',
  templateUrl: 'prices.page.html',
  styleUrls: ['prices.page.scss']
})
export class PricesPage {

  dailycrops: any[] = [];
  cropRecordDate: any;

  constructor(private http: HttpClient) {
    this.cropRecordDate = new Date();
    this.http.get('https://agrimarketwatch.herokuapp.com/crops/daily/recent').subscribe((response: any) => {
      this.dailycrops = response;
      this.cropRecordDate = moment(this.dailycrops[0].date);
    });
  }



}
