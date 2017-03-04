import { Component, OnInit } from '@angular/core';
import { DailyCropService } from '../daily-crop.service';
declare var firebase: any;
declare var retrieved: string;

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})

export class PricelistComponent implements OnInit {
  crops = [];
  // messaging = firebase.messaging();
  date;
  messagingToken;
  // myDatabase = firebase.database();
  constructor(private dailyCrop: DailyCropService) { }

  ngOnInit() {
    this.dailyCrop.fetchData().subscribe(
      (data) => {
        // Process Each Crop Record
        let crops = data.map((crop)=>{
          crop = this.processPrice(crop);
          crop.date = this.processDate(crop.date);
          return crop;
        });
        // Sort Crop Records
        this.crops = crops.sort((a,b) => {
          console.log(a.commodity);
          return a.commodity.toLowerCase() - b.commodity.toLowerCase();
        });

      }
    );
    this.getFirebaseMessagingToken();
  }

  processDate(date) { // adjust the date to correspond to the actual date from the server since it is 4 hours off(date being selected for change date)
    date = new Date(date);
    date.setHours(date.getHours() + 4);
    date = date.toDateString();
    return date;
  };

  processPrice(crop){ // Convert KG to LB (based on request from Farmers)
    // crop.price = parseFloat(crop.price.slice(1));
    if (crop.unit && crop.unit.toLowerCase() === "kg"){
      crop.unit = "lb";
      crop.volume = Math.round(crop.volume * 2.20462);
      crop.price = crop.price / 2.20462;
    }
    crop.img_url = "assets/images/fruits/" + crop.commodity.replace(/\s/g, '') + ".jpg";// generate URL (remove space from string)
    return crop;
  };

  getFirebaseMessagingToken(){
    // this.messaging.getToken().then(
    //   (currentToken) => this.messagingToken = currentToken
    // );
  }
  subscribeToCrop(i){
    this.date = new Date();
    // this.myDatabase.ref('/users/' + this.crops[i].commodity).push(this.messagingToken);
    // this.myDatabase.ref('/users/subscriptions/' + this.messagingToken + '/' + this.crops[i].commodity).set(this.date.getTime());
  }

}
