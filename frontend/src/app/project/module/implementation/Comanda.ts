import { AExtras } from "../../services/API/AExtras";
import { AOrder } from "../../services/API/AOrder";
import { AShift } from "../../services/API/AShift";
import { IComanda } from "../interfaces/IComanda";
import { Plat } from "./Plat";

export class Comanda implements IComanda{
    plats:Plat[] = [];
    shifts:any;
    extras:any;
    time:any;
    day:any;

    constructor(private AShift:AShift, private AOrder:AOrder){
        this.getShifts()
    }

    recover(comanda:any, extras:any){
        comanda.plats.forEach((p:any) => {
            p.preu = parseFloat(p.price)
            let plat = new Plat(p, extras)
            this.addPlat(plat);
        });
        this.getShifts();
    }
    
    async getShifts(){
        let sh = await this.AShift.getAll().toPromise();
        this.shifts = sh.shift;
    }

    addPlat(p:Plat){
        this.plats.push(p);
    }

    removePlat(p:Plat){
        let plat = this.plats.filter(pl => pl.id == p.id)[0]
        let index = this.plats.indexOf(plat);
        if(index != -1) this.plats.splice(index,1);
    }

    getTotal(){
        let total = 0;
        this.plats.forEach(p => {
            let val = p.price;
            if(typeof(val) == 'string') val = parseFloat(val);
            total += val;
        });
        return total.toFixed(2);
    }

    async new(user:any){
        console.log('NEW')
        console.log(this.plats)
        this.time = user.time;
        this.day = user.day;
        console.log(this.plats)
        let result = await this.AOrder.new({user, plates:this.plats}).toPromise();
        return result
    }
}