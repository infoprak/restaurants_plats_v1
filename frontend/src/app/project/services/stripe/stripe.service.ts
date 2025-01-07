import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http:HttpClient) { }

  async charge(plats:any, user:any, tokenId:any) {
    return await this.http.post('http://192.168.0.22:3000/api/v0.1/payments', {
      stripeToken: tokenId,
      command: plats,
      user: user
    }).toPromise();
  }
}