import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricesPage } from './prices.page';

const routes: Routes = [
  {
    path: '',
    component: PricesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricesPageRoutingModule { }
