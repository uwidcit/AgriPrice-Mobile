import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
    selector: 'commodity-price',
    templateUrl: 'commodity-price.component.html',
})
export class CommodityPriceComponent {

    category!: string;
    date!: string;
    price!: number;
    unit!: string;
    volume!: string;
    name!: string;

    @Input() commodity!: any;

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        console.dir(this.commodity);
        this.name = this.commodity.commodity;
        this.category = this.commodity.category;
        this.date = this.commodity.date;
        this.price = this.commodity.price;
        this.unit = this.commodity.unit;
        this.volume = this.commodity.volume;
    }

    close() {
        return this.modalCtrl.dismiss(this.commodity, 'cancel');
    }
}