import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'prices',
        loadChildren: () => import('../prices/prices.module').then(m => m.PricesPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/prices',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/prices',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
