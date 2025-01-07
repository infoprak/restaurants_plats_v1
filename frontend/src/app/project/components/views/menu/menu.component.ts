import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Comanda } from 'src/app/project/module/implementation/Comanda';
import { FieldsFormat } from 'src/app/project/module/implementation/FieldsFormat';
import { Menu } from 'src/app/project/module/implementation/Menu';
import { Plat } from 'src/app/project/module/implementation/Plat';
import { AExtras } from 'src/app/project/services/API/AExtras';
import { AOrder } from 'src/app/project/services/API/AOrder';
import { APlate } from 'src/app/project/services/API/APlate';
import { AShift } from 'src/app/project/services/API/AShift';
import { LangService } from 'src/app/project/services/lang/lang.service';
import { PaymentComponent } from '../payment/payment.component';
import { ACalendar } from 'src/app/project/services/API/ACalendar';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // page_state = 'Loading';
  page_state = 'Loading';
  menu:Menu = new Menu(this.APlate);
  labels:any = [];
  commanda:Comanda = new Comanda(this.AShift, this.AOrder)
  plate!:Plat;
  fields:FieldsFormat = new FieldsFormat();
  user:any = {}
  extras:any;
  langJSON:any = {}
  clasification:any = [];
  recurrents:any = [];
  day!:any;
  month:any = {};
  dayNames:any = ["Dl", "Di", "Dm", "Dj", "Dv", "Ds", "Dg"];
  date:any = new Date();
  torns:any = []
  table:any = -1;

  @ViewChild(PaymentComponent) payment!: PaymentComponent;

  constructor(
    public APlate:APlate,
    public AShift:AShift,
    public AOrder:AOrder,
    public AExtras:AExtras,
    private lang:LangService,
    public router:Router,
    private ACalendar:ACalendar
  ) { }

  async ngOnInit() {
    await this.getExtras();
    this.getCalendar();
    this.getPlateClasification();
    this.langJSON=this.lang.getSection('menu');

    // get menu
    let date_numeric = this.getNumericDate();
    await this.getPlates();
    let lstg_commanda = localStorage.getItem('commanda');
    if(lstg_commanda && date_numeric == JSON.parse(lstg_commanda).date){
      let command = JSON.parse(lstg_commanda);
      command.commanda.forEach((plate:any) => {
        let menu_plate:Plat = this.menu.plats.filter((p:any) => p.id == plate.id)[0]
        menu_plate.quantity += 1;
        let newPlate = new Plat(menu_plate, menu_plate.extras)
        this.commanda.addPlat(newPlate);
      });
    }
    setTimeout(()=>{this.page_state = 'Menu'},500);
    //  setTimeout(()=>{this.page_state = 'Order'},500);
  }
  /* CALENDAR */
  
  async getCalendar(){
    let calendar = await this.ACalendar.getCalendar().toPromise();
    this.recurrents = calendar;
    this.getMonth();
  }
  getMonthName(month:number){
    let months = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Septembre", "Octubre", "Novembre", "Desembre"]
    return months[month]
  }
  getMonth(){
    // Obtener el año y mes actual
    const year = this.date.getFullYear();
    const month = this.date.getMonth(); // Enero es 0, Febrero es 1, etc.
    this.month.name = this.getMonthName(month);
    this.month.year = year

    this.getDaysInMonth(year, month);
  }

  getDaysInMonth(year:number, month:number) {
    let today = new Date()
    const date = new Date(year, month, 1);  // Empieza en el primer día del mes
    let dayOfWeek = date.getDay() // 0 == Sunday
    let emptyDays = 0;
    if(dayOfWeek == 0) emptyDays = 6;
    else emptyDays = dayOfWeek-1;

    this.month.days = [];
    // add empty days
    for(let i =0; i < emptyDays; i++){
      this.month.days.push({holiday:false, number:''});
    }

    while (date.getMonth() === month) {
      let day =  new Date(date);
      let number = day.getDate();
      let month = day.getMonth();
      let holiday = false;
      let torns = [];
      
      // get day schedule 
      let recurrent_rule = this.recurrents.filter((r:any) => r.dia == number && r.mes == month)[0];
      if(recurrent_rule){
        let no_recurrent_rule = this.recurrents.filter((r:any) => r.dia == number && r.mes == month && r.any == day.getFullYear())[0]
        if(no_recurrent_rule){ // No recurrent
          holiday = no_recurrent_rule.laboral==0 ? true:false;;
          torns = no_recurrent_rule.torns;
        }
        else { // recurrent day
          holiday = recurrent_rule.laboral==0 ? true:false;;
          torns = recurrent_rule.torns;
        }
      } else {
        recurrent_rule = this.recurrents.filter((r:any) => r.dia_setmana == day.getDay())[0]
        if(recurrent_rule){ // recurrent week
          holiday = recurrent_rule.laboral==0 ? true:false;
          torns = recurrent_rule.torns;
        } else { // laborable
          recurrent_rule = this.recurrents.filter((r:any) => r.dia_setmana == null && r.dia == null)[0];
          torns = recurrent_rule.torns
        }
      }
      let past = false //number < today ? true : false
      if(date.getFullYear() < today.getFullYear()) past = true;
      else if(date.getFullYear() == today.getFullYear() && date.getMonth() < today.getMonth()) past = true;
      else if(date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && number < today.getDate()) past = true;
      this.month.days.push({number, holiday, torns, past});
      date.setDate(date.getDate() + 1);
    }
  }

  changeMonth(num:number){
    this.date.setMonth(this.date.getMonth()+num);
    this.getMonth()
  }

  /* CALENDAR */
  async getPlateClasification(){
    let lang = this.lang.getLanguage();
    let clasification = await this.APlate.getPlateClasification(lang.id).toPromise();
    if(clasification.length>0) this.clasification = clasification;
  }
  async getExtras(){
    let lang = this.lang.getLanguage();
    let extras = await this.AExtras.getAll(lang.id).toPromise();
    if(extras?.data) this.extras = extras.data;
  }

  showCart(){
    let table = localStorage.getItem('tableid')
    if(table) this.table = parseInt(table)
      window.scrollTo(0,0);
      this.page_state='Loading';
      setTimeout(() => { this.page_state='Order'; }, 500);
  }

  goToMenu(){
    window.scrollTo(0,0);
    this.page_state = 'Menu';
  }

  getNumericDate(){
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth()+1;
    let year = date.getFullYear();
    return parseInt(`${year}${mm}${dd}`);
  }

  async getPlates(){
    let lang = this.lang.getLanguage()
    await this.menu.getPlats(JSON.parse(JSON.stringify(this.extras)), lang.id);

    // get distinct labels
    let labels = [...new Set(this.menu.plats.map((p) => p.labels))];
    labels.forEach(lab => {
      if(lab.length > 0){
        lab.forEach(l => this.labels.push(l));
      }
    });
  }

  updateLocalstorage(){
    let date_numeric = this.getNumericDate();
    let comanda:any = [];
    this.commanda.plats.forEach((p:any) => {
      let plate = {id:p.id, extras:p.extras, note:p.note}
      comanda.push(plate);
    });
    localStorage.setItem('commanda', JSON.stringify({commanda:comanda, date:date_numeric}))
  }

  addPlate(event:Event, p:Plat){
    event.stopPropagation();
    p.add();
    let plat = new Plat(p, this.extras);
    this.commanda.addPlat(plat);
    this.updateLocalstorage();
  }

  removePlate(event:Event, p:Plat){
    event.stopPropagation();
    p.remove();
    this.commanda.removePlat(p);
    this.updateLocalstorage();
  }

  dishDetails(plate:Plat, popup:HTMLElement){
    this.plate = plate;
    popup.classList.remove('hide');
  }

  setActive(element:HTMLElement, element_list:HTMLElement){
    let label = document.querySelector("label[name='shifts']");
    if(element.classList.contains('active')) {
      this.user.shift = '';
      element.classList.remove('active');
      label?.classList.add('error');
    } else {
      this.user.shift = element.textContent;
      element_list.querySelector('.active')?.classList.remove('active');
      element.classList.add('active');
      label?.classList.remove('error');
    }
  }

  /* CHECK FORM */
  checkName(name:HTMLInputElement){
    this.user.name = name.value;
    let nameError = this.fields.checkName(name.value);
    if (nameError != '') {this.addError(name, nameError);}
    else (name.parentNode as HTMLElement).classList.remove('error');
  }
  
  checkPhone(phone:HTMLInputElement){
    this.user.phone = phone.value;
    let nameError = this.fields.checkPhone(phone.value);
    if (nameError != '') {this.addError(phone, nameError);}
    else (phone.parentNode as HTMLElement).classList.remove('error');
  }

  checkDate(dayHTML:HTMLElement, number:number, holiday:boolean, past:boolean){
    if(!holiday && !past){      
      this.user.day = number;
      document.querySelector('.day.select')?.classList.remove('select')
      dayHTML.classList.add('select')
    }
  }

  acceptar(){
    let date = document.querySelector('.date-input');
    if(date){
      let day = document.querySelector('.day.select');
      if(day){
        let number = day.textContent;
        let months = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Septembre", "Octubre", "Novembre", "Desembre"]
        let dayError:any = this.fields.checkDay(`${this.month.year}-${months.indexOf(this.month.name)+1}-${number}`)
        date.textContent = dayError.day;
        if (dayError.error != '') {this.addError((date as HTMLElement), dayError.error);}
        else {
          console.log(date);
          (date.parentNode as HTMLElement).classList.remove('error');
          // SET TORNS
          this.torns = [];
          let day = this.month.days.filter((m:any) => m.number == number)[0]
          day.torns.forEach((t:any) => {
            let inici = parseInt(t.inici.split(':')[0]);
            let fi = parseInt(t.fi.split(':')[0]);
            do {
              let time = inici.toString();
              time = time.length == 1 ? `0${time}:00` : time+':00';
              this.torns.push(time);
              inici+=1;
            } while(inici <= fi);
          });
        }
      }
    }
  }

  addError(input:HTMLInputElement|HTMLElement, error:string){
    let parent:HTMLElement = (input.parentNode as HTMLElement)
    if(parent) {
      parent.classList.add("error");
      parent.setAttribute('error', error);
    }
  }

  setAttributeId(index:number){
    let result = '';
    if(index){
      result = this.clasification[index-1].name;
    }
    return result
  }
  scrollTo(location:string){
    document.querySelector('#' + location)?.scrollIntoView();
  }

  async finishOrder(name:HTMLInputElement|null, phone:HTMLInputElement|null, date:HTMLInputElement|HTMLElement|null, timeList:HTMLElement|null, btn_finish:HTMLElement){
    if(this.table > -1){
      let today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
    
      const formattedDate = `${day}/${month}/${year}`;
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      let user = {
        name:`T${this.table}`,
        phone:1,
        day:formattedDate,
        time:formattedTime
      }
      try {
        let result:any = await this.commanda.new(user);
        if(result?.data == 'OK'){
          localStorage.removeItem('commanda');
          localStorage.removeItem('menu');
          this.page_state = 'Confirmed';
        }
      } catch(e){console.log(e)}

    } else {
      if(name && phone && date && timeList) {
        btn_finish.classList.add('loading');
        let error = false;
        let nameError = this.fields.checkName(name.value)
        if (nameError != '') {error = true;this.addError(name, nameError);}
        let phoneError = this.fields.checkPhone(phone.value)
        if (phoneError != '') {error = true;this.addError(phone, phoneError);}
        /*let dayError:any = this.fields.checkDay(date.value)
        if (dayError.error != '') {error = true; this.addError(date, dayError.error);}*/
    
        let time = timeList.querySelector('.active')?.textContent;
        if(!time) {error = true; document.querySelector("label[name='shifts']")?.classList.add('error')}
    
        if(!error){
          console.log(date.textContent)
          console.log(time)
          let user = {
            name:name.value,
            phone:phone.value,
            day:date.textContent,
            time:time
          }
  
          let paid:any = await this.payment.payment(this.commanda, user);
          if(paid){
            try {
              let result:any = await this.commanda.new(user);
              if(result?.data == 'OK'){
                localStorage.removeItem('commanda');
                localStorage.removeItem('menu');
                this.page_state = 'Confirmed';
              }
            } catch(e){console.log(e)}
          } else {
            let error = document.querySelector("p.error")
            if(error) error.classList.remove('hide')
          }
        }
      }
    }
    btn_finish.classList.remove('loading');
  }

  /* SHOW EXTRA INGREDIENTS */
  uncollapseExtras(extraIngredientsBtn:HTMLElement, extra_elements:HTMLElement){
    if(extraIngredientsBtn.classList.contains('collapsed')){
      extraIngredientsBtn.classList.remove('collapsed');
      extra_elements.classList.remove('collapsed');
    } else {
      extraIngredientsBtn.classList.add('collapsed');
      extra_elements.classList.add('collapsed');
    }
  }

  selectIngredient(plate:Plat, ingredient:any, ingredientHTML:HTMLElement, label:HTMLElement){
    if(ingredient.selected == 1) {
      plate.removeExtra(ingredient);
      ingredientHTML.classList.remove('active');

      let sel = plate.extras.filter((p:any) => p.selected == 1);
      if(sel.length == 0) label.textContent = this.langJSON.extras_3;
    } else {
      plate.addExtra(ingredient);
      ingredientHTML.classList.add('active');
      label.textContent = this.langJSON.extras_2;
    }
  }

  /* CALC NOTE CHARS */
  setAttr(text:HTMLElement) {
    let textContent = text.textContent ? text.textContent : '';
    let value:any = textContent.length ? textContent.length : 0;
    if(value >= 60){
      text.classList.add('max');
      value = 60;
      text.textContent = textContent.substring(0,60);
    } else text.classList.remove('max');
    text.setAttribute('length', value.toString());
  }
}