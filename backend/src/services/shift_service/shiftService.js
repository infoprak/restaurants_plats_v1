const shiftDatabase = require("../../database/shift_database/shiftDatabase");

/***************
 * GETs
***************/
const getAll = async () => {
    let shifts = await shiftDatabase.getAll();
    shifts.forEach(s => {
        let hour = (s.time).toString().substring(0,2)
        let min = (s.time).toString().substring(2,4)
        s.time = `${hour}:${min}`
    })
    return shifts
}

const getCalendar = async () => {
    let row_calendar = await shiftDatabase.getCalendar();
    let calendar = [];
    let uniqueIds = [...new Set(row_calendar.map(c => c.id))];

    uniqueIds.forEach(id => {
        let sameIdRegisters = row_calendar.filter(c => c.id == id);
        let recurrent = {
            "id": sameIdRegisters[0].id,
            "dia": sameIdRegisters[0].dia,
            "mes": sameIdRegisters[0].mes,
            "any": sameIdRegisters[0].any,
            "laboral": sameIdRegisters[0].laboral,
            "dia_setmana": sameIdRegisters[0].dia_setmana,
            "torns":[]
        }
        sameIdRegisters.forEach(reg => {recurrent.torns.push({inici:reg.inici, fi:reg.fi})});
        calendar.push(recurrent)
    });

    return calendar;
}
module.exports = { getAll, getCalendar }