const orderService = require("../../services/order_service/orderService");
const User = require("../../module/implementations/user")
const Order = require("../../module/implementations/order")

/***************
 * POSTs
***************/
const newOrder = async (req, res) => {
    if(req.body.user && req.body.plates){
        let user = new User(req.body.user)
        let order = new Order(req.body.plates)

        if((!user.checkFields() && !order.checkOrder()) || user.phone == 1){
            try{
                let result = await orderService.newOrder(user, order);
                if(result) res.status(200).send({data:"OK"});
                else res.status(402).send({data:"Could not add the order"});
            } catch(e){console.log(e);res.status(500).send({error:"Internal server error"})}
        } else res.status(422).send({error:"Wrong params"});
    } else res.status(422).send({error:"Wrong params"});
}

module.exports = {newOrder}