import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { loadStripe, Stripe, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement, StripeCardElement } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { StripeService } from 'src/app/project/services/stripe/stripe.service';
import { Comanda } from 'src/app/project/module/implementation/Comanda';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements AfterViewInit {

  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;

  stripe: Stripe | null = null;
  cardNumber: StripeCardNumberElement | null = null;
  cardExpiry: StripeCardExpiryElement | null = null;
  cardCvc: StripeCardCvcElement | null = null;

  cardError!:string|null;
  constructor(
    private ngZone:NgZone,
    private stripeService:StripeService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.stripe = await loadStripe('pk_test_51PY234Lzmt2opubFQhQ4YvvuJado4ExKolEtRTBmJy2X3CG9w7hvZeV9ztMEM09nRzV5z3tSiY7btBV1Llpg2aiN00RAMXGcNz');
    if(this.stripe){
      const elements = this.stripe.elements();

      let style = {
        base: {
          color: '#3d3d3d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '1.8rem',
          textAlign:'center',
          height:'40px',
          lineHeight:'40px',
          '::placeholder': {
            color: '#3d3d3d90'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      };

      this.cardNumber = elements.create('cardNumber', { style });
      this.cardNumber.mount(this.cardNumberElement.nativeElement);

      style.base.fontSize = '1.2rem';

      this.cardExpiry = elements.create('cardExpiry', { style });
      this.cardExpiry.mount(this.cardExpiryElement.nativeElement);

      this.cardCvc = elements.create('cardCvc', { style });
      this.cardCvc.mount(this.cardCvcElement.nativeElement);
    }
  }

  onChange({error}:any){
    if(error){
      this.ngZone.run(() => this.cardError = error.message);
    } else {
      this.ngZone.run(() => this.cardError = null);
    }
  }

  async payment(comanda:Comanda, user:any){
    if (!this.stripe || !this.cardNumber || !this.cardExpiry || !this.cardCvc) {
      return false;
    }

    const { token, error } = await this.stripe.createToken(this.cardNumber);

    if (token) {
      let correct:any = await this.stripeService.charge(comanda.plats, user, token.id); // Cantidad a pagar y el ID del token
      return correct.stripe.paid
    } else {
      this.ngZone.run(() => { if(error.message) this.cardError = error.message });
      return false
    }
  }
}