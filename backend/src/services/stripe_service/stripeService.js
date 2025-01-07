const stripe = require('stripe')("sk_test_51PY234Lzmt2opubFSavfBrHCdhsqLYWrAuXCO7zDtKSLGV55zVLh5euXEA96jFj6BwNkvcaPGoIQmqIqRkf2htFV00UFJkRxVx")

const payment = async (cantidad, user, stripeToken) => {

    const cantidadEur = Math.round(cantidad * 100);
    const chargeObject = await stripe.charges.create({
        amount: cantidadEur,
        currency: 'eur',
        source: stripeToken,
        capture: false,
        description: `name: ${user.name}, day ${user.day}::${user.time}`,
        receipt_email: 'liucs02@gmail.com'
    });
    
    // Comprovaciones sobre el pago
    try {
        await stripe.charges.capture(chargeObject.id);
        return chargeObject;
    } catch(error){
        await stripe.refunds.create({charge:chargeObject.id});
        return chargeObject;
    }
}

module.exports = {payment}