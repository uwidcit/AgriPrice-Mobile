import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricesPage } from './prices.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PricesPageRoutingModule } from './prices-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PricesPageRoutingModule
  ],
  declarations: [PricesPage]
})
export class PricesPageModule { }
