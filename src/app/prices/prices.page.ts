import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CommodityPriceComponent } from './commodity-price/commodity-price.component';
const moment = require('moment');

@Component({
  selector: 'app-prices',
  templateUrl: 'prices.page.html',
  styleUrls: ['prices.page.scss']
})
export class PricesPage {
  dailycrops: any[] = [];
  cropRecordDate: any;
  message = 'This modal example uses the modalController to present and dismiss modals.';

  constructor(private http: HttpClient, private modalCtrl: ModalController) {
    this.cropRecordDate = new Date();
    this.http.get('https://agrimarketwatch.herokuapp.com/crops/daily/recent').subscribe((response: any) => {
      this.dailycrops = response;
      this.cropRecordDate = moment(this.dailycrops[0].date);
    });
  }

  async openModal(crop: any) {
    console.debug(crop);

    const modal = await this.modalCtrl.create({
      component: CommodityPriceComponent,
      componentProps: {
        commodity: crop
      }
    });
    modal.present();
  }


}
