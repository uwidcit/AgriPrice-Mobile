import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable()
export class DailyCropService {

  constructor(private http: Http) { }

  fetchData(){
    return this.http.get('https://agrimarketwatch.herokuapp.com/crops/daily/recent').map(
      (res) => res.json()
    );
  }

}
