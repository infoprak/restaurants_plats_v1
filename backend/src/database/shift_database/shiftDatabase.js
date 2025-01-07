const conn = require('../mysql');

/***************
 * GETs
***************/
const getAll = async () => {
    const connection = await conn.connection();
    let sql = `select * from torn`;
    try{
        const [rows, fields] = await connection.execute(sql, [])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}
const getCalendar = async () => {
    const connection = await conn.connection();
    let sql = `select r.*,s.inici, s.fi from recurrents r
    left join day_shifts df on r.id = df.id_recurrent
    left join shifts s on df.id_shift = s.id`;
    try{
        const [rows, fields] = await connection.execute(sql, [])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

module.exports = {getAll, getCalendar}