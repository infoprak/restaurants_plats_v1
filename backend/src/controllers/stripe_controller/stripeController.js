const stripeService = require("../../services/stripe_service/stripeService")
const plateService = require("../../services/plate_service/plateService")
const extraService = require("../../services/extra_service/extraService")

/***********
 POSTs
***********/
const payment = async (req, res) => {
    const stripeToken = req.body.stripeToken;
    const plats = req.body.command;
    const user = req.body.user;

    let total = 0.0;
    error = false;
    if(stripeToken && plats){
        if(plats.length > 0){
            try {
                for(let i=0; i<plats.length;i++){ // get all plates price from DB
                    let price = parseFloat(await plateService.getPrice(plats[i].id));
                    if(price){
                        let extras = plats[i].extras.filter(e => e.selected == 1)
                        for(let e=0; e < extras.length; e++){ // get all extras prices from DB
                            let extra_price = parseFloat(await extraService.getPrice(extras[e].id))
                            if(extra_price){
                                price += parseFloat(extra_price)
                            } else error = true;
                        }
                        total += parseFloat(price);
                        if(price != plats[i].price) error = true
                    } else error = true;
                }
                if(!error){
                    // payment process
                    let payment = await stripeService.payment(total, user, stripeToken)
                    res.status(200).send({stripe:payment})
                } else res.status(401).send({error:"Forbiden"});
            } catch(e){console.log(e); res.status(500).send({error:"Internal server error"})}
        } else res.status(422).send({error:"Wrong params"});
    } else res.status(422).send({error:"Wrong params"});
}

module.exports = { payment }