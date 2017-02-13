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
  retrieved = 'false';
  crops = [];
  messaging = firebase.messaging();
  date;
  messagingToken;
  myDatabase = firebase.database();
  constructor(private dailyCrop: DailyCropService) { }

  ngOnInit() {
    this.dailyCrop.fetchData().subscribe(
      (data) => this.crops = data
    );
    this.getFirebaseMessagingToken();
  }

  fbgetData(){
    firebase.database().ref('/').on('child_added', (snapshot) =>{
      console.log(snapshot.val());
    })
  }

  fbpushData(){
    firebase.database().ref('/users/test').push({name: "food", action: "hungry"});
  }
  fbSubscribe(){
    this.messaging.getToken().then(
      (currentToken) => console.log(currentToken)
    );
  }
  getFirebaseMessagingToken(){
    this.messaging.getToken().then(
      (currentToken) => this.messagingToken = currentToken
    );
  }
  subscribeToCrop(i){
    console.log(this.messagingToken);
    this.date = new Date();
    this.myDatabase.ref('/users/' + this.crops[i].commodity).push(this.messagingToken);
    this.myDatabase.ref('/users/subscriptions/' + this.messagingToken + '/' + this.crops[i].commodity).set(this.date.getTime());
  }

}
