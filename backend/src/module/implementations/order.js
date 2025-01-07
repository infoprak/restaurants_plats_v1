module.exports = class Order {
    plates = []; error = false;

    constructor(plates){
        try{
            if(plates && plates.length > 0){
                plates.forEach(p => {
                    let extras = p.extras.filter(e => e.selected == 1)
                    this.plates.push({name:p.name, price:p.price, extras, description:p.note})
                })
            }
        } catch(e){console.log(e);this.error = true}
    }

    checkOrder(){
        let error = false;
        if(this.plates.length == 0) error = true;
        if(this.error) error = true;
        return error
    }

    getTotal(){
        let total = 0;
        this.plates.forEach(p=>total+=p.price)
        return total
    }

    getPlates(){return this.plates}

}