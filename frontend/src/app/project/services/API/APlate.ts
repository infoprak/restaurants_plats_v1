import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LangService } from '../lang/lang.service';

@Injectable({
    providedIn: 'root'
})

export class APlate {
    conf = require('./conf.json');
    url = this.conf.url;
    
    constructor(private http: HttpClient){}

    getAll(lang:string):Observable<any> {
        return this.http.get(`${this.conf.url}/plates?lang=${lang}`, this.createHeader());
    }

    getPlateClasification(lang:number):Observable<any> {
        return this.http.get(`${this.conf.url}/plates/clasification/?lang=${lang}`, this.createHeader());
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