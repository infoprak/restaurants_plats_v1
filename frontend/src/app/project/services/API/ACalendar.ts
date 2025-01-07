import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ACalendar {
    conf = require('./conf.json');
    url = this.conf.url;
    
    constructor(private http: HttpClient){}

    getCalendar():Observable<any> {
        return this.http.get(`${this.conf.url}/calendar`, this.createHeader());
    }

    private createHeader() {

        const header = {
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Acces-Control-Allow-Headers':'Origin, Content-Type, Accept,Authorization'
        }
        return {headers: new HttpHeaders(header)};
    }
}