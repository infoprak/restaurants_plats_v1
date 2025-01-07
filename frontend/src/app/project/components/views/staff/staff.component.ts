import { Component, OnInit } from '@angular/core';
import { AExtras } from 'src/app/project/services/API/AExtras';
import { AOrder } from 'src/app/project/services/API/AOrder';
import { APlate } from 'src/app/project/services/API/APlate';
import { LangService } from 'src/app/project/services/lang/lang.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  plates:any = [];
  plates_all:any = [];
  commanda:any = [];
  extras:any = [];

  constructor(
    private APlate:APlate,
    private lang:LangService,
    private AExtras:AExtras,
    private AOrder:AOrder
  ) { }

  ngOnInit(): void {
    this.getPlates();
    this.getExtras();
  }

  async getPlates(){
    let lang = this.lang.getLanguage()
    let plates = await this.APlate.getAll(lang.id).toPromise();
    this.plates = plates.plates
    this.plates_all = plates.plates;
  }

  async getExtras(){
    let lang = this.lang.getLanguage();
    let extras = await this.AExtras.getAll(lang.id).toPromise();
    extras.data.forEach((e:any) => {
      e.selected = 0;
    })
    this.extras = extras.data;
    //this.plates_all = plates.plates;
  }

  filterPlates(input:HTMLInputElement){
    this.plates = this.plates_all.filter((p: any) => p.name.toLowerCase().includes(input.value.toLowerCase()));
  }

  addPlate(plate:any, searcher_input:HTMLInputElement, option_list:HTMLElement){
    searcher_input.value = '';
    option_list.classList.add('hide');
    plate.extras = JSON.parse(JSON.stringify(this.extras));
    plate.price = parseInt(plate.preu);
    plate.image=''
    this.commanda.unshift(plate);
  }

  removePlate(plate:any){
    let index = this.commanda.indexOf(plate);
    if(index > -1){
      this.commanda.splice(index, 1);
    }
  }

  showExtras(list:HTMLElement){
    if(list.classList.contains('hide')) list.classList.remove('hide')
    else list.classList.add('hide')
  }

  selectExtra(extraEl:HTMLElement, extra:any){
    if(extraEl.classList.contains('selected')){
      extraEl.classList.remove('selected');
      extra.selected = 0;
    } else {
      extraEl.classList.add('selected')
      extra.selected = 1;
    }
  }
  updateNote(note:HTMLTextAreaElement, plate:any){
    plate.note = note.value
  }

  async finishOrder(tableEl:HTMLInputElement){
    let table:number = parseInt(tableEl.value)
    if(table > 0){
      let today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      const hours = String(today.getHours()).padStart(2, '0');
      const minutes = String(today.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      let user = {
        name:`T${table}`,
        phone:1,
        day:formattedDate,
        time:formattedTime
      }
      try {
        console.log(this.commanda)
        let result:any = await this.AOrder.new({user, plates:this.commanda}).toPromise()
        if(result?.data == 'OK'){
          this.commanda = [];
          tableEl.value = '';
        }
      } catch(e){console.log(e)}
    }
  }
}