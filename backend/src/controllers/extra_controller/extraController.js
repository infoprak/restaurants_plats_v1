const extraService = require("../../services/extra_service/extraService");

/***************
 * GETs
***************/
const getAll = async (req, res) => {
    let lang = req.query.lang
    try{
        let extras = await extraService.getAll(lang);
        if(extras.length > 0) res.status(200).send({data:extras})
        else res.status(404).send({error:"No extras found"})
    } catch(e) {console.log(e); res.status(500).send({error:"Internal server error"})}
}

module.exports = {getAll}