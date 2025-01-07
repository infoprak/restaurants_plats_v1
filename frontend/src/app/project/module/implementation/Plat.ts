import { IPlat } from "../interfaces/IPlat";

export class Plat implements IPlat {
    id!:number;
    name!:string;
    img!:string;
    labels!:any[];
    description!:string;
    price!:number;
    quantity:number = 0;
    extras:any;
    note:string = '';
    clasification!:number;
    index!:number;

    constructor(plat:any, extras:any){
        this.id = plat.id
        this.name = plat.name;
        this.img = plat.img;
        this.labels = plat.labels;
        this.description = plat.description;
        this.clasification = plat.clasification;
        this.index = plat.index
        this.price = plat.preu ? parseFloat(plat.preu) : parseFloat(plat.price);
        this.setExtras(extras)
    }

    setExtras(extras:any){
        let tmp = JSON.parse(JSON.stringify(extras));
        tmp.forEach((e:any) => {e.selected = 0; e.price = parseFloat(e.price)});
        this.extras = tmp
    }
    add(){ this.quantity += 1; }
    remove(){ if(this.quantity > 0) this.quantity -= 1; }
    addExtra(extra:any){
        let index = this.extras.indexOf(extra);
        if(index != -1) this.extras[index].selected = 1
        let update:any = this.price
        update = parseFloat(update) + parseFloat(extra.price);
        this.price = update;
    }
    removeExtra(extra:any){
        extra.selected = 0;
        this.price -= extra.price;
    }

    addNote(note:string|null){
        console.log(note)
        if(note) this.note = note
    }
}