import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AExtras {
    conf = require('./conf.json');
    url = this.conf.url;
    
    constructor(private http: HttpClient){}

    getAll(lang:string):Observable<any> {
        return this.http.get(`${this.conf.url}/extras?lang=${lang}`, this.createHeader());
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