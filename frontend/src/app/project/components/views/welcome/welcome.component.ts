import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'src/app/project/services/lang/lang.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  languages = [
    {id:1, name:'Català', abr:"cat", welcome:"Benvingut"},
    {id:2, name:'Español', abr:"esp", welcome:"Bienvenido"},
    {id:3, name:'English', abr:"en", welcome:"Welcome"}
  ]
  table_number!:number;
  constructor(private route: ActivatedRoute, private lang:LangService, private router:Router) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      let table = params.get('mesa');
      this.table_number = table ? parseInt(table) : -1;
      localStorage.setItem('tableid', this.table_number.toString());
      console.log(`table ID: ${this.table_number}`);
    });
  }

  setLanguage(lang:any){
    this.lang.setLanguage(lang);
    this.router.navigate(['/menu']);
  }

}
