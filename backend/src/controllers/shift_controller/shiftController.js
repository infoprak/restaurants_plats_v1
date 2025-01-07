const shiftService = require("../../services/shift_service/shiftService");

/***************
 * GETs
***************/
const getAll = async (req, res) => {
    try{
        let shift = await shiftService.getAll();
        if(shift.length > 0) res.status(200).send({shift})
        else res.status(404).send({error:"No shifts found"})
    } catch(e){console.log(e);res.status(500).send({error:"Internal server error"})}
}
const getCalendar = async (req, res) => {
    try {
        let calendar = await shiftService.getCalendar();
        if(calendar) res.status(200).send(calendar);
        else res.status(404).send({error:"Not found"})
    } catch(e) { console.log(e); res.status(500).send("Internal server error") }
}

module.exports = {getAll, getCalendar}