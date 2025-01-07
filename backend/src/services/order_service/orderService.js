const orderDatabase = require("../../database/order_database/orderDatabase")
const plateDatabase = require("../../database/plate_database/plateDatabase")

/***************
 * POSTs
***************/
const newOrder = async (user, order) => {
    let user_obj = user.getUser();
    user_obj.total = order.getTotal();
    let user_response;
    user_response = await orderDatabase.addOrderUser(user_obj);

    for(let i = 0; i < order.plates.length; i++){
        let extras_inserts = '';
        let extras_values = [];
        if(!order.plates[i].description) order.plates[i].description = ""
        let plate = await plateDatabase.getOne(order.plates[i].name); // get plate data from DB
        let plate_response = await orderDatabase.addOrderPlates([user_response.insertId, plate[0].plate_id, order.plates[i].price,i+1, order.plates[i].description]);
        plate_id = plate_response.insertId;
        // insert extras
        for(let j = 0; j < order.plates[i].extras.length; j++){

            extras_inserts = `${extras_inserts} (?,?),`
            extras_values.push(plate_id, order.plates[i].extras[j].id)
        }
        extras_inserts = extras_inserts.slice(0, -1);
        await orderDatabase.addExtras(extras_inserts, extras_values)
    }
    
    if(user_response.insertId > 0) return true;
    else return false
}

module.exports = { newOrder }