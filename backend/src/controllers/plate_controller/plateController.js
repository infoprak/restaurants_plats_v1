const platesService = require("../../services/plate_service/plateService");

/***************
 * GETs
***************/
const getAll = async (req, res) => {
    let lang = req.query.lang
    try{
        let plates = await platesService.getAll(lang);
        if(plates.length > 0) res.status(200).send({plates})
        else res.status(404).send({error:"No plates found"})
    } catch(e){res.status(500).send({error:"Internal server error"})}
}

const getPlatesClasification = async (req, res) => {
    let lang = req.query.lang
    try{
        let plates = await platesService.getPlatesClasification(lang);
        if(plates.length > 0) res.status(200).send(plates)
        else res.status(404).send({error:"No plates clasification found"})
    } catch(e){res.status(500).send({error:"Internal server error"})}

}

module.exports = {getAll, getPlatesClasification}