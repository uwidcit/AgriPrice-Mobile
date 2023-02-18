import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricesPage } from './prices.page';
import { HttpClientModule } from '@angular/common/http';

import { PricesPageRoutingModule } from './prices-routing.module';
import { CommodityPriceComponent } from './commodity-price/commodity-price.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    PricesPageRoutingModule,
  ],
  declarations: [PricesPage, CommodityPriceComponent]
})
export class PricesPageModule { }
