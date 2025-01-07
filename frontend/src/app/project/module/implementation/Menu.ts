import { APlate } from "../../services/API/APlate";
import { IMenu } from "../interfaces/IMenu";
import { Plat } from "./Plat";

export class Menu implements IMenu{
    plats:Plat[] = []

    constructor(private APlate:APlate){}

    // recover plates from database
    recover(menu:any, extras:any){
        this.plats = [];
        menu.plats.forEach((p:any) => {
            let plat = new Plat(p, extras)
            plat.price = parseFloat(p.price)
            plat.quantity = p.quantity
            this.plats.push(plat)
        });
    }

    async getPlats(extras:any, lang:string){
        let plates = await this.APlate.getAll(lang).toPromise();
        plates.plates.forEach((p:any) => {
            this.plats.push(new Plat(p, extras))
        });
    }
}